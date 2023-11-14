import { generatePath, useNavigate } from 'react-router-dom'
import routes from '../../../../core/routes'
import { CampaignInterface } from '../../../../interfaces/new-campaign-interface'
import ProgressBar from '../../ProgressBar'
import Button from '../../button/Button'
import { formatCreationDate } from '../../../../core/util/campaign/campaignUtils'
import CategoryBadge from '../../../CategoryBadge'

interface CardWithImageProps {
  imageProps: {
    alt: string
    src: string
  }
  campaign: CampaignInterface
}

function CardWithImage({ imageProps, campaign }: CardWithImageProps) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(generatePath(routes.PROJECT_DETAIL.FULL_PATH, { campaignId: campaign.metadata.id }))}
      className="shadow-xl bg-transparent border-2 border-transparent rounded-md hover:border-orange-500 transition-all max-w-xs hover:scale-105 cursor-pointer"
    >
      <div className="rounded-b-none h-32 rounded-md bg-orange-500 p-1">
        <img src={imageProps.src} alt={imageProps.alt} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
      </div>
      <div className="card-body bg-gray-800 px-3 py-3 rounded-t-none rounded-md text-gray-100">
        {' '}
        <div className="flex justify-between items-center">
          <h2 className={'card-title font-oswald'}>{campaign.record.companyRegistrationInfo.registeredCompanyName}</h2>
          <CategoryBadge size="md" marketCategory={campaign.record.productOverview.marketType} />
        </div>
        <div className="flex items-center">
          <p className="text-lg font-bold font-oswald">Goal:</p>
          <h3>${campaign.record.fundraisingGoal.maxAmount}</h3>
        </div>
        <ProgressBar hard_goal={campaign.record.fundraisingGoal.maxAmount} invested_amount={campaign.record.fundraisingGoal.minAmount} />
        <div className={'bg-gray-950 p-2 rounded-md font-oswald'}>
          <div className={'flex gap-4 w-max'}>
            <p>{'Start date'}</p> <p>{campaign.record.companyRegistrationInfo.dateOfRegistration}</p>
          </div>

          <div className={'flex gap-4 w-max font-oswald'}>
            <p>{'End date'}</p> <p>{formatCreationDate(campaign.metadata.createdAt)}</p>
          </div>
        </div>
        <Button
          buttonColor={'orange'}
          size={'md'}
          customClassName={'rounded-2xl'}
          onClick={() => navigate(generatePath(routes.PROJECT_DETAIL.FULL_PATH, { campaignId: campaign.metadata.id }))}
        >
          {'view campaign'}
        </Button>
      </div>
    </div>
  )
}

export default CardWithImage
