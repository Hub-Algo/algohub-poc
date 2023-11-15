import algosdk, { ABIValue } from 'algosdk'
import { AlgohubClient } from '../contracts/AlgohubClient'

export class AlgohubService {
  fetchAllCampaignIds = async (algohubClient: AlgohubClient | undefined): Promise<ABIValue | null> => {
    if (algohubClient === undefined) return null
    const state = await algohubClient.appClient.getGlobalState()

    return state.algohubCampaigns ? algosdk.ABIType.from('uint64[]').decode(state.algohubCampaigns?.['valueRaw']) : null
  }

  fetchVoteAsaId = async (algohubClient: AlgohubClient | undefined): Promise<ABIValue | null> => {
    if (algohubClient === undefined) return null
    const state = await algohubClient.appClient.getGlobalState()

    return state.voterAsaId.value
  }
}
