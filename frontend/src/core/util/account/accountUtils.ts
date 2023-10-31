import { Algodv2, IntDecoding } from 'algosdk'
import { AccountInformation } from './accountTypes'

async function getAccountInformation(
  client: Algodv2,
  address: string,
  intDecoding: IntDecoding = IntDecoding.DEFAULT,
): Promise<AccountInformation> {
  try {
    const accountInfo = await (client.accountInformation(address).setIntDecoding(intDecoding).do() as Promise<AccountInformation>)

    return Promise.resolve(accountInfo)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Promise.reject(new Error(error.message || 'Failed to fetch account information'))
  }
}

export { getAccountInformation }
