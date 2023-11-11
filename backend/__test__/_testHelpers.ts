import algosdk from 'algosdk';
import * as algokit from '@algorandfoundation/algokit-utils';

// export const transferAsa = async () => {
//   await algosdk.asset;
// };

export const optInAsa = async (account: algosdk.Account, assetIndex: number, algod: algosdk.Algodv2) => {
  try {
    const optInTx = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: account.addr,
      to: account.addr,
      amount: 0,
      assetIndex: Number(assetIndex),
      suggestedParams: await algokit.getTransactionParams(undefined, algod),
    });
    await algokit.sendTransaction({ transaction: optInTx, from: account }, algod);
  } catch (e) {
    console.log(e);
    throw Error(e);
  }
};

export const createAsa = async (creator: algosdk.Account, name: string, unit: string, algod: algosdk.Algodv2) => {
  try {
    const suggestedParams = await algod.getTransactionParams().do();
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: creator.addr,
      suggestedParams,
      defaultFrozen: false,
      unitName: unit,
      assetName: name,
      manager: creator.addr,
      reserve: creator.addr,
      freeze: creator.addr,
      clawback: creator.addr,
      assetURL: 'http://path/to/my/asset/details',
      total: 1000,
      decimals: 0,
    });

    const result = await algokit.sendTransaction({ transaction: txn, from: creator }, algod);
    const { assetIndex } = result.confirmation!;
    if (assetIndex) {
      await optInAsa(creator, Number(assetIndex), algod);
    }

    return assetIndex;
  } catch (e) {
    console.log(e);
    throw Error(e);
  }
};
