import campaigns from '../dummy-data/campaigns.json'
import { CampaignInterface } from '../interfaces/campaign-interface'

const fetchAllCampaigns = async () => {
  return campaigns as CampaignInterface[]
}

const filterCampaignByCategory = (campaigns: CampaignInterface[], category: string) => {
  if (category) {
    const filteredCampaigns = campaigns.filter((campaign) => campaign.campaign_category === category)
    return filteredCampaigns
  }

  return campaigns
}

const filterCampaignsByStatus = (campaigns: CampaignInterface[], status: CampaignInterface['campaign_status']) => {
  const filteredCampaigns = campaigns.filter((campaign) => campaign.campaign_status === status)
  return filteredCampaigns
}

export { fetchAllCampaigns, filterCampaignByCategory, filterCampaignsByStatus }
