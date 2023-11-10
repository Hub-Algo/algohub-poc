import algosdk from 'algosdk';
import * as algokit from '@algorandfoundation/algokit-utils';

export const createAsa = async (creator: algosdk.Account, name: string, unit: string, algod: algosdk.Algodv2) => {
  console.log('xxxx');
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
  console.log('txn', txn);

  // const registeredAsaTransferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
  //   from: sender.addr,
  //   to: sender.addr,
  //   amount: 1,
  //   assetIndex: Number(registeredASA),
  //   suggestedParams: await algokit.getTransactionParams(undefined, algod),
  // });

  // const result = await algokit.sendTransaction({ transaction: txn, from: creator }, algod);
  // console.log('result', result);
  const signedTxn = txn.signTxn(creator.sk);
  await algod.sendRawTransaction(signedTxn).do();
  const result = await algosdk.waitForConfirmation(algod, txn.txID().toString(), 3);

  const assetIndex = result['asset-index'];
  console.log(`Asset ID created: ${assetIndex}`);
  return 'xxx';
};
