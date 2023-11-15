import { AppDetails } from '@algorandfoundation/algokit-utils/types/app-client'
import algosdk from 'algosdk'
import axios from 'axios'
import { AlgohubClient } from '../contracts/AlgohubClient'
import { CampaignClient } from '../contracts/CampaignClient'
import campaigns from '../dummy-data/new_campaigns.json'
import { CampaignInterface, Metadata, Records } from '../interfaces/campaign-interface'

export type CampaignObj = {
  appId: string
  conversionRate: number
  maxInvestmentPerAccount: number
  minTotalInvestment: number
  maxTotalInvestment: number
  investedAmount: number
  withdrawnAmount: number
  startTime: number
  endTime: number
  metadataUrl: string
  metadata: CampaignInterface
}

const fetchAllCampaignIds = async (algohubClient: AlgohubClient | undefined): Promise<number[]> => {
  console.log('algohubClient', algohubClient)
  if (algohubClient === undefined || algohubClient === null) return []
  const state = await algohubClient.appClient.getGlobalState()

  return state.algohubCampaigns ? (algosdk.ABIType.from('uint64[]').decode(state.algohubCampaigns.valueRaw) as number[]) : []
}

const fetchCampaignDetails = async (appId: number, algod: algosdk.Algodv2): Promise<CampaignObj> => {
  const appDetails: AppDetails = {
    resolveBy: 'id',
    // id: 479535990,
    id: appId,
  }
  const campaignClient = new CampaignClient(appDetails, algod)
  const state = await campaignClient.appClient.getGlobalState()
  const contactTupleType = algosdk.ABITupleType.from('(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,string)')
  const decodedTuple = contactTupleType.decode(state.campaign.valueRaw).valueOf() as string[]

  const metadata = await axios.get(decodedTuple[8])
  console.log(metadata)

  return {
    appId: appId.toString(),
    conversionRate: Number(decodedTuple[0]),
    maxInvestmentPerAccount: Number(decodedTuple[1]),
    minTotalInvestment: Number(decodedTuple[2]),
    maxTotalInvestment: Number(decodedTuple[3]),
    investedAmount: Number(decodedTuple[4]),
    withdrawnAmount: Number(decodedTuple[5]),
    startTime: Number(decodedTuple[6]),
    endTime: Number(decodedTuple[7]),
    metadataUrl: decodedTuple[8],
    metadata: metadata.data as CampaignInterface,
  }
}

const fetchAllCampaigns = async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allCampaigns: { record: any; metadata: Metadata }[] = campaigns

  const mappedCampaigns: CampaignInterface[] = allCampaigns.map((campaign) => {
    const { record, metadata } = campaign

    const mappedRecord: Records = {
      companyRegistrationInfo: record['company-registration-info'],
      teamInfo: record['team-info'],
      productOverview: record['product-overview'],
      productDocumentation: record['product-documentation'],
      fundraisingGoal: record['fundraising-goal'],
      contactInfo: record['contact-info'],
    }

    return { record: mappedRecord, metadata }
  })

  return mappedCampaigns
}

const filterCampaignByCategory = (campaigns: CampaignObj[], category: string) => {
  if (category) {
    const filteredCampaigns = campaigns.filter((campaign) => campaign.metadata.record.productOverview.marketType === category)
    return filteredCampaigns
  }

  return campaigns
}

// const filterCampaignsByStatus = (campaigns: CampaignInterface[], status: CampaignInterface['campaign_status']) => {
//   // const filteredCampaigns = campaigns.filter((campaign) => campaign.campaign_status === status)
//   // return filteredCampaigns
// }

export { fetchAllCampaignIds, fetchAllCampaigns, fetchCampaignDetails, filterCampaignByCategory }
