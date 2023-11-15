import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageContainer from '../components/PageContainer'
import CampaignDetailsDashboard from '../components/campaign/campaign-details/CampaignDetailsDashboard'
import ProjectInformation from '../components/campaign/campaign-tabs/ProjectInformation'
import Breadcrumbs from '../components/common/breadcrumbs/Breadcrumbs'
import Carousel from '../components/common/carousel/Carousel'
import Tab from '../components/common/tab/Tab'
import { TabItem } from '../components/common/tab/Tab.types'
import { AssetInfoInterface } from '../interfaces/AssetInfoInterface'
import { assetServices } from '../services/assetServices'
import { CampaignObj } from '../services/campaignServices'
import CampaignTransactionsButtonGroup from '../components/campaign/txns-button-group/CampaignTransactionsButtonGroup'
import useAppContext from '../core/util/useAppContext'

const images = [
  'https://pbs.twimg.com/profile_banners/1429713964288471040/1661936165/1500x500',
  'https://pbs.twimg.com/profile_banners/1493176263888015368/1656668873/1500x500',
  'https://pbs.twimg.com/profile_banners/1414619378323267585/1699203622/1500x500',
  'https://pbs.twimg.com/profile_banners/1441430126303055873/1680594213/1500x500',
]

export interface CampaignOutletInterface {
  campaignList: CampaignObj[]
}

const CampaignDetails = () => {
  const { campaignList } = useAppContext()
  const { campaignId } = useParams()

  const [assetInfo, setAssetInfo] = useState<AssetInfoInterface>()
  const [assetInvestInfo, setAssetInvestInfo] = useState<AssetInfoInterface>()

  const tabItems: TabItem[] = [
    { id: 'project-info', content: 'Project information' },
    {
      id: 'voting-history',
      content: 'Voting History',
    },
    { id: 'details', content: 'Details' },
    {
      id: 'investors-list',
      content: 'Investors list',
    },
  ]

  const campaign = campaignList.filter((campaign) => campaign.appId === campaignId)[0]

  const fetchIdoAssetInfo = async (assetId: number) => {
    const { asset } = await assetServices.getAssetInformation(assetId)
    setAssetInfo(asset)
  }

  const fetchInvestAssetInfo = async (assetId: number) => {
    const { asset } = await assetServices.getAssetInformation(assetId)
    setAssetInvestInfo(asset)
  }

  useEffect(() => {
    if (campaign) {
      fetchIdoAssetInfo(campaign.idoAsa)
      fetchInvestAssetInfo(campaign.investAsa)
    }
  }, [campaign])

  return (
    <PageContainer>
      <Breadcrumbs
        pathList={['Home', 'Campaigns', `${campaign?.metadata?.record?.companyRegistrationInfo?.registeredCompanyName || campaign.appId}`]}
      />
      <section>
        <div className="flex gap-5 items-center">
          <div className="w-20 h-20 rounded-full bg-blue-300 border-2 border-orange-500 flex items-center justify-center overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src="https://pbs.twimg.com/profile_banners/973713781627830272/1683779199/600x200"
              alt=""
            />
          </div>
          <div>
            <h2 className="font-bold text-6xl text-gray-100 ">
              {campaign?.metadata?.record?.companyRegistrationInfo?.registeredCompanyName}
            </h2>
            <h3 className="text-gray-100 text-xl ">Developing the future for everyone</h3>
          </div>
        </div>
      </section>
      <section>
        <div className="flex flex-col gap-6 md:grid md:grid-cols-9 md:gap-10">
          <Carousel images={images} />
          {campaign && (
            <CampaignDetailsDashboard investAssetInfo={assetInvestInfo!} campaign={campaign}>
              <CampaignTransactionsButtonGroup
                campaignId={479634869n}
                campaignPeriod={'ended'}
                campaignGoalStatus={'hardcap'}
                userStatus={'invested'}
                idoAsaId={479553947}
              />
            </CampaignDetailsDashboard>
          )}
        </div>
      </section>
      <section>
        <Tab items={tabItems}>
          {campaign && <ProjectInformation campaign={campaign} assetInfo={assetInfo!} />}
          <div>
            <div className="h-96 flex items-center justify-center">
              <p className="text-3xl text-gray-300">Comming soon</p>
            </div>
          </div>

          <div>
            <div className="h-96 flex items-center justify-center">
              <p className="text-3xl text-gray-300">Comming soon</p>
            </div>
          </div>

          <div>
            <div className="h-96 flex items-center justify-center">
              <p className="text-3xl text-gray-300">Comming soon</p>
            </div>
          </div>
        </Tab>
      </section>
    </PageContainer>
  )
}

export default CampaignDetails
