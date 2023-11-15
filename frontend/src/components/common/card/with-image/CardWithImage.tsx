import { generatePath, useNavigate } from 'react-router-dom'
import routes from '../../../../core/routes'
import { CampaignObj } from '../../../../services/campaignServices'
import CategoryBadge from '../../../CategoryBadge'
import ProgressBar from '../../ProgressBar'
import Button from '../../button/Button'

interface CardWithImageProps {
  imageProps: {
    alt: string
    src: string
  }
  campaign: CampaignObj
}

function CardWithImage({ imageProps, campaign }: CardWithImageProps) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(generatePath(routes.PROJECT_DETAIL.FULL_PATH, { campaignId: campaign.appId }))}
      className="shadow-xl bg-transparent border-2 border-transparent rounded-md hover:border-orange-500 transition-all max-w-xs hover:scale-105 cursor-pointer"
    >
      <div className="rounded-b-none h-32 rounded-md bg-orange-500 p-1">
        <img src={imageProps.src} alt={imageProps.alt} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
      </div>
      <div className="card-body bg-gray-800 px-3 py-3 rounded-t-none rounded-md text-gray-100">
        {' '}
        <div className="flex justify-between items-center">
          <h2 className={'card-title '}>{campaign.metadata.record.companyRegistrationInfo?.registeredCompanyName}</h2>
          <CategoryBadge size="md" marketCategory={campaign.metadata.record.productOverview?.marketType} />
        </div>
        <div className="flex items-center">
          <p className="text-lg font-bold ">Goal:</p>
          <h3>{campaign.metadata.record.fundraisingGoal?.maxAmount} USDC</h3>
        </div>
        <ProgressBar hard_goal={campaign.maxTotalInvestment} invested_amount={campaign.investedAmount} />
        <div className={'bg-gray-950 p-2 rounded-md '}>
          <div className={'flex gap-4 w-max'}>
            <p>{'Start date'}</p> <p>{campaign.startTime}</p>
          </div>

          <div className={'flex gap-4 w-max '}>{/* <p>{'End date'}</p> <p>{formatCreationDate(campaign.)}</p> */}</div>
        </div>
        <Button
          buttonColor={'orange'}
          size={'md'}
          customClassName={'rounded-2xl'}
          onClick={() => navigate(generatePath(routes.PROJECT_DETAIL.FULL_PATH, { campaignId: campaign.appId }))}
        >
          {'view campaign'}
        </Button>
      </div>
    </div>
  )
}

export default CardWithImage
