import { NewCampaignInterface } from '../../../interfaces/new-campaign-interface'
import CategoryBadge from '../../CategoryBadge'

interface CampaignDetailsDashboardPropsInterface {
  children: React.ReactNode
  campaign: NewCampaignInterface
}

const CampaignDetailsDashboard = ({ children, campaign }: CampaignDetailsDashboardPropsInterface) => {
  return (
    <div className="w-full bg-gray-950 rounded-md p-6 gap-6 flex flex-col col-span-4">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl md:text-5xl font-bold font-oswald text-gray-100">
            {campaign.record.companyRegistrationInfo.registeredCompanyName}
          </h2>
          <CategoryBadge marketCategory={campaign.record.productOverview.marketType} size="lg" />
        </div>
        <div>
          <p className="text-sm md:text-lg text-gray-400">Fundraise goal</p>
          <h2 className="text-xl md:text-4xl font-bold font-oswald text-gray-100 ">${campaign?.record.fundraisingGoal.minAmount}</h2>
        </div>
      </div>
      <div className="text-gray-300 flex w-full items-center justify-between">
        <p className="w-3/6 fontb">Max allocation</p>
        <div className="w-1/6 border h-px border-dashed border-gray-600"></div>
        <p className="w-1/6">$500</p>
      </div>

      <div className="text-gray-300 flex w-full items-center justify-between">
        <p className="w-3/6">Max allocation</p>
        <div className="w-1/6 border h-px border-dashed border-gray-600"></div>
        <p className="w-1/6">${campaign?.record.fundraisingGoal.maxAmount}</p>
      </div>

      {children}

      <a className="btn" href={campaign.record.productOverview.website} target="_blank" rel="noopener noreferrer">
        {'Website'}
      </a>
    </div>
  )
}

export default CampaignDetailsDashboard
