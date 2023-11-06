import { useOutletContext } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import CampaignList from '../components/campaign-list/CampaignList'
import { filterCampaignByCategory } from '../services/campaignServices'
import { CampaignOutletInterface } from './CampaignDetails'
import { UserDataOutletInterface } from './Profile'

export default function Home() {
  const { campaignList } = useOutletContext() as CampaignOutletInterface
  const { userData } = useOutletContext() as UserDataOutletInterface

  const communityCampaigns = filterCampaignByCategory(campaignList, 'community')

  return (
    <div className="flex flex-col">
      <HeroSection userData={userData} />
      <section className="bg-gray-950 px-6 py-6 gap-y-20 flex flex-col">
        <div className="flex flex-col gap-6 mt-20">
          <h3 className="text-2xl font-bold text-gray-100">{'New campaigns'}</h3>

          <CampaignList campaigns={communityCampaigns} />
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-2xl font-bold text-gray-100">{'Hot campaigns'}</h3>

          <CampaignList campaigns={communityCampaigns} />
        </div>

        <div id="campaigns" className="flex flex-col gap-6 mb-20">
          <h3 className="text-2xl font-bold text-gray-100">{'All campaigns'}</h3>
          <CampaignList campaigns={communityCampaigns} />
        </div>
      </section>
    </div>
  )
}
