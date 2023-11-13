import algosdk, { Algodv2 } from 'algosdk'

async function generateOptIntoAssetTxns({
  client,
  assetID,
  initiatorAddr,
}: {
  client: Algodv2
  assetID: number
  initiatorAddr: string
}): Promise<Uint8Array[]> {
  try {
    const suggestedParams = await client.getTransactionParams().do()

    const optinTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: initiatorAddr,
      to: initiatorAddr,
      assetIndex: assetID,
      amount: 0,
      suggestedParams,
    })

    return [algosdk.encodeUnsignedTransaction(optinTxn)]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error)
  }
}

function generateAlgoExplorerLink(type: 'group-id' | 'txn-id' | 'account-detail' | 'asset-detail', id: string): string {
  const origin = 'https://algoexplorer.io'
  let link = ''

  switch (type) {
    case 'txn-id':
      link = `${origin}/tx/${encodeURIComponent(id)}`
      break

    case 'group-id':
      link = `${origin}/tx/group/${encodeURIComponent(id)}`
      break

    case 'account-detail':
      link = `${origin}/address/${encodeURIComponent(id)}`
      break

    case 'asset-detail':
      link = `${origin}/asset/${encodeURIComponent(id)}`
      break

    default:
      break
  }

  return link
}

function convertToBaseUnits(assetDecimals: number, amount: number) {
  return Math.pow(10, assetDecimals) * amount
}

export { generateAlgoExplorerLink, generateOptIntoAssetTxns, convertToBaseUnits }
