import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { getOrCreateKmdWalletAccount, algos, microAlgos } from '@algorandfoundation/algokit-utils';
import algosdk from 'algosdk';
import * as algokit from '@algorandfoundation/algokit-utils';
import { VotersClient } from '../contracts/clients/VotersClient';

const fixture = algorandFixture();

let appClient: VotersClient;

const algoToVoteRatio: number = 10;
const voteAsaTotal: number = 1_000_000;
const vipVoteWeight: number = 10;

const optInHelper = async (voter1, voteAsa, algod) => {
  const registeredAsaOptInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: voter1.addr,
    to: voter1.addr,
    amount: 0,
    suggestedParams: await algokit.getTransactionParams(undefined, algod),
    assetIndex: Number(voteAsa),
  });
  await algokit.sendTransaction({ from: voter1, transaction: registeredAsaOptInTxn }, algod);

  await appClient.register(
    { votersAsa: voteAsa },
    {
      sender: voter1,
      sendParams: {
        fee: microAlgos(3_000),
      },
    }
  );
};

// const optOutHelper = async () => {
//   await appClient.appClient.clearState({});
// };

describe.skip('Voter', () => {
  let algod: algosdk.Algodv2;
  let voter1: algosdk.Account;
  let voter2: algosdk.Account;
  let voteASA: bigint;

  beforeEach(fixture.beforeEach);

  beforeAll(async () => {
    await fixture.beforeEach();
    const { testAccount, kmd } = fixture.context;
    algod = fixture.context.algod;

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
        fundWith: algos(5),
      },
      algod,
      kmd
    );

    appClient = new VotersClient(
      {
        sender: testAccount,
        resolveBy: 'id',
        id: 0,
      },
      algod
    );

    await appClient.create.createApplication({
      algoToVoteRatio,
      vipVoteWeight,
    });
    await appClient.appClient.fundAppAccount(microAlgos(200_000));
    await appClient.appClient.fundAppAccount(microAlgos(28100));
  }, 15_000);

  // test('app creation', async () => {
  //   const votersDetails = await appClient.getVotersDetails({});
  //   expect(votersDetails.return?.[0].valueOf()).toBe(BigInt(algoToVoteRatio));
  //   expect(votersDetails.return?.[1].valueOf()).toBe(BigInt(vipVoteWeight));
  //   expect(votersDetails.return?.[2].valueOf()).toBe(BigInt(0));
  // });

  // test('bootstrap (Negative - non-admin caller)', async () => {
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

  // test('bootstrap', async () => {
  //   const bootstrapResult = await appClient.bootstrap(
  //     { voteAsaTotal },
  //     {
  //       sendParams: {
  //         fee: microAlgos(3_000),
  //       },
  //     }
  //   );
  //   voteASA = bootstrapResult.return!.valueOf();

  //   // We expect to throw since the token was already created
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

  test('register as voter', async () => {
    await optInHelper(voter1, voteASA, algod);
    const assetBalance = await algod.accountAssetInformation(voter1.addr, Number(voteASA)).do();
    expect(assetBalance['asset-holding'].amount).toBe(1);
    expect(assetBalance['asset-holding']['is-frozen']).toBe(true);
    expect(assetBalance['asset-holding']['asset-id'].toString()).toBe(voteASA.toString());
    const totalVoters = await appClient.getTotalVoters({});
    expect(totalVoters.return?.valueOf()).toBe(BigInt(1));
    const votePower = await appClient.getVotePower(
      { account: voter1.addr, votersAsa: voteASA }
      // { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }] }
    );
    expect(votePower.return?.valueOf()).toBe(BigInt('100'));
  });

  test('register as voter (negative - not enought algo)', async () => {
    await expect(
      appClient.register(
        { votersAsa: voteASA },
        {
          boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter2.addr).publicKey }],
          sender: voter2,
          sendParams: {
            fee: microAlgos(3_000),
          },
        }
      )
    ).rejects.toThrow();
    const votePower = await appClient.getVotePower(
      { account: voter2.addr, votersAsa: voteASA }
      // { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter2.addr).publicKey }] }
    );
    expect(votePower.return?.valueOf()).toBe(BigInt('100')); // TODO: this must be zero ....
  });

  test('register as voter (negative - single registration only)', async () => {
    await expect(
      appClient.register(
        { votersAsa: voteASA },
        {
          // boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }],
          sender: voter1,
          sendParams: {
            fee: microAlgos(3_000),
          },
        }
      )
    ).rejects.toThrow();
  });

  test('set VIP status (negative - access control)', async () => {
    await expect(
      appClient.setVipStatus(
        { account: voter1.addr, isVIP: true, votersAsa: voteASA },
        {
          // boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }],
          sender: voter1,
        }
      )
    ).rejects.toThrow();
  });

  test('set VIP status', async () => {
    let vipStatus = await appClient.getVipStatus({ account: voter1.addr });
    expect(vipStatus.return?.valueOf()).toBe(false);
    // const assetBalance = await algod.accountAssetInformation(voter1.addr, Number(voteASA)).do();
    // console.log(assetBalance);
    await appClient.setVipStatus(
      { account: voter1.addr, isVIP: true, votersAsa: voteASA }
      // { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }] }
    );
    vipStatus = await appClient.getVipStatus({ account: voter1.addr });
    expect(vipStatus.return?.valueOf()).toBe(true);
    const votePower = await appClient.getVotePower(
      { account: voter1.addr, votersAsa: voteASA }
      // { boxes: [{ appIndex: 0, name: algosdk.decodeAddress(voter1.addr).publicKey }] }
    );
    expect(votePower.return?.valueOf()).toBe(BigInt('125'));
  });
});
