import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { algos, getOrCreateKmdWalletAccount, microAlgos } from '@algorandfoundation/algokit-utils/.';
import algosdk, { makeAssetTransferTxnWithSuggestedParamsFromObject } from 'algosdk';
import * as algokit from '@algorandfoundation/algokit-utils';
import { AlgohubClient } from '../contracts/clients/AlgohubClient';
import { CampaignClient } from '../contracts/clients/CampaignClient';
import { createAsa } from './_testHelpers';

const SECODNDS_IN_DAY = 60 * 60 * 24;

const campaign = {
  price: 2,
  maxBuyCap: 100,
  softCap: 100,
  hardCap: 150,
  duration: SECODNDS_IN_DAY * 7, // 1 week in seconds
  metadataUrl: 'https://google.com',
};

const vestingPercentages: number[] = [25, 25];
const vestingDurations: number[] = [0, SECODNDS_IN_DAY];

const fixture = algorandFixture();

const algoToVoteRatio: number = 10;
const votingPeriod: number = 60 * 60 * 24 * 7; // 1 week in seconds
const voteAsaTotal: number = 1_000_000;
const vipVoteWeight: number = 125;
const totalIdoTokens: number = 10000;
const totalUSDCTokens: number = 10000;

describe('Algohub App', () => {
  let appClient: AlgohubClient;
  let algohubAppId: number;
  let campaignContract: CampaignClient;
  let campaignContractAddr: string;
  let campaignDetailsOnChain;

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
    try {
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
          vestingPercentages,
          vestingDurations,
        },
        {
          sender: sender1,
          sendParams: {
            fee: microAlgos(9_000),
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
    } catch (e) {
      console.log(e);
      throw Error(e);
    }
  };

  beforeEach(fixture.beforeEach);

  beforeAll(async () => {
    await fixture.beforeEach();
    algod = fixture.context.algod;
    await algod.setBlockOffsetTimestamp(0).do();
    const { kmd } = fixture.context;

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

    // TODO: How much do we need to fund with?
    await appClient.appClient.fundAppAccount(microAlgos(2_000_000));
    algohubAppId = Number((await appClient.appClient.getAppReference()).appId);

    idoAsa = await createAsa(sender1, 'IDO', 'IDO', totalIdoTokens, algod);
    usdcAsa = await createAsa(sender1, 'USDC', 'USDC', totalUSDCTokens, algod);
    // TODO: Tranfer some of the above to other users for better tests
  });

  // test('Algohub - app creation', async () => {
  //   const votersDetails = await appClient.getVotersDetails({});
  //   expect(votersDetails.return?.[0].valueOf()).toBe(BigInt(algoToVoteRatio));
  //   expect(votersDetails.return?.[1].valueOf()).toBe(BigInt(vipVoteWeight));
  //   expect(votersDetails.return?.[2].valueOf()).toBe(BigInt(0));
  //   const votingPeriodOnChain = await appClient.getVotingPeriod({});
  //   expect(votingPeriodOnChain.return).toBe(BigInt(votingPeriod));
  // });
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
  });
  // test('Algohub - bootstrap (Negative - non-admin caller)', async () => {
  //   await expect(
  //     appClient.bootstrap(
  //       { voteAsaTotal },
  //       {
  //         sender: voter1,
  //         sendParams: {
  //           fee: microAlgos(3_000),
  //         },
  //       }
  //     )
  //   ).rejects.toThrow();
  // });
  // test('Algohub - bootstrap (Negative - vote ASA already created)', async () => {
  //   await expect(
  //     appClient.bootstrap(
  //       { voteAsaTotal },
  //       {
  //         sendParams: {
  //           fee: microAlgos(3_000),
  //         },
  //       }
  //     )
  //   ).rejects.toThrow();
  // });
  // test('Algohub - register as voter', async () => {
  //   let votePower = await appClient.getVotePower(
  //     { account: voter1.addr, votersAsa: voteAsa },
  //     { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }] }
  //   );
  //   expect(votePower.return?.valueOf()).toBe(BigInt(0));

  //   await registerAsVoterHelper(voter1);
  //   const assetBalance = await algod.accountAssetInformation(voter1.addr, Number(voteAsa)).do();
  //   expect(assetBalance['asset-holding'].amount).toBe(1);
  //   expect(assetBalance['asset-holding']['is-frozen']).toBe(true);
  //   expect(assetBalance['asset-holding']['asset-id'].toString()).toBe(voteAsa.toString());
  //   const totalVoters = await appClient.getTotalVoters({});
  //   expect(totalVoters.return?.valueOf()).toBe(BigInt(1));
  //   votePower = await appClient.getVotePower(
  //     { account: voter1.addr, votersAsa: voteAsa },
  //     { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }] }
  //   );
  //   expect(votePower.return?.valueOf()).toBe(BigInt(100));
  // });
  // test('Algohub - set VIP status', async () => {
  //   let vipStatus = await appClient.getVipStatus(
  //     { account: voter1.addr },
  //     { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }] }
  //   );
  //   expect(vipStatus.return?.valueOf()).toBe(false);
  //   await appClient.setVipStatus(
  //     { account: voter1.addr, isVip: true, votersAsa: voteAsa },
  //     { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }] }
  //   );
  //   vipStatus = await appClient.getVipStatus(
  //     { account: voter1.addr },
  //     { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }] }
  //   );
  //   expect(vipStatus.return?.valueOf()).toBe(true);
  //   let votePower = await appClient.getVotePower(
  //     { account: voter1.addr, votersAsa: voteAsa },
  //     { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }] }
  //   );
  //   expect(votePower.return?.valueOf()).toBe(BigInt(vipVoteWeight));

  //   await appClient.setVipStatus(
  //     { account: voter1.addr, isVip: false, votersAsa: voteAsa },
  //     { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }] }
  //   );
  //   votePower = await appClient.getVotePower(
  //     { account: voter1.addr, votersAsa: voteAsa },
  //     { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }] }
  //   );
  //   expect(votePower.return?.valueOf()).toBe(BigInt('100'));
  // });
  // test('Algohub - set VIP status (negative - access control)', async () => {
  //   await expect(
  //     appClient.setVipStatus(
  //       { account: voter1.addr, isVip: true, votersAsa: voteAsa },
  //       {
  //         sender: voter1,
  //         boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }],
  //       }
  //     )
  //   ).rejects.toThrow();
  // });
  // test('Algohub - unregister as voter', async () => {
  //   await appClient.unregisterAsVoter(
  //     { votersAsa: voteAsa },
  //     {
  //       boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }],
  //       sender: voter1,
  //       sendParams: {
  //         fee: microAlgos(3_000),
  //       },
  //     }
  //   );
  //   const assetBalance = await algod.accountAssetInformation(voter1.addr, Number(voteAsa)).do();
  //   expect(assetBalance['asset-holding'].amount).toBe(0);
  //   expect(assetBalance['asset-holding']['is-frozen']).toBe(false);
  //   expect(assetBalance['asset-holding']['asset-id'].toString()).toBe(voteAsa.toString());
  //   const totalVoters = await appClient.getTotalVoters({});
  //   expect(totalVoters.return?.valueOf()).toBe(BigInt(0));
  //   const votePower = await appClient.getVotePower(
  //     { account: voter2.addr, votersAsa: voteAsa },
  //     { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter2.addr).publicKey }] }
  //   );
  //   expect(votePower.return?.valueOf()).toBe(BigInt(0));
  // });
  // test('Algohub - register as voter (negative - not enought algo)', async () => {
  //   await expect(
  //     appClient.registerAsVoter(
  //       { votersAsa: voteAsa },
  //       {
  //         boxes: [{ appIndex: 0, name: algosdk.decodeAddress(sender1.addr).publicKey }],
  //         sender: sender1,
  //         sendParams: {
  //           fee: microAlgos(3_000),
  //         },
  //       }
  //     )
  //   ).rejects.toThrow();
  //   const votePower = await appClient.getVotePower(
  //     { account: sender1.addr, votersAsa: voteAsa },
  //     { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(sender1.addr).publicKey }] }
  //   );
  //   expect(votePower.return?.valueOf()).toBe(BigInt(0));
  // });
  // test('Algohub - unregister as voter (negative - caller not voter)', async () => {
  //   await expect(
  //     appClient.unregisterAsVoter(
  //       { votersAsa: voteAsa },
  //       {
  //         boxes: [{ appIndex: 0, name: algosdk.decodeAddress(sender1.addr).publicKey }],
  //         sender: sender1,
  //         sendParams: {
  //           fee: microAlgos(3_000),
  //         },
  //       }
  //     )
  //   ).rejects.toThrow();
  // });
  // test('Algohub - set VIP status (negative - account not a voter)', async () => {
  //   await expect(
  //     appClient.setVipStatus(
  //       { account: sender1.addr, isVip: true, votersAsa: voteAsa },
  //       {
  //         boxes: [{ appIndex: 0, name: algosdk.decodeAddress(sender1.addr).publicKey }],
  //       }
  //     )
  //   ).rejects.toThrow();
  // });

  /// =========================
  /// === Campaign Creation ===
  /// =========================
  test('Campaign Contract - Campaign details and Assets', async () => {
    campaignContract = await createCampaignFromFactory();
    console.log('campaignContract', campaignContract);
    await campaignContract.appClient.fundAppAccount(algokit.microAlgos(1_000_000));
    campaignDetailsOnChain = await campaignContract.getCampaign({});
    expect(campaignDetailsOnChain.return?.at(0)).toBe(BigInt(campaign.price));
    expect(campaignDetailsOnChain.return?.at(1)).toBe(BigInt(campaign.maxBuyCap));
    expect(campaignDetailsOnChain.return?.at(2)).toBe(BigInt(campaign.softCap));
    expect(campaignDetailsOnChain.return?.at(3)).toBe(BigInt(campaign.hardCap));
    expect(campaignDetailsOnChain.return?.at(4)).toBe(BigInt(0)); // purchased amount
    expect(campaignDetailsOnChain.return?.at(5)).toBe(BigInt(0)); // withdrawnAmount
    // TODO: Assert the below - must be now + voting period
    // expect(campaignDetailsOnChain.return?.at(6)).toBe(BigInt(campaign.startTime));
    // TODO: Assert the below - must be now + voting period + duration
    // expect(campaignDetailsOnChain.return?.at(7)).toBe(BigInt(campaign.endTime));
    expect(campaignDetailsOnChain.return?.at(8)).toBe(campaign.metadataUrl);

    const voterAsa = await campaignContract.getVotersAsa({});
    expect(voterAsa.return).toBe(BigInt(voteAsa));
    const buyAsaOnChain = await campaignContract.getBuyAsa({});
    expect(buyAsaOnChain.return).toBe(BigInt(usdcAsa));
    const idoAsaOnChain = await campaignContract.getIdoAsa({});
    expect(idoAsaOnChain.return).toBe(BigInt(idoAsa));

    const vestingDetails = await campaignContract.getVestingSchedule({});
    expect(vestingDetails.return?.at(0)).toBe(BigInt(vestingPercentages.length));
    expect((vestingDetails.return?.at(1) as BigInt[])?.length).toBe(vestingPercentages.length);
    expect((vestingDetails.return?.at(2) as BigInt[])?.length).toBe(vestingDurations.length);
    // TODO: Ideally check the actual values as well - vestingDurations needs casting to big ints
  });
  test('Campaign Contract - deposit IDO asset', async () => {
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
  // TODO: Hypelisting tests ...

  test('Campaign Contract - buy()', async () => {
    const buyCost = campaign.maxBuyCap * campaign.price;
    const buyXferTxn = await makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: sender1.addr,
      to: campaignContractAddr,
      amount: buyCost,
      suggestedParams: await algokit.getTransactionParams(undefined, algod),
      assetIndex: Number(usdcAsa),
    });
    await algod.setBlockOffsetTimestamp(votingPeriod + campaign.duration).do();

    const usdcBalanceBefore = await algod.accountAssetInformation(sender1.addr, Number(usdcAsa)).do();
    expect(BigInt(usdcBalanceBefore['asset-holding'].amount)).toBe(BigInt(totalIdoTokens));

    await campaignContract.buy(
      { buyAsaXfer: buyXferTxn, buyAsa: usdcAsa, buyAmount: campaign.maxBuyCap },
      {
        sender: sender1,
        boxes: [new Uint8Array(Buffer.concat([Buffer.from('p'), algosdk.decodeAddress(sender1.addr).publicKey]))],
      }
    );
    const usdcBalanceAfter = await algod.accountAssetInformation(sender1.addr, Number(usdcAsa)).do();
    expect(BigInt(usdcBalanceAfter['asset-holding'].amount)).toBe(
      BigInt(usdcBalanceBefore['asset-holding'].amount) - BigInt(buyCost)
    );
    campaignDetailsOnChain = await campaignContract.getCampaign({});
    expect(campaignDetailsOnChain.return?.at(4)).toBe(BigInt(campaign.maxBuyCap)); // purchased amount
  });
  test('Campaign Contract - buy() - negative (hardcap reached)', async () => {
    const buyCost = campaign.price * campaign.maxBuyCap;
    const buyXferTxn = await makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: sender1.addr,
      to: campaignContractAddr,
      amount: buyCost,
      suggestedParams: await algokit.getTransactionParams(undefined, algod),
      assetIndex: Number(usdcAsa),
    });

    await expect(
      campaignContract.buy(
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
      )
    ).rejects.toThrow();
  });

  test('Campaign Contract - claim()', async () => {
    // try {
    const claimAmount = await campaignContract.getAccountTotalPurchases(
      { account: sender1.addr },
      { boxes: [new Uint8Array(Buffer.concat([Buffer.from('p'), algosdk.decodeAddress(sender1.addr).publicKey]))] }
    );
    const idoTokensTobeClaimed = Number(claimAmount.return!) / campaign.price; // * 0.25;
    const idoBalanceBefore = await algod.accountAssetInformation(sender1.addr, Number(idoAsa)).do();
    await campaignContract.claim(
      { idoAsa },
      {
        sender: sender1,
        sendParams: {
          fee: microAlgos(3_000),
        },
        // apps: [algohubAppId],
        boxes: [
          new Uint8Array(Buffer.concat([Buffer.from('c'), algosdk.decodeAddress(sender1.addr).publicKey])),
          new Uint8Array(Buffer.concat([Buffer.from('p'), algosdk.decodeAddress(sender1.addr).publicKey])),
        ],
      }
    );
    const idoBalanceAfter = await algod.accountAssetInformation(sender1.addr, Number(idoAsa)).do();
    expect(BigInt(idoBalanceAfter['asset-holding'].amount)).toBe(
      BigInt(idoBalanceBefore['asset-holding'].amount + idoTokensTobeClaimed)
    );
    // } catch (e) {
    //   console.log(e);
    //   throw new Error(e);
    // }
  });

  test('Campaign Contract - withdrawIdoAsa()', async () => {
    const campaingDetails = await campaignContract.getCampaign({});
    const idoTokensTobeClaimed = (Number(campaign.hardCap) - Number(campaingDetails.return![4])) / campaign.price; // (hardcap - purchased) / price
    const idoBalanceBefore = await algod.accountAssetInformation(sender1.addr, Number(idoAsa)).do();
    await campaignContract.withdrawIdoAsa(
      { idoAsa },
      {
        sendParams: {
          fee: microAlgos(2_000),
        },
      }
    );
    const idoBalanceAfter = await algod.accountAssetInformation(sender1.addr, Number(idoAsa)).do();
    expect(BigInt(idoBalanceAfter['asset-holding'].amount)).toBe(
      BigInt(idoBalanceBefore['asset-holding'].amount + idoTokensTobeClaimed)
    );
  });

  // test('Campaign Contract - withdrawIdoAsa() - all tokens for not approved campaign', async () => {
  //   // TODO: Add voting logic in place before testing this out
  // });

  test('Campaign Contract - withdrawSales()', async () => {
    const usdcBalanceBefore = await algod.accountAssetInformation(sender1.addr, Number(usdcAsa)).do();
    const usdcTokensToWithdraw = campaign.maxBuyCap * campaign.price;
    await campaignContract.withdrawSales(
      { buyAsa: usdcAsa },
      {
        sendParams: {
          fee: microAlgos(2_000),
        },
      }
    );
    const usdcBalanceAfter = await algod.accountAssetInformation(sender1.addr, Number(usdcAsa)).do();
    expect(BigInt(usdcBalanceAfter['asset-holding'].amount)).toBe(
      BigInt(usdcBalanceBefore['asset-holding'].amount + usdcTokensToWithdraw)
    );
  });

  // test('Campaign Contract - withdrawInvestment()', async () => {
  //   // TODO: Add voting logic in place before testing this out
  // });

  // test('Campaign Contract - withdrawInvestment() - negative (campaign is approved)', async () => {
  //   await expect(
  //     campaignContract.withdrawInvestment(
  //       { buyAsa: usdcAsa },
  //       {
  //         boxes: [new Uint8Array(Buffer.concat([Buffer.from('p'), algosdk.decodeAddress(sender1.addr).publicKey]))],
  //       }
  //     )
  //   ).rejects.toThrow();
  // });
});
