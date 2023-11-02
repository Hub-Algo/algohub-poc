import { useNavigate } from 'react-router-dom'
import { CampaignInterface } from '../interfaces/campaign-interface'
import CardWithImage from './common/card/with-image/CardWithImage'
import Button from './common/button/Button'

interface CampaignsListPropsInterface {
  campaigns: CampaignInterface[]
}

const CampaignList = ({ campaigns }: CampaignsListPropsInterface) => {
  const navigate = useNavigate()

  const campaignListRenderer = campaigns.map((campaign) => {
    return (
      <CardWithImage imageProps={{ src: 'src/core/images/the-recoop.png', alt: 'gunny-tps' }}>
        <h2 className={'card-title'}>{campaign.campaign_title}</h2>
        <div className={'mb-8'}>
          <div className={'flex gap-4 w-max'}>
            <p>{'Start date'}</p> <p>{'02/12/23'}</p>
          </div>

          <div className={'flex gap-4 w-max'}>
            <p>{'End date'}</p> <p>{'02/01/24'}</p>
          </div>
        </div>

        <Button
          buttonColor={'accent'}
          size={'lg'}
          customClassName={'rounded-2xl'}
          onClick={() => navigate(`/campaign/${campaign.campaign_id}`)}
        >
          {'view campaign'}
        </Button>
      </CardWithImage>
    )
  })

  return <div className="flex gap-10">{campaignListRenderer}</div>
}

export default CampaignList
