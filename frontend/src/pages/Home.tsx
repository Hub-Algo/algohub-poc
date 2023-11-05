import { useOutletContext } from 'react-router-dom'
import CampaignList from '../components/campaign-list/CampaignList'
import { filterCampaignsByStatus } from '../services/campaignServices'
import { CampaignOutletInterface } from './CampaignDetails'
import HeroSection from '../components/HeroSection'

export default function Home() {
  const { campaignList } = useOutletContext() as CampaignOutletInterface

  return (
    <div className="flex flex-col">
      <HeroSection />
      <section className="bg-gray-950 px-6 py-6 gap-y-20 flex flex-col">
        <div className="flex flex-col gap-6 mt-20">
          <h3 className="text-2xl font-bold text-gray-100">{'New campaigns'}</h3>

          <CampaignList campaigns={filterCampaignsByStatus(campaignList, 'new')} />
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-2xl font-bold text-gray-100">{'Hot campaigns'}</h3>

          <CampaignList campaigns={filterCampaignsByStatus(campaignList, 'pending')} />
        </div>

        <div className="flex flex-col gap-6 mb-20">
          <h3 className="text-2xl font-bold text-gray-100">{'Completed campaigns'}</h3>

          <CampaignList campaigns={filterCampaignsByStatus(campaignList, 'completed')} />
        </div>
      </section>
    </div>
  )
}
