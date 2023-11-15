import { CampaignInterface } from '../../../interfaces/new-campaign-interface'
import { AssetServices } from '../../../services/assetServices'
import CategoryBadge from '../../CategoryBadge'

interface CampaignDetailsDashboardPropsInterface {
  children: React.ReactNode
  campaign: CampaignInterface
}

const CampaignDetailsDashboard = ({ children, campaign }: CampaignDetailsDashboardPropsInterface) => {
  return (
    <div className="w-full  bg-gradient-to-b from-black via-gray-950 to-gray-950 rounded-md p-6 gap-6 flex flex-col col-span-4 ">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl md:text-5xl font-bold  text-gray-100">{campaign.record.companyRegistrationInfo.registeredCompanyName}</h2>
          <CategoryBadge marketCategory={campaign.record.productOverview.marketType} size="lg" />
        </div>
        <div>
          <p className="text-sm md:text-lg text-gray-400">Fundraise goal</p>
          <h2 className="text-xl md:text-4xl font-bold  text-gray-100 ">{campaign?.record.fundraisingGoal.minAmount} USDC</h2>
        </div>
      </div>
      <div className="text-gray-300 flex w-full items-center justify-between">
        <p className="w-2/6 fontb">Max allocation</p>
        <div className="w-2/6 border h-px border-dashed border-gray-600"></div>
        <p className="w-2/6 flex justify-end">500 USDC</p>
      </div>

      <div className="text-gray-300 flex w-full items-center justify-between">
        <p className="w-2/6">Min allocation</p>
        <div className="w-2/6 border h-px border-dashed border-gray-600"></div>
        <p className="w-2/6 flex justify-end">{campaign?.record.fundraisingGoal.maxAmount} USDC</p>
      </div>

      {children}

      <a className="btn" href={campaign.record.productOverview.website} target="_blank" rel="noopener noreferrer">
        {'Visit project Website'}
      </a>
    </div>
  )
}

export default CampaignDetailsDashboard
