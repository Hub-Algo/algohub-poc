import { useOutletContext } from 'react-router-dom'
import { CampaignOutletInterface } from './CampaignDetails'
import { useEffect, useState } from 'react'
import { CampaignInterface } from '../interfaces/campaign-interface'
import { filterCampaignByCategory } from '../services/campaignServices'
import CampaignList from '../components/campaign/list/CampaignList'
import CampaignFilter from '../components/campaign/campaign-filter/CampaignFilter'
import Breadcrumbs from '../components/common/breadcrumbs/Breadcrumbs'
import PageContainer from '../components/PageContainer'

const AllCampaigns = () => {
  const { campaignList } = useOutletContext() as CampaignOutletInterface

  const [displayCampaigns, setDisplayCampaigns] = useState<CampaignInterface[]>(campaignList)
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
    <div>
      <PageContainer>
        <Breadcrumbs pathList={['home', 'all categories']} />
        <CampaignFilter handleFilterCampaigns={handleFilterCampaigns} />
      </PageContainer>
      <CampaignList campaigns={displayCampaigns} />
    </div>
  )
}

export default AllCampaigns
