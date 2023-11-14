//Use axios to fetch data?
import axios from 'axios'
import { CampaignApplicationData } from '../pages/campaign-application/CampaignApplication.types'

export class metadataService {
  async uploadMetadata(campaignMetadata: CampaignApplicationData) {
    try {
      const requestData = campaignMetadata

      const response = await axios.post(`https://algohub-poc-api.vercel.app/metadata`, requestData)
      const { data } = response
      return data
    } catch (error) {
      throw new Error('Error uploading metadata')
    }
  }
}
