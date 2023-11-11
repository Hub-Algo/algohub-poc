import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { algos, getOrCreateKmdWalletAccount, microAlgos } from '@algorandfoundation/algokit-utils/.';
import algosdk, {
  makeAssetTransferTxnWithSuggestedParams,
  makeAssetTransferTxnWithSuggestedParamsFromObject,
} from 'algosdk';
import * as algokit from '@algorandfoundation/algokit-utils';
import { AlgohubMasterClient } from '../contracts/clients/AlgohubMaster';
import { CampaignClient } from '../contracts/clients/CampaignClient';
import { createAsa, optInAsa } from './_testHelpers';

const fixture = algorandFixture();

export const campaign = {
  price: 1,
  maxBuyCap: 5,
  softCap: 100,
  hardCap: 120,
  duration: 60 * 60 * 24 * 7, // 1 week in seconds
  metadataUrl: 'https://google.com',
};

describe.only('Campaign Factory', () => {
  let appClient: AlgohubMasterClient;

  const algoToVoteRatio: number = 10;
  const votingPeriod: number = 60 * 60 * 24 * 7; // 1 week in seconds
  const voteAsaTotal: number = 1_000_000;
  const vipVoteWeight: number = 10;

  let algod: algosdk.Algodv2;
  let voteAsa: bigint;
  let deployer: algosdk.Account;
  let sender1: algosdk.Account;
  let sender2: algosdk.Account;
  let voter1: algosdk.Account;
  let voter2: algosdk.Account;

  let idoAsa;
  let usdcAsa;

  const registerAsVoterHelper = async (voter: algosdk.Account) => {
    const registeredAsaOptInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: voter.addr,
      to: voter.addr,
      amount: 0,
      suggestedParams: await algokit.getTransactionParams(undefined, algod),
      assetIndex: Number(voteAsa),
    });
    await algokit.sendTransaction({ from: voter, transaction: registeredAsaOptInTxn }, algod);

    await appClient.registerAsVoter(
      { votersAsa: voteAsa },
      {
        sender: voter,
        sendParams: {
          fee: microAlgos(3_000),
        },
      }
    );
  };
  beforeEach(fixture.beforeEach);

  beforeAll(async () => {
    await fixture.beforeEach();
    const { kmd } = fixture.context;
    algod = fixture.context.algod;

    sender1 = await getOrCreateKmdWalletAccount(
      {
        name: 'sender-1',
        fundWith: algos(5000),
      },
      algod,
      kmd
    );
    sender2 = await getOrCreateKmdWalletAccount(
      {
        name: 'sender-2',
        fundWith: algos(5),
      },
      algod,
      kmd
    );
    voter1 = await getOrCreateKmdWalletAccount(
      {
        name: 'voter-1',
        fundWith: algos(100),
      },
      algod,
      kmd
    );
    voter2 = await getOrCreateKmdWalletAccount(
      {
        name: 'voter-2',
        fundWith: algos(50),
      },
      algod,
      kmd
    );
    deployer = await getOrCreateKmdWalletAccount(
      {
        name: 'DEPLOYER',
        fundWith: algos(5000),
      },
      algod,
      kmd
    );

    appClient = new AlgohubMasterClient(
      {
        sender: deployer,
        resolveBy: 'id',
        id: 0,
      },
      algod
    );

    await appClient.create.createApplication({
      algoToVoteRatio,
      vipVoteWeight,
      votingPeriod,
    });

    await appClient.appClient.fundAppAccount(microAlgos(1_000_000));
    await appClient.appClient.fundAppAccount(microAlgos(28100));

    idoAsa = await createAsa(sender1, 'IDO', 'IDO', algod);
    usdcAsa = await createAsa(sender1, 'USDC', 'USDC', algod);
  });

  test('factory creation', async () => {
    const votersDetails = await appClient.getVotersDetails({});
    expect(votersDetails.return?.[0].valueOf()).toBe(BigInt(algoToVoteRatio));
    expect(votersDetails.return?.[1].valueOf()).toBe(BigInt(vipVoteWeight));
    expect(votersDetails.return?.[2].valueOf()).toBe(BigInt(0));
    const votingPeriodOnChain = await appClient.getVotingPeriod({});
    expect(votingPeriodOnChain.return).toBe(BigInt(votingPeriod));
  });

  test('bootstrap (Negative - non-admin caller)', async () => {
    await expect(
      appClient.bootstrap(
        { voteAsaTotal },
        {
          sender: voter1,
          sendParams: {
            fee: microAlgos(3_000),
          },
        }
      )
    ).rejects.toThrow();
  });

  test('bootstrap', async () => {
    const bootstrapResult = await appClient.bootstrap(
      { voteAsaTotal },
      {
        sendParams: {
          fee: microAlgos(3_000),
        },
      }
    );
    voteAsa = bootstrapResult.return!.valueOf();

    // We expect to throw since the token was already created
    await expect(
      appClient.bootstrap(
        { voteAsaTotal },
        {
          sendParams: {
            fee: microAlgos(3_000),
          },
        }
      )
    ).rejects.toThrow();
  });

  test('register as voter', async () => {
    let votePower = await appClient.getVotePower(
      { account: voter1.addr, votersAsa: voteAsa },
      { boxes: [algosdk.decodeAddress(voter1.addr).publicKey] }
    );
    expect(votePower.return?.valueOf()).toBe(BigInt(0));

    await registerAsVoterHelper(voter1);
    const assetBalance = await algod.accountAssetInformation(voter1.addr, Number(voteAsa)).do();
    expect(assetBalance['asset-holding'].amount).toBe(1);
    expect(assetBalance['asset-holding']['is-frozen']).toBe(true);
    expect(assetBalance['asset-holding']['asset-id'].toString()).toBe(voteAsa.toString());
    const totalVoters = await appClient.getTotalVoters({});
    expect(totalVoters.return?.valueOf()).toBe(BigInt(1));
    votePower = await appClient.getVotePower(
      { account: voter1.addr, votersAsa: voteAsa },
      { boxes: [algosdk.decodeAddress(voter1.addr).publicKey] }
    );
    expect(votePower.return?.valueOf()).toBe(BigInt(100));
  });

  test('set VIP status', async () => {
    let vipStatus = await appClient.getVipStatus(
      { account: voter1.addr },
      { boxes: [algosdk.decodeAddress(voter1.addr).publicKey] }
    );
    expect(vipStatus.return?.valueOf()).toBe(false);
    await appClient.setVipStatus(
      { account: voter1.addr, isVip: true, votersAsa: voteAsa },
      { boxes: [algosdk.decodeAddress(voter1.addr).publicKey] }
    );
    vipStatus = await appClient.getVipStatus(
      { account: voter1.addr },
      { boxes: [algosdk.decodeAddress(voter1.addr).publicKey] }
    );
    expect(vipStatus.return?.valueOf()).toBe(true);
    let votePower = await appClient.getVotePower(
      { account: voter1.addr, votersAsa: voteAsa },
      { boxes: [algosdk.decodeAddress(voter1.addr).publicKey] }
    );
    expect(votePower.return?.valueOf()).toBe(BigInt('125'));

    await appClient.setVipStatus(
      { account: voter1.addr, isVip: false, votersAsa: voteAsa },
      { boxes: [algosdk.decodeAddress(voter1.addr).publicKey] }
    );
    votePower = await appClient.getVotePower(
      { account: voter1.addr, votersAsa: voteAsa },
      { boxes: [algosdk.decodeAddress(voter1.addr).publicKey] }
    );
    expect(votePower.return?.valueOf()).toBe(BigInt('100'));
  });

  test('set VIP status (negative - access control)', async () => {
    await expect(
      appClient.setVipStatus(
        { account: voter1.addr, isVip: true, votersAsa: voteAsa },
        {
          boxes: [algosdk.decodeAddress(voter1.addr).publicKey],
          sender: voter1,
        }
      )
    ).rejects.toThrow();
  });

  test('unregister as voter', async () => {
    await appClient.unregisterAsVoter(
      { votersAsa: voteAsa },
      {
        boxes: [algosdk.decodeAddress(voter1.addr).publicKey],
        sender: voter1,
        sendParams: {
          fee: microAlgos(3_000),
        },
      }
    );
    const assetBalance = await algod.accountAssetInformation(voter1.addr, Number(voteAsa)).do();
    expect(assetBalance['asset-holding'].amount).toBe(0);
    expect(assetBalance['asset-holding']['is-frozen']).toBe(false);
    expect(assetBalance['asset-holding']['asset-id'].toString()).toBe(voteAsa.toString());
    const totalVoters = await appClient.getTotalVoters({});
    expect(totalVoters.return?.valueOf()).toBe(BigInt(0));
    const votePower = await appClient.getVotePower(
      { account: voter2.addr, votersAsa: voteAsa },
      { boxes: [algosdk.decodeAddress(voter2.addr).publicKey] }
    );
    expect(votePower.return?.valueOf()).toBe(BigInt(0));
  });

  test('register as voter (negative - not enought algo)', async () => {
    await expect(
      appClient.registerAsVoter(
        { votersAsa: voteAsa },
        {
          boxes: [algosdk.decodeAddress(sender1.addr).publicKey],
          sender: sender1,
          sendParams: {
            fee: microAlgos(3_000),
          },
        }
      )
    ).rejects.toThrow();
    const votePower = await appClient.getVotePower(
      { account: sender1.addr, votersAsa: voteAsa },
      { boxes: [algosdk.decodeAddress(sender1.addr).publicKey] }
    );
    expect(votePower.return?.valueOf()).toBe(BigInt(0));
  });

  test('unregister as voter (negative - caller not voter)', async () => {
    await expect(
      appClient.unregisterAsVoter(
        { votersAsa: voteAsa },
        {
          boxes: [algosdk.decodeAddress(sender1.addr).publicKey],
          sender: sender1,
          sendParams: {
            fee: microAlgos(3_000),
          },
        }
      )
    ).rejects.toThrow();
  });

  test('set VIP status (negative - account not a voter)', async () => {
    await expect(
      appClient.setVipStatus(
        { account: sender1.addr, isVip: true, votersAsa: voteAsa },
        {
          boxes: [algosdk.decodeAddress(sender1.addr).publicKey],
        }
      )
    ).rejects.toThrow();
  });

  /// =========================
  /// === Campaign Creation ===
  /// =========================
  test('campaign creation', async () => {
    const idoAsaToTransfer = campaign.hardCap / campaign.price;
    const createCampaignTx = await appClient.createCampaign(
      {
        votersAsa: voteAsa,
        adminAccount: sender1.addr,
        idoAsa,
        buyAsa: usdcAsa,
        price: campaign.price,
        maxBuyCap: campaign.maxBuyCap,
        softCap: campaign.softCap,
        hardCap: campaign.hardCap,
        duration: campaign.duration,
        metadataUrl: campaign.metadataUrl,
      },
      {
        sender: sender1,
        sendParams: {
          fee: microAlgos(8_000),
        },
      }
    );

    const campaignAppId = createCampaignTx.return;
    const allCampaigns = await appClient.getAllCampaignApps({});
    expect(campaignAppId).toBe(allCampaigns.return?.at(0));

    const campaignContract = new CampaignClient(
      {
        sender: sender1,
        resolveBy: 'id',
        id: campaignAppId!,
      },
      algod
    );

    const campaignDetails = await campaignContract.getCampaign({});
    expect(campaignDetails.return?.at(0)).toBe(BigInt(campaign.price));
    expect(campaignDetails.return?.at(1)).toBe(BigInt(campaign.maxBuyCap));
    expect(campaignDetails.return?.at(2)).toBe(BigInt(campaign.softCap));
    expect(campaignDetails.return?.at(3)).toBe(BigInt(campaign.hardCap));
    // TODO: Assert the below - must be now + voting period
    // expect(campaignDetails.return?.at(4)).toBe(BigInt(campaign.startTime));
    // TODO: Assert the below - must be now + voting period + duration
    // expect(campaignDetails.return?.at(5)).toBe(BigInt(campaign.endTime));
    expect(campaignDetails.return?.at(6)).toBe(campaign.metadataUrl);

    const voterAsa = await campaignContract.getVotersAsa({});
    expect(voterAsa.return).toBe(BigInt(voteAsa));
    const buyAsaOnChain = await campaignContract.getBuyAsa({});
    expect(buyAsaOnChain.return).toBe(BigInt(usdcAsa));
    const idoAsaOnChain = await campaignContract.getIdoAsa({});
    expect(idoAsaOnChain.return).toBe(BigInt(idoAsa));

    const campaignContractAddr = (await campaignContract.appClient.getAppReference()).appAddress;
    const idoXferTxn = await makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: sender1.addr,
      to: campaignContractAddr,
      amount: idoAsaToTransfer,
      suggestedParams: await algokit.getTransactionParams(undefined, algod),
      assetIndex: Number(idoAsa),
    });

    await campaignContract.depositIdoAsa(
      { idoXfer: idoXferTxn, idoAsa },
      {
        sender: sender1,
      }
    );
    const idoBalance = await algod.accountAssetInformation(campaignContractAddr, Number(idoAsa)).do();
    expect(idoBalance['asset-holding'].amount).toBe(idoAsaToTransfer);
  });
});
