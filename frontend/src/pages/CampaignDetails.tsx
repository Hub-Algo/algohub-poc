import { useOutletContext, useParams } from 'react-router-dom'
import PageContainer from '../components/PageContainer'
import Carousel from '../components/common/carousel/Carousel'
import Tab from '../components/common/tab/Tab'
import { TabItem } from '../components/common/tab/Tab.types'
import { CampaignInterface } from '../interfaces/campaign-interface'
import Modal from '../components/common/modal/Modal'
import InvestModal from '../components/invest-modal/InvestModal'

export interface CampaignOutletInterface {
  campaignList: CampaignInterface[]
}

const CampaignDetails = () => {
  const hasVoted = true
  const { campaignList } = useOutletContext() as CampaignOutletInterface

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

  const campaign = campaignList.filter((campaign) => campaign.campaign_id === campaignId)[0]

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div>Breadcrumbs</div>
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
              <h2 className="font-bold text-4xl text-gray-100">{campaign?.campaign_title}</h2>
              <h3 className="text-gray-100">Community for everyone</h3>
            </div>
          </div>
        </section>
        <section>
          <div className="flex flex-col md:flex-row md:gap-10">
            <Carousel />
            <div className="w-full bg-gray-900 rounded-md p-6 gap-6 flex flex-col">
              <div className="">
                <p className="text-sm md:text-lg text-gray-400">Fundraise goal</p>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-100 ">${campaign?.hard_goal}</h2>
              </div>
              <div className="text-gray-300 flex w-full items-center justify-between">
                <p className="w-3/6">Price per token</p>
                <div className="w-1/6 border h-px border-dashed border-gray-600"></div>
                <p className="w-1/6">TBA</p>
              </div>

              <div className="text-gray-300 flex w-full items-center justify-between">
                <p className="w-3/6">Max allocation</p>
                <div className="w-1/6 border h-px border-dashed border-gray-600"></div>
                <p className="w-1/6">${campaign?.max_allocation}</p>
              </div>

              {getTxnModal()}

              <a className="btn" href={'/'}>
                {'Website'}
              </a>
            </div>
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
      </div>
    </PageContainer>
  )

  function getTxnModal() {
    if ((campaign?.campaign_status === 'new' && hasVoted) || campaign?.campaign_status === 'pending') {
      return <InvestModal campaignStatus={campaign.campaign_status} />
    }

    return (
      <Modal id={'CampaignDetails.TxnModal'} modalButtonName={'Whitelist'}>
        <h2>{'Transaction details'}</h2>

        <p>{'Enter the amount you want to fund'}</p>
      </Modal>
    )
  }
}

export default CampaignDetails
