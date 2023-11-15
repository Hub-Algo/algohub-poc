import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import PageContainer from '../components/PageContainer'
import CampaignFilter from '../components/campaign/filter/CampaignFilter'
import CampaignList from '../components/campaign/list/CampaignList'
import Breadcrumbs from '../components/common/breadcrumbs/Breadcrumbs'
import { CampaignObj, filterCampaignByCategory } from '../services/campaignServices'
import { CampaignOutletInterface } from './CampaignDetails'

const AllCampaigns = () => {
  const { campaignList } = useOutletContext() as CampaignOutletInterface

  const [displayCampaigns, setDisplayCampaigns] = useState<CampaignObj[]>(campaignList)
  const [selectedCategory, setSelectedCategory] = useState<string>('all campaigns')

  useEffect(() => {
    if (selectedCategory === 'all campaigns') {
      setDisplayCampaigns(campaignList)
    }
  }, [campaignList, selectedCategory])

  const handleFilterCampaigns = (category: string) => {
    const filteredCampaigns = filterCampaignByCategory(campaignList, category)
    setSelectedCategory(category)
    if (selectedCategory === 'all campaigns') {
      setDisplayCampaigns(campaignList)
    }

    setDisplayCampaigns(filteredCampaigns)
  }

  return (
    <div className="bg-gray-950">
      <PageContainer>
        <Breadcrumbs pathList={['Home', 'All categories']} />
        <CampaignFilter handleFilterCampaigns={handleFilterCampaigns} />
      </PageContainer>
      <CampaignList campaigns={displayCampaigns} listLabel={selectedCategory} />
    </div>
  )
}

export default AllCampaigns
