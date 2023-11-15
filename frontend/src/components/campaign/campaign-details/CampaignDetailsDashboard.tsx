import { formatTimeStamp } from '../../../core/util/campaign/campaignUtils'
import { convertFromBaseUnits } from '../../../core/util/transaction/transactionUtils'
import { AssetInfoInterface } from '../../../interfaces/AssetInfoInterface'
import { CampaignObj } from '../../../services/campaignServices'
import CategoryBadge from '../../CategoryBadge'
import ProgressBar from '../../common/ProgressBar'

interface CampaignDetailsDashboardPropsInterface {
  children: React.ReactNode
  campaign: CampaignObj
  investAssetInfo: AssetInfoInterface
}

const CampaignDetailsDashboard = ({ children, campaign, investAssetInfo }: CampaignDetailsDashboardPropsInterface) => {
  return (
    <div className="w-full  bg-gradient-to-b from-black via-gray-950 to-gray-950 rounded-md p-6 gap-6 flex flex-col col-span-4 ">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl md:text-5xl font-bold  text-gray-100">{campaign?.metadata.record['product-overview'].productName}</h2>

          <CategoryBadge marketCategory={campaign?.metadata.record['product-overview'].marketType} size="lg" />
        </div>
        <ProgressBar hard_goal={campaign.maxTotalInvestment} invested_amount={campaign.investedAmount} />
        <div>
          <div className="flex gap-3 items-center">
            <p className="text-xl text-gray-100 font-bold">End date:</p>
            <p className="text-gray-100 text-xl ">{formatTimeStamp(campaign.endTime)}</p>
          </div>
          <div className="flex gap-3 items-center">
            <p className="md:text-lg text-gray-100 text-xl font-bold">
              {campaign?.maxTotalInvestment > campaign?.minTotalInvestment ? 'Stretch' : 'Fundraise'} goal:
            </p>
            <p className="md:text-4xl text-gray-100 text-xl">
              {convertFromBaseUnits(investAssetInfo?.params.decimals || 0, campaign?.maxTotalInvestment)}{' '}
              {investAssetInfo?.params['unit-name']}
            </p>
          </div>
        </div>
      </div>
      {campaign?.maxTotalInvestment > campaign?.minTotalInvestment && (
        <div className="text-gray-300 flex w-full items-center justify-between">
          <p className="w-2/6">Min allocation</p>
          <div className="w-2/6 border h-px border-dashed border-gray-600"></div>
          <p className="w-2/6 flex justify-end">
            {convertFromBaseUnits(investAssetInfo?.params.decimals || 0, campaign?.maxTotalInvestment)}{' '}
            {investAssetInfo?.params['unit-name']}
          </p>
        </div>
      )}
      <div className="text-gray-300 flex w-full items-center justify-between">
        <p className="w-2/6 fontb">Max Inv. / Wallet </p>
        <div className="w-2/6 border h-px border-dashed border-gray-600"></div>
        <p className="w-2/6 flex justify-end">
          {convertFromBaseUnits(investAssetInfo?.params.decimals || 0, campaign?.maxInvestmentPerAccount)}{' '}
          {investAssetInfo?.params['unit-name']}
        </p>
      </div>

      {children}

      <a className="btn" href={campaign?.metadata.record['product-overview'].website} target="_blank" rel="noopener noreferrer">
        {'Visit project Website'}
      </a>
    </div>
  )
}

export default CampaignDetailsDashboard
