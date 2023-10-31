import { useOutletContext, useParams } from 'react-router-dom'
import PageContainer from '../components/PageContainer'
import Carousel from '../components/common/carousel/Carousel'

const CampaignDetails = () => {
  //Need typing
  const { campaignList } = useOutletContext() as any

  const { campaignId } = useParams()

  console.log(campaignId)

  const campaign = campaignList.filter((campaign) => campaign.campaignId === campaignId)[0]

  console.log(campaign)

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
              <h2 className="font-bold text-4xl text-gray-100">The recoop</h2>
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
                <h2 className="text-3xl md:text-5xl font-bold text-gray-100 ">$650,000</h2>
              </div>
              <div className="text-gray-300 flex w-full items-center justify-between">
                <p className="w-3/6">Max allocation</p>
                <div className="w-1/6 border h-px border-dashed border-gray-600"></div>
                <p className="w-1/6">$500</p>
              </div>

              <div className="text-gray-300 flex w-full items-center justify-between">
                <p className="w-3/6">Max allocation</p>
                <div className="w-1/6 border h-px border-dashed border-gray-600"></div>
                <p className="w-1/6">$500</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  )
}

export default CampaignDetails
