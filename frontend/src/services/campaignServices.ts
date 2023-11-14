import campaigns from '../dummy-data/new_campaigns.json'
import { CampaignInterface } from '../interfaces/campaign-interface'
import { NewCampaignInterface, Records, Metadata } from '../interfaces/new-campaign-interface'

const fetchAllCampaigns = async () => {
  const allCampaigns: { record: any; metadata: Metadata }[] = campaigns

  const mappedCampaigns: NewCampaignInterface[] = allCampaigns.map((campaign) => {
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
    const filteredCampaigns = campaigns.filter((campaign) => campaign.campaign_category === category)
    return filteredCampaigns
  }

  return campaigns
}

const filterCampaignsByStatus = (campaigns: NewCampaignInterface[], status: CampaignInterface['campaign_status']) => {
  // const filteredCampaigns = campaigns.filter((campaign) => campaign.campaign_status === status)
  // return filteredCampaigns
}

export { fetchAllCampaigns, filterCampaignByCategory, filterCampaignsByStatus }
