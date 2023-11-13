import './_campaign-list.scss'

import { TiMediaPlay, TiMediaPlayReverse } from 'react-icons/ti'
import { generatePath, useNavigate } from 'react-router-dom'

import { useEffect, useState } from 'react'
import routes from '../../../core/routes'
import { useWindowSizeContext } from '../../../core/window-size/WindowSizeContext'
import { CampaignInterface } from '../../../interfaces/campaign-interface'
import Button from '../../common/button/Button'
import CardWithImage from '../../common/card/with-image/CardWithImage'
import ProgressBar from '../../common/ProgressBar'

interface CampaignsListPropsInterface {
  campaigns: CampaignInterface[]
}

const CampaignList = ({ campaigns }: CampaignsListPropsInterface) => {
  const maxOffset = campaigns.length

  const { isSmallScreen, isXSmallScreen, isMidRangeScreen } = useWindowSizeContext()
  const [displayedCampaignsOffset, setDisplayedCampaignsOffset] = useState(0)
  const [limit, setLimit] = useState(getDisplayedCampaignsLimit(isSmallScreen, isXSmallScreen, isMidRangeScreen))
  const displayedCampaigns = campaigns.length ? campaigns.slice(displayedCampaignsOffset, displayedCampaignsOffset + limit) : []

  const navigate = useNavigate()

  useEffect(() => {
    const currentLimit = getDisplayedCampaignsLimit(isSmallScreen, isXSmallScreen, isMidRangeScreen)

    setLimit(currentLimit)
  }, [isSmallScreen, isXSmallScreen])

  const campaignListRenderer = displayedCampaigns.map((campaign, index) => {
    return (
      <CardWithImage
        key={index}
        imageProps={{ src: 'https://pbs.twimg.com/profile_banners/1502651569053044737/1658777150/1500x500', alt: 'gunny-tps' }}
        campaign_id={campaign.campaign_id}
      >
        <h2 className={'card-title font-oswald'}>{campaign.campaign_title}</h2>
        <div className="flex items-center">
          <p className="text-lg font-bold">Goal:</p>
          <h3>${campaign.hard_goal}</h3>
        </div>
        <ProgressBar hard_goal={campaign.hard_goal} invested_amount={campaign.invested_amount} />
        <div className={'bg-gray-950 p-2 rounded-md'}>
          <div className={'flex gap-4 w-max'}>
            <p>{'Start date'}</p> <p>{campaign.start_date}</p>
          </div>

          <div className={'flex gap-4 w-max'}>
            <p>{'End date'}</p> <p>{campaign.end_date}</p>
          </div>
        </div>

        <Button
          buttonColor={'orange'}
          size={'lg'}
          customClassName={'rounded-2xl'}
          onClick={() => navigate(generatePath(routes.PROJECT_DETAIL.FULL_PATH, { campaignId: campaign.campaign_id }))}
        >
          {'view campaign'}
        </Button>
      </CardWithImage>
    )
  })

  return (
    <div className={'flex gap-4 md:gap-14 items-center h-120 w-full justify-between bg-gray-950 px-2 mt-5 my-2'}>
      <Button
        aria-label={'previous-button'}
        onClick={handleDisplayPrevious}
        buttonColor="ghost"
        customClassName={'btn-round text-orange-500 campaign-list__previous-button group'}
        isDisabled={!displayedCampaignsOffset}
      >
        <TiMediaPlayReverse className="text-3xl group-hover:text-orange-600" />
      </Button>

      <div className="flex gap-10 py-5 w-full justify-center md:justify-between">
        {campaigns.length <= 0 ? (
          <div className="w-full text-3xl text-center text-gray-500">No campaigns to display</div>
        ) : (
          campaignListRenderer
        )}
      </div>

      <Button
        aria-label={'next-button'}
        onClick={handleDisplayNext}
        buttonColor="ghost"
        customClassName={'btn-round text-orange-500 campaign-list__next-button group'}
        isDisabled={displayedCampaignsOffset >= maxOffset - limit}
      >
        <TiMediaPlay className="text-3xl group-hover:text-orange-600" />
      </Button>
    </div>
  )

  function handleDisplayNext() {
    setDisplayedCampaignsOffset(maxOffset >= displayedCampaignsOffset + limit ? displayedCampaignsOffset + limit : displayedCampaignsOffset)
  }

  function handleDisplayPrevious() {
    setDisplayedCampaignsOffset(0 >= displayedCampaignsOffset - limit ? 0 : displayedCampaignsOffset - limit)
  }

  function getDisplayedCampaignsLimit(isSmallScreen: boolean, isXSmallScreen: boolean, isMidRangeScreen: boolean) {
    if (isXSmallScreen) {
      return 1
    }

    if (isMidRangeScreen) {
      return 3
    }

    return isSmallScreen ? 2 : 4
  }
}

export default CampaignList
