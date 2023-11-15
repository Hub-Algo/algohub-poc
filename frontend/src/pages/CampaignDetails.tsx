import { useOutletContext, useParams } from 'react-router-dom'
import PageContainer from '../components/PageContainer'
import Breadcrumbs from '../components/common/breadcrumbs/Breadcrumbs'
import Carousel from '../components/common/carousel/Carousel'
import Tab from '../components/common/tab/Tab'
import { TabItem } from '../components/common/tab/Tab.types'
import { CampaignInterface } from '../interfaces/campaign-interface'
import InvestModal from '../components/invest-modal/InvestModal'
import WalletConnectModal from '../components/common/wallet-connect-modal/WalletConnectModal'
import { useWallet } from '@txnlab/use-wallet'
import CampaignDetailsDashboard from '../components/campaign/campaign-details/CampaignDetailsDashboard'
import { AssetServices } from '../services/assetServices'
import { useEffect, useState } from 'react'
import { ellipseAddress } from '../core/util/wallet/ellipseAddress'
import { AssetInfoInterface } from '../interfaces/AssetInfoInterface'
import ProjectInformation from '../components/campaign/campaign-tabs/ProjectInformation'

const images = [
  'https://pbs.twimg.com/profile_banners/1429713964288471040/1661936165/1500x500',
  'https://pbs.twimg.com/profile_banners/1493176263888015368/1656668873/1500x500',
  'https://pbs.twimg.com/profile_banners/1414619378323267585/1699203622/1500x500',
  'https://pbs.twimg.com/profile_banners/1441430126303055873/1680594213/1500x500',
]

export interface CampaignOutletInterface {
  campaignList: CampaignInterface[]
}

const CampaignDetails = () => {
  const { campaignList } = useOutletContext() as CampaignOutletInterface

  const { activeAccount } = useWallet()

  const { campaignId } = useParams()

  const [assetInfo, setAssetInfo] = useState<AssetInfoInterface>()

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

  const assetServices = new AssetServices()

  const campaign = campaignList.filter((campaign) => campaign.metadata.id === campaignId)[0]

  const fetchAssetInfo = async () => {
    const { asset } = await assetServices.getAssetInformation(campaign.record.productDocumentation.assetId)
    setAssetInfo(asset)
  }

  useEffect(() => {
    fetchAssetInfo()
  }, [])

  return (
    <PageContainer>
      <Breadcrumbs pathList={['Home', 'Campaigns', `${campaign?.record.companyRegistrationInfo.registeredCompanyName}`]} />
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
            <h2 className="font-bold text-6xl text-gray-100 ">{campaign?.record.companyRegistrationInfo.registeredCompanyName}</h2>
            <h3 className="text-gray-100 text-xl ">Developing the future for everyone</h3>
          </div>
        </div>
      </section>
      <section>
        <div className="flex flex-col gap-6 md:grid md:grid-cols-9 md:gap-10">
          <Carousel images={images} />
          <CampaignDetailsDashboard campaign={campaign}>{getTxnModal()}</CampaignDetailsDashboard>
        </div>
      </section>
      <section>
        <Tab items={tabItems}>
          <ProjectInformation campaign={campaign} assetInfo={assetInfo!} />
          <div>
            {' '}
            <div className="h-96 flex items-center justify-center">
              <p className="text-3xl text-gray-300">Comming soon</p>
            </div>
          </div>

          <div>
            {' '}
            <div className="h-96 flex items-center justify-center">
              <p className="text-3xl text-gray-300">Comming soon</p>
            </div>
          </div>

          <div>
            {' '}
            <div className="h-96 flex items-center justify-center">
              <p className="text-3xl text-gray-300">Comming soon</p>
            </div>
          </div>
        </Tab>
      </section>
    </PageContainer>
  )

  function getTxnModal() {
    if (!activeAccount) {
      return <WalletConnectModal buttonLabel="Connect to vote" />
    }
    // if ((campaign?.campaign_status === 'new' && hasVoted) || campaign?.campaign_status === 'pending') {
    //   // TODO: Get campaign id dynamically
    return <InvestModal campaignStatus={'new'} campaignId={479460351n} />
    // } else if (campaign?.campaign_status === 'new' && !hasVoted) {
    //   return <VoteModal />
    // }

    // return (
    //   <Modal id={'CampaignDetails.TxnModal'} modalButtonName={'Whitelist'}>
    //     <h2>{'Transaction details'}</h2>

    //     <p>{'Enter the amount you want to fund'}</p>
    //   </Modal>
    // )
  }
}

export default CampaignDetails
