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

  const tabItems: TabItem[] = [
    { id: 'become-vip', content: 'Become VIP' },
    {
      id: 'voting-history',
      content: 'Voting History',
    },
    { id: 'details', content: 'Details' },
    {
      id: 'Settings',
      content: 'Settings',
    },
  ]

  const campaign = campaignList.filter((campaign) => campaign.metadata.id === campaignId)[0]

  return (
    <PageContainer>
      <Breadcrumbs pathList={['Home', 'Campaigns', `${campaign?.record.companyRegistrationInfo.registeredCompanyName}`]} />
      <section>
        <div className="flex gap-5">
          <div className="w-16 h-16 rounded-full bg-blue-300 border-2 border-orange-500 flex items-center justify-center overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src="https://pbs.twimg.com/profile_banners/973713781627830272/1683779199/600x200"
              alt=""
            />
          </div>
          <div>
            <h2 className="font-bold text-4xl text-gray-100 font-oswald">
              {campaign?.record.companyRegistrationInfo.registeredCompanyName}
            </h2>
            <h3 className="text-gray-100">Community for everyone</h3>
          </div>
        </div>
      </section>
      <section>
        <div className="flex flex-col gap-6 md:grid md:grid-cols-9 md:gap-10">
          <Carousel images={images} />
          <CampaignDetailsDashboard campaign={campaign}>{getTxnModal()}</CampaignDetailsDashboard>
        </div>
      </section>
      <section className="mt-6">
        <Tab items={tabItems}>
          <div>{'Campaign info'}</div>

          <div>{'Tokenomics'}</div>

          <div>{'Details'}</div>

          <div>{'Settings'}</div>
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
