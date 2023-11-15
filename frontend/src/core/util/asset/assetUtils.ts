import algosdk, { Algodv2, Transaction } from 'algosdk'

export async function generateOptIntoAssetTxn({
  client,
  assetID,
  initiatorAddr,
}: {
  client: Algodv2
  assetID: number
  initiatorAddr: string
}): Promise<Transaction> {
  try {
    const suggestedParams = await client.getTransactionParams().do()

    const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: initiatorAddr,
      to: initiatorAddr,
      assetIndex: assetID,
      amount: 0,
      suggestedParams,
    })

    return optInTxn
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message ?? 'We encountered something unexpected while opting into this asset. Try again later.')
  }
}
