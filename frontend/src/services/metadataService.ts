//Use axios to fetch data?
import axios from 'axios'
import { CampaignApplicationFormData } from '../components/campaign/application-form/CampaignApplicationForm.types'

export class metadataService {
  async uploadMetadata(campaignMetadata: CampaignApplicationFormData) {
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
