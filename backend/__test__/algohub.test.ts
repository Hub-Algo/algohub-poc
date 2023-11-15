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
  conversionRate: 50,
  maxInvestmentPerAccount: 100,
  minTotalInvestment: 100,
  maxTotalInvestment: 150,
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
          idoAsa: idoAsa.index,
          investmentAsa: usdcAsa.index,
          conversionRate: campaign.conversionRate,
          maxInvestmentPerAccount: campaign.maxInvestmentPerAccount,
          minTotalInvestment: campaign.minTotalInvestment,
          maxTotalInvestment: campaign.maxTotalInvestment,
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
        // sender: deployer,
        resolveBy: 'id',
        id: 0,
      },
      algod
    );

    await appClient.create.createApplication(
      {
        algoToVoteRatio,
        vipVoteWeight,
        votingPeriod,
      },
      {
        sender: deployer,
      }
    );

    // TODO: How much do we need to fund with?
    await appClient.appClient.fundAppAccount({ amount: microAlgos(2_000_000), sender: sender1 });
    algohubAppId = Number((await appClient.appClient.getAppReference()).appId);

    const idoAsaId = await createAsa(sender1, 'IDO', 'IDO', totalIdoTokens, algod);
    const usdcAsaId = await createAsa(sender1, 'USDC', 'USDC', totalUSDCTokens, algod);
    idoAsa = await algod.getAssetByID(Number(idoAsaId)).do();
    usdcAsa = await algod.getAssetByID(Number(usdcAsaId)).do();
    // TODO: Tranfer some of the above to other users for better tests
  });

  test('Algohub - app creation', async () => {
    // console.log('==============================');

    const votersDetails = await appClient.getVotersDetails({}, { sender: sender1 });
    // const simulateResult = await (
    //   await appClient.compose().getVotersDetails({}, { sender: sender1 }).atc()
    // ).simulate(algod);

    // expect(simulateResult.methodResults?.[0].returnValue).toBe(expectedValue);
    // console.log(simulateResult);
    // const state = await appClient.appClient.getGlobalState();
    // console.log(state);

    // console.log('==============================');
    expect(votersDetails.return?.[0].valueOf()).toBe(BigInt(algoToVoteRatio));
    expect(votersDetails.return?.[1].valueOf()).toBe(BigInt(vipVoteWeight));
    expect(votersDetails.return?.[2].valueOf()).toBe(BigInt(0));
    // const votingPeriodOnChain = await appClient.getVotingPeriod({});
    // expect(votingPeriodOnChain.return).toBe(BigInt(votingPeriod));
  });
  // test('Algohub - bootstrap', async () => {
  //   const bootstrapResult = await appClient.bootstrap(
  //     { voteAsaTotal },
  //     {
  //       sendParams: {
  //         fee: microAlgos(3_000),
  //       },
  //     }
  //   );
  //   voteAsa = bootstrapResult.return!.valueOf();
  // });
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

  // /// =========================
  // /// === Campaign Creation ===
  // /// =========================
  // test('Campaign Contract - Campaign details and Assets', async () => {
  //   campaignContract = await createCampaignFromFactory();
  //   await campaignContract.appClient.fundAppAccount(algokit.microAlgos(1_000_000));
  //   campaignDetailsOnChain = await campaignContract.getCampaign({});
  //   expect(campaignDetailsOnChain.return?.at(0)).toBe(BigInt(campaign.conversionRate));
  //   expect(campaignDetailsOnChain.return?.at(1)).toBe(
  //     BigInt(campaign.maxInvestmentPerAccount * 10 ** usdcAsa.params.decimals)
  //   );
  //   expect(campaignDetailsOnChain.return?.at(2)).toBe(
  //     BigInt(campaign.minTotalInvestment * 10 ** usdcAsa.params.decimals)
  //   );
  //   expect(campaignDetailsOnChain.return?.at(3)).toBe(
  //     BigInt(campaign.maxTotalInvestment * 10 ** usdcAsa.params.decimals)
  //   );
  //   expect(campaignDetailsOnChain.return?.at(4)).toBe(BigInt(0)); // investment amount
  //   expect(campaignDetailsOnChain.return?.at(5)).toBe(BigInt(0)); // withdrawnAmount
  //   // TODO: Assert the below - must be now + voting period
  //   // expect(campaignDetailsOnChain.return?.at(6)).toBe(BigInt(campaign.startTime));
  //   // TODO: Assert the below - must be now + voting period + duration
  //   // expect(campaignDetailsOnChain.return?.at(7)).toBe(BigInt(campaign.endTime));
  //   expect(campaignDetailsOnChain.return?.at(8)).toBe(campaign.metadataUrl);

  //   const voterAsa = await campaignContract.getVotersAsa({});
  //   expect(voterAsa.return).toBe(BigInt(voteAsa));
  //   const investmentAsaOnChain = await campaignContract.getInvestmentAsa({});
  //   expect(investmentAsaOnChain.return).toBe(BigInt(usdcAsa.index));
  //   const idoAsaOnChain = await campaignContract.getIdoAsa({});
  //   expect(idoAsaOnChain.return).toBe(BigInt(idoAsa.index));

  //   const vestingDetails = await campaignContract.getVestingSchedule({});
  //   expect(vestingDetails.return?.at(0)).toBe(BigInt(vestingPercentages.length));
  //   expect((vestingDetails.return?.at(1) as BigInt[])?.length).toBe(vestingPercentages.length);
  //   expect((vestingDetails.return?.at(2) as BigInt[])?.length).toBe(vestingDurations.length);
  //   // TODO: Ideally check the actual values as well - vestingDurations needs casting to big ints
  // });
  // test('Campaign Contract - deposit IDO asset', async () => {
  //   const idoAsaToTransfer =
  //     BigInt(campaign.maxTotalInvestment * 100 * 10 ** usdcAsa.params.decimals) / BigInt(campaign.conversionRate);
  //   const idoXferTxn = await makeAssetTransferTxnWithSuggestedParamsFromObject({
  //     from: sender1.addr,
  //     to: campaignContractAddr,
  //     amount: idoAsaToTransfer,
  //     suggestedParams: await algokit.getTransactionParams(undefined, algod),
  //     assetIndex: Number(idoAsa.index),
  //   });

  //   await campaignContract.depositIdoAsa(
  //     { idoXfer: idoXferTxn, idoAsa: idoAsa.index },
  //     {
  //       sender: sender1,
  //     }
  //   );
  //   const idoBalance = await algod.accountAssetInformation(campaignContractAddr, Number(idoAsa.index)).do();
  //   expect(BigInt(idoBalance['asset-holding'].amount)).toBe(BigInt(idoAsaToTransfer));
  // });
  // test('Campaign Contract - deposit IDO asset (negative - invalid amount)', async () => {
  //   const idoAsaToTransfer =
  //     BigInt(campaign.maxTotalInvestment * 100 * 10 ** usdcAsa.params.decimals) / BigInt(campaign.conversionRate) -
  //     BigInt(1);
  //   const idoXferTxn = await makeAssetTransferTxnWithSuggestedParamsFromObject({
  //     from: sender1.addr,
  //     to: campaignContractAddr,
  //     amount: idoAsaToTransfer,
  //     suggestedParams: await algokit.getTransactionParams(undefined, algod),
  //     assetIndex: Number(idoAsa.index),
  //   });

  //   await expect(
  //     campaignContract.depositIdoAsa(
  //       { idoXfer: idoXferTxn, idoAsa: idoAsa.index },
  //       {
  //         sender: sender1,
  //       }
  //     )
  //   ).rejects.toThrow();
  // });
  // test('Campaign Contract - deposit IDO asset (negative - access control)', async () => {
  //   const idoAsaToTransfer = (campaign.maxTotalInvestment * 100) / campaign.conversionRate;
  //   const idoXferTxn = await makeAssetTransferTxnWithSuggestedParamsFromObject({
  //     from: sender2.addr,
  //     to: campaignContractAddr,
  //     amount: idoAsaToTransfer,
  //     suggestedParams: await algokit.getTransactionParams(undefined, algod),
  //     assetIndex: Number(idoAsa.index),
  //   });
  //   await expect(
  //     campaignContract.depositIdoAsa(
  //       { idoXfer: idoXferTxn, idoAsa: idoAsa.index },
  //       {
  //         sender: sender2,
  //       }
  //     )
  //   ).rejects.toThrow();
  // });

  // // // TODO: Do the voing tests here
  // // // TODO: Hypelisting tests ...

  // test('Campaign Contract - invest()', async () => {
  //   const investCost = campaign.maxInvestmentPerAccount;
  //   const investXferTxn = await makeAssetTransferTxnWithSuggestedParamsFromObject({
  //     from: sender1.addr,
  //     to: campaignContractAddr,
  //     amount: investCost * 10 ** usdcAsa.params.decimals,
  //     suggestedParams: await algokit.getTransactionParams(undefined, algod),
  //     assetIndex: Number(usdcAsa.index),
  //   });
  //   await algod.setBlockOffsetTimestamp(votingPeriod + campaign.duration).do();

  //   const usdcBalanceBefore = await algod.accountAssetInformation(sender1.addr, Number(usdcAsa.index)).do();
  //   expect(BigInt(usdcBalanceBefore['asset-holding'].amount)).toBe(
  //     BigInt(totalIdoTokens * 10 ** usdcAsa.params.decimals)
  //   );

  //   await campaignContract.invest(
  //     {
  //       investmentAsaXfer: investXferTxn,
  //       investmentAsa: usdcAsa.index,
  //       investmentAmount: campaign.maxInvestmentPerAccount,
  //     },
  //     {
  //       sender: sender1,
  //       boxes: [new Uint8Array(Buffer.concat([Buffer.from('p'), algosdk.decodeAddress(sender1.addr).publicKey]))],
  //     }
  //   );
  //   const usdcBalanceAfter = await algod.accountAssetInformation(sender1.addr, Number(usdcAsa.index)).do();
  //   expect(BigInt(usdcBalanceAfter['asset-holding'].amount)).toBe(
  //     BigInt(usdcBalanceBefore['asset-holding'].amount) - BigInt(investCost * 10 ** usdcAsa.params.decimals)
  //   );
  //   campaignDetailsOnChain = await campaignContract.getCampaign({});
  //   expect(campaignDetailsOnChain.return?.at(4)).toBe(
  //     BigInt(campaign.maxInvestmentPerAccount * 10 ** usdcAsa.params.decimals)
  //   ); // investment amount
  // });
  // test('Campaign Contract - invest() - negative (hardcap reached)', async () => {
  //   const investCost = campaign.maxInvestmentPerAccount;
  //   const investXferTxn = await makeAssetTransferTxnWithSuggestedParamsFromObject({
  //     from: sender1.addr,
  //     to: campaignContractAddr,
  //     amount: investCost,
  //     suggestedParams: await algokit.getTransactionParams(undefined, algod),
  //     assetIndex: Number(usdcAsa.index),
  //   });

  //   await expect(
  //     campaignContract.invest(
  //       {
  //         investmentAsaXfer: investXferTxn,
  //         investmentAsa: usdcAsa.index,
  //         investmentAmount: campaign.maxInvestmentPerAccount,
  //       },
  //       {
  //         sender: sender1,
  //         boxes: [
  //           {
  //             appIndex: 0,
  //             name: new Uint8Array(Buffer.concat([Buffer.from('p'), algosdk.decodeAddress(sender1.addr).publicKey])),
  //           },
  //         ],
  //       }
  //     )
  //   ).rejects.toThrow();
  // });

  // test('Campaign Contract - claim()', async () => {
  //   const claimAmount = await campaignContract.getAccountTotalPurchases(
  //     { account: sender1.addr },
  //     { boxes: [new Uint8Array(Buffer.concat([Buffer.from('p'), algosdk.decodeAddress(sender1.addr).publicKey]))] }
  //   );
  //   const idoTokensTobeClaimed = (Number(claimAmount.return!) * 100) / campaign.conversionRate; // * 0.25;
  //   const idoBalanceBefore = await algod.accountAssetInformation(sender1.addr, Number(idoAsa.index)).do();
  //   await campaignContract.claim(
  //     { idoAsa: idoAsa.index },
  //     {
  //       sender: sender1,
  //       sendParams: {
  //         fee: microAlgos(3_000),
  //       },
  //       // apps: [algohubAppId],
  //       boxes: [
  //         new Uint8Array(Buffer.concat([Buffer.from('c'), algosdk.decodeAddress(sender1.addr).publicKey])),
  //         new Uint8Array(Buffer.concat([Buffer.from('p'), algosdk.decodeAddress(sender1.addr).publicKey])),
  //       ],
  //     }
  //   );
  //   const idoBalanceAfter = await algod.accountAssetInformation(sender1.addr, Number(idoAsa.index)).do();
  //   expect(BigInt(idoBalanceAfter['asset-holding'].amount)).toBe(
  //     BigInt(idoBalanceBefore['asset-holding'].amount + idoTokensTobeClaimed)
  //   );
  // });

  // test('Campaign Contract - withdrawIdoAsa()', async () => {
  //   const campaingDetails = await campaignContract.getCampaign({});
  //   const idoTokensTobeClaimed =
  //     ((Number(campaign.maxTotalInvestment * 10 ** idoAsa.params.decimals) - Number(campaingDetails.return![4])) *
  //       100) /
  //     campaign.conversionRate; // (hardcap - investment) / conversionRate
  //   const idoBalanceBefore = await algod.accountAssetInformation(sender1.addr, Number(idoAsa.index)).do();
  //   await campaignContract.withdrawIdoAsa(
  //     { idoAsa: idoAsa.index },
  //     {
  //       sendParams: {
  //         fee: microAlgos(2_000),
  //       },
  //     }
  //   );
  //   const idoBalanceAfter = await algod.accountAssetInformation(sender1.addr, Number(idoAsa.index)).do();
  //   expect(BigInt(idoBalanceAfter['asset-holding'].amount)).toBe(
  //     BigInt(idoBalanceBefore['asset-holding'].amount + idoTokensTobeClaimed)
  //   );
  // });

  // // test('Campaign Contract - withdrawIdoAsa() - all tokens for not approved campaign', async () => {
  // //   // TODO: Add voting logic in place before testing this out
  // // });

  // test('Campaign Contract - withdrawSales()', async () => {
  //   const usdcBalanceBefore = await algod.accountAssetInformation(sender1.addr, Number(usdcAsa.index)).do();
  //   // const usdcTokensToWithdraw =
  //   //   (campaign.maxInvestmentPerAccount * 10 ** idoAsa.params * 100) / campaign.conversionRate;
  //   await campaignContract.withdrawSales(
  //     { investmentAsa: usdcAsa.index },
  //     {
  //       sendParams: {
  //         fee: microAlgos(2_000),
  //       },
  //     }
  //   );
  //   const usdcBalanceAfter = await algod.accountAssetInformation(sender1.addr, Number(usdcAsa.index)).do();
  //   expect(BigInt(usdcBalanceAfter['asset-holding'].amount)).toBe(
  //     BigInt(
  //       usdcBalanceBefore['asset-holding'].amount + campaign.maxInvestmentPerAccount * 10 ** usdcAsa.params.decimals
  //     )
  //   );
  // });

  // // test('Campaign Contract - withdrawInvestment()', async () => {
  // //   // TODO: Add voting logic in place before testing this out
  // // });

  // test('Campaign Contract - withdrawInvestment() - negative (campaign is approved)', async () => {
  //   await expect(
  //     campaignContract.withdrawInvestment(
  //       { investmentAsa: usdcAsa.index },
  //       {
  //         boxes: [new Uint8Array(Buffer.concat([Buffer.from('p'), algosdk.decodeAddress(sender1.addr).publicKey]))],
  //       }
  //     )
  //   ).rejects.toThrow();
  // });
});
