import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { algos, getOrCreateKmdWalletAccount, microAlgos } from '@algorandfoundation/algokit-utils/.';
import algosdk, { makeAssetTransferTxnWithSuggestedParamsFromObject } from 'algosdk';
import * as algokit from '@algorandfoundation/algokit-utils';
import { AlgohubClient } from '../contracts/clients/AlgohubClient';
import { CampaignClient } from '../contracts/clients/CampaignClient';
import { createAsa } from './_testHelpers';

const fixture = algorandFixture();

export const campaign = {
  price: 1,
  maxBuyCap: 5,
  softCap: 100,
  hardCap: 120,
  duration: 60 * 60 * 24 * 7, // 1 week in seconds
  metadataUrl: 'https://google.com',
};

describe('Algohub App', () => {
  let appClient: AlgohubClient;
  let campaignContract: CampaignClient;
  let campaignContractAddr: string;
  let campaignContractAppId: number | bigint;

  const algoToVoteRatio: number = 10;
  const votingPeriod: number = 60 * 60 * 24 * 7; // 1 week in seconds
  const voteAsaTotal: number = 1_000_000;
  const vipVoteWeight: number = 125;

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

  const createCampaignFromFactory = async (): Promise<CampaignClient> => {
    const createCampaignTx = await appClient.createCampaign(
      {
        votersAsa: voteAsa,
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

    const campaignContractX = new CampaignClient(
      {
        sender: sender1,
        resolveBy: 'id',
        id: campaignAppId!,
      },
      algod
    );
    campaignContractAddr = (await campaignContractX.appClient.getAppReference()).appAddress;

    return campaignContractX;
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

    appClient = new AlgohubClient(
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

    await appClient.appClient.fundAppAccount(microAlgos(2_000_000));

    idoAsa = await createAsa(sender1, 'IDO', 'IDO', algod);
    usdcAsa = await createAsa(sender1, 'USDC', 'USDC', algod);
  });

  test('Algohub - app creation', async () => {
    const votersDetails = await appClient.getVotersDetails({});
    expect(votersDetails.return?.[0].valueOf()).toBe(BigInt(algoToVoteRatio));
    expect(votersDetails.return?.[1].valueOf()).toBe(BigInt(vipVoteWeight));
    expect(votersDetails.return?.[2].valueOf()).toBe(BigInt(0));
    const votingPeriodOnChain = await appClient.getVotingPeriod({});
    expect(votingPeriodOnChain.return).toBe(BigInt(votingPeriod));
  });

  test('Algohub - bootstrap (Negative - non-admin caller)', async () => {
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

  test('Algohub - bootstrap', async () => {
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

  test('Algohub - register as voter', async () => {
    let votePower = await appClient.getVotePower(
      { account: voter1.addr, votersAsa: voteAsa },
      { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }] }
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
      { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }] }
    );
    expect(votePower.return?.valueOf()).toBe(BigInt(100));
  });

  test('Algohub - set VIP status', async () => {
    let vipStatus = await appClient.getVipStatus(
      { account: voter1.addr },
      { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }] }
    );
    expect(vipStatus.return?.valueOf()).toBe(false);
    await appClient.setVipStatus(
      { account: voter1.addr, isVip: true, votersAsa: voteAsa },
      { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }] }
    );
    vipStatus = await appClient.getVipStatus(
      { account: voter1.addr },
      { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }] }
    );
    expect(vipStatus.return?.valueOf()).toBe(true);
    let votePower = await appClient.getVotePower(
      { account: voter1.addr, votersAsa: voteAsa },
      { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }] }
    );
    expect(votePower.return?.valueOf()).toBe(BigInt(vipVoteWeight));

    await appClient.setVipStatus(
      { account: voter1.addr, isVip: false, votersAsa: voteAsa },
      { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }] }
    );
    votePower = await appClient.getVotePower(
      { account: voter1.addr, votersAsa: voteAsa },
      { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }] }
    );
    expect(votePower.return?.valueOf()).toBe(BigInt('100'));
  });

  test('Algohub - set VIP status (negative - access control)', async () => {
    await expect(
      appClient.setVipStatus(
        { account: voter1.addr, isVip: true, votersAsa: voteAsa },
        {
          sender: voter1,
          boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }],
        }
      )
    ).rejects.toThrow();
  });

  test('Algohub - unregister as voter', async () => {
    await appClient.unregisterAsVoter(
      { votersAsa: voteAsa },
      {
        boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }],
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
      { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter2.addr).publicKey }] }
    );
    expect(votePower.return?.valueOf()).toBe(BigInt(0));
  });

  test('Algohub - register as voter (negative - not enought algo)', async () => {
    await expect(
      appClient.registerAsVoter(
        { votersAsa: voteAsa },
        {
          boxes: [{ appIndex: 0, name: algosdk.decodeAddress(sender1.addr).publicKey }],
          sender: sender1,
          sendParams: {
            fee: microAlgos(3_000),
          },
        }
      )
    ).rejects.toThrow();
    const votePower = await appClient.getVotePower(
      { account: sender1.addr, votersAsa: voteAsa },
      { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(sender1.addr).publicKey }] }
    );
    expect(votePower.return?.valueOf()).toBe(BigInt(0));
  });

  test('Algohub - unregister as voter (negative - caller not voter)', async () => {
    await expect(
      appClient.unregisterAsVoter(
        { votersAsa: voteAsa },
        {
          boxes: [{ appIndex: 0, name: algosdk.decodeAddress(sender1.addr).publicKey }],
          sender: sender1,
          sendParams: {
            fee: microAlgos(3_000),
          },
        }
      )
    ).rejects.toThrow();
  });

  test('Algohub - set VIP status (negative - account not a voter)', async () => {
    await expect(
      appClient.setVipStatus(
        { account: sender1.addr, isVip: true, votersAsa: voteAsa },
        {
          boxes: [{ appIndex: 0, name: algosdk.decodeAddress(sender1.addr).publicKey }],
        }
      )
    ).rejects.toThrow();
  });

  /// =========================
  /// === Campaign Creation ===
  /// =========================
  test('Campaign Contract - Campaign details and Assets', async () => {
    campaignContract = await createCampaignFromFactory();
    await campaignContract.appClient.fundAppAccount(algokit.microAlgos(1_000_000));
    const campaignDetails = await campaignContract.getCampaign({});
    expect(campaignDetails.return?.at(0)).toBe(BigInt(campaign.price));
    expect(campaignDetails.return?.at(1)).toBe(BigInt(campaign.maxBuyCap));
    expect(campaignDetails.return?.at(2)).toBe(BigInt(campaign.softCap));
    expect(campaignDetails.return?.at(3)).toBe(BigInt(campaign.hardCap));
    expect(campaignDetails.return?.at(4)).toBe(BigInt(0));
    // TODO: Assert the below - must be now + voting period
    // expect(campaignDetails.return?.at(5)).toBe(BigInt(campaign.startTime));
    // TODO: Assert the below - must be now + voting period + duration
    // expect(campaignDetails.return?.at(6)).toBe(BigInt(campaign.endTime));
    expect(campaignDetails.return?.at(7)).toBe(campaign.metadataUrl);

    const voterAsa = await campaignContract.getVotersAsa({});
    expect(voterAsa.return).toBe(BigInt(voteAsa));
    const buyAsaOnChain = await campaignContract.getBuyAsa({});
    expect(buyAsaOnChain.return).toBe(BigInt(usdcAsa));
    const idoAsaOnChain = await campaignContract.getIdoAsa({});
    expect(idoAsaOnChain.return).toBe(BigInt(idoAsa));
  });

  test('Campaign Contract - deposit IDO asset', async () => {
    campaignContractAppId = (await campaignContract.appClient.getAppReference()).appId;
    const idoAsaToTransfer = campaign.hardCap / campaign.price;
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
    expect(BigInt(idoBalance['asset-holding'].amount)).toBe(BigInt(idoAsaToTransfer));
  });

  test('Campaign Contract - deposit IDO asset (negative - invalid amount)', async () => {
    const idoAsaToTransfer = campaign.hardCap / campaign.price - 1;
    const idoXferTxn = await makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: sender1.addr,
      to: campaignContractAddr,
      amount: idoAsaToTransfer,
      suggestedParams: await algokit.getTransactionParams(undefined, algod),
      assetIndex: Number(idoAsa),
    });

    await expect(
      campaignContract.depositIdoAsa(
        { idoXfer: idoXferTxn, idoAsa },
        {
          sender: sender1,
        }
      )
    ).rejects.toThrow();
  });
  test('Campaign Contract - deposit IDO asset (negative - access control)', async () => {
    const idoAsaToTransfer = campaign.hardCap / campaign.price;
    const idoXferTxn = await makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: sender2.addr,
      to: campaignContractAddr,
      amount: idoAsaToTransfer,
      suggestedParams: await algokit.getTransactionParams(undefined, algod),
      assetIndex: Number(idoAsa),
    });
    await expect(
      campaignContract.depositIdoAsa(
        { idoXfer: idoXferTxn, idoAsa },
        {
          sender: sender2,
        }
      )
    ).rejects.toThrow();
  });

  // TODO: Do the voing tests here

  test('Campaign Contract - buy()', async () => {
    const buyCost = campaign.price * campaign.maxBuyCap;
    const buyXferTxn = await makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: sender1.addr,
      to: campaignContractAddr,
      amount: buyCost,
      suggestedParams: await algokit.getTransactionParams(undefined, algod),
      assetIndex: Number(usdcAsa),
    });

    const usdcBalanceBefore = await algod.accountAssetInformation(sender1.addr, Number(usdcAsa)).do();
    expect(BigInt(usdcBalanceBefore['asset-holding'].amount)).toBe(BigInt(1000));

    await algod.setBlockOffsetTimestamp(votingPeriod).do();

    await campaignContract.buy(
      { buyAsaXfer: buyXferTxn, buyAsa: usdcAsa, buyAmount: campaign.maxBuyCap },
      {
        sender: sender1,
        boxes: [
          {
            appIndex: 0,
            name: new Uint8Array(Buffer.concat([Buffer.from('p'), algosdk.decodeAddress(sender1.addr).publicKey])),
          },
        ],
      }
    );
    const usdcBalanceAfter = await algod.accountAssetInformation(sender1.addr, Number(usdcAsa)).do();
    expect(BigInt(usdcBalanceAfter['asset-holding'].amount)).toBe(
      BigInt(usdcBalanceBefore['asset-holding'].amount) - BigInt(buyCost)
    );
  });
});
