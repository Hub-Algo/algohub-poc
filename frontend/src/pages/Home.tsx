import { useOutletContext } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import CampaignList from '../components/campaign/list/CampaignList'
// import { filterCampaignsByStatus } from '../services/campaignServices'
import { CampaignOutletInterface } from './CampaignDetails'
import { UserDataOutletInterface } from './Profile'
import AllCampaigns from './AllCampaigns'

export default function Home() {
  const { campaignList } = useOutletContext() as CampaignOutletInterface
  const { userData } = useOutletContext() as UserDataOutletInterface

  return (
    <div className="flex flex-col">
      <HeroSection userData={userData} />
      <section className="bg-gray-950 px-6 py-6 gap-y-20 flex flex-col">
        <div className="flex flex-col gap-6 mt-20">
          <CampaignList campaigns={campaignList} listLabel="New campaigns 📦" />
          {/* <CampaignList campaigns={filterCampaignsByStatus(campaignList, 'new')} /> */}
        </div>

        <div className="flex flex-col gap-6">
          <CampaignList campaigns={campaignList} listLabel="Hot campaigns ♨️" />
          {/* <CampaignList campaigns={filterCampaignsByStatus(campaignList, 'pending')} /> */}
        </div>

        <div className="flex flex-col gap-6 mb-20">
          <CampaignList campaigns={campaignList} listLabel="Completed campaigns ✅" />
          {/* <CampaignList campaigns={filterCampaignsByStatus(campaignList, 'completed')} /> */}
        </div>
      </section>
    </div>
  )
}
