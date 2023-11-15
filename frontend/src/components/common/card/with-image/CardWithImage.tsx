import { useEffect, useState } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import routes from '../../../../core/routes'
import { convertTimestampToDate } from '../../../../core/util/timeUtil'
import { convertFromBaseUnits } from '../../../../core/util/transaction/transactionUtils'
import { AssetInfoInterface } from '../../../../interfaces/AssetInfoInterface'
import { assetServices } from '../../../../services/assetServices'
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
  const [investAssetInfo, setInvestAssetInfo] = useState<AssetInfoInterface>()

  const fetchIdoAssetInfo = async (assetId: number) => {
    const { asset } = await assetServices.getAssetInformation(assetId)
    setInvestAssetInfo(asset)
  }

  useEffect(() => {
    if (campaign) {
      fetchIdoAssetInfo(campaign.investAsa)
    }
  }, [campaign])

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
          <h2 className={'card-title '}>{campaign?.metadata.record['product-overview'].productName}</h2>
          <CategoryBadge size="md" marketCategory={campaign?.metadata.record['product-overview'].marketType} />
        </div>
        <div className="flex items-center">
          <p className="text-lg font-bold ">Goal:</p>
          <h3>
            {convertFromBaseUnits(investAssetInfo?.params.decimals || 0, campaign.maxInvestmentPerAccount).toLocaleString('en-US')}{' '}
            {investAssetInfo?.params['unit-name']}
          </h3>
        </div>
        <ProgressBar hard_goal={campaign.maxTotalInvestment} asset_info={investAssetInfo} invested_amount={campaign.investedAmount} />
        <div className={'bg-gray-950 p-2 rounded-md '}>
          <div className={'flex gap-4 w-max'}>
            <p>{'Start date'}</p> <p>{convertTimestampToDate(campaign.startTime)}</p>
          </div>

          <div className={'flex gap-4 w-max '}>
            <p>{'End date'}</p> <p>{convertTimestampToDate(campaign.endTime)}</p>
          </div>
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
