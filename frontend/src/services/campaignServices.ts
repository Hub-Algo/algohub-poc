import campaigns from '../dummy-data/new_campaigns.json'
import { CampaignInterface, Metadata, Records } from '../interfaces/campaign-interface'

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

const filterCampaignByCategory = (campaigns: CampaignInterface[], category: string) => {
  if (category) {
    const filteredCampaigns = campaigns.filter((campaign) => campaign.record.productOverview.marketType === category)
    return filteredCampaigns
  }

  return campaigns
}

// const filterCampaignsByStatus = (campaigns: CampaignInterface[], status: CampaignInterface['campaign_status']) => {
//   // const filteredCampaigns = campaigns.filter((campaign) => campaign.campaign_status === status)
//   // return filteredCampaigns
// }

export { fetchAllCampaigns, filterCampaignByCategory }
