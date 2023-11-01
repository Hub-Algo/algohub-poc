import { useNavigate } from 'react-router-dom'
import { CampaignInterface } from '../interfaces/campaign-interface'

interface CampaignsListPropsInterface {
  campaigns: CampaignInterface[]
}

const CampaignList = ({ campaigns }: CampaignsListPropsInterface) => {
  const navigate = useNavigate()

  const campaignListRenderer = campaigns.map((campaign) => {
    return (
      <button onClick={() => navigate(`/campaign/${campaign.campaign_id}`)} className="bg-green-300">
        navigate to {campaign.campaign_id}
      </button>
    )
  })

  return <div className="flex gap-10">{campaignListRenderer}</div>
}

export default CampaignList
