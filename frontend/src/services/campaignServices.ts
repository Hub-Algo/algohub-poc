import campaigns from '../dummy-data/campaigns.json'
import { CampaignInterface } from '../interfaces/campaign-interface'

const fetchAllCampaigns = async () => {
  return campaigns
}

const filterCampaignByCategory = (campaigns: CampaignInterface[], category: string) => {
  const filteredCampaigns = campaigns.filter((campaign) => campaign.campaign_category === category)
  return filteredCampaigns
}

export { fetchAllCampaigns, filterCampaignByCategory }
