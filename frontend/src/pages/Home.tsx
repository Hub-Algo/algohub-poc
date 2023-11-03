import { useOutletContext } from 'react-router-dom'
import CampaignList from '../components/CampaignList'
import { filterCampaignByCategory } from '../services/campaignServices'
import { CampaignOutletInterface } from './CampaignDetails'
import HeroSection from '../components/HeroSection'

export default function Home() {
  const { campaignList } = useOutletContext() as CampaignOutletInterface

  const communityCampaigns = filterCampaignByCategory(campaignList, 'community')

  return (
    <div className="flex flex-col">
      <HeroSection />
      <section className="bg-gray-950 px-6 py-6">
        <div className="flex flex-col gap-6">
          <h3 className="text-2xl font-bold text-gray-100">Active campaigns 🔥</h3>
          <CampaignList campaigns={communityCampaigns} />
        </div>
      </section>
    </div>
  )
}
