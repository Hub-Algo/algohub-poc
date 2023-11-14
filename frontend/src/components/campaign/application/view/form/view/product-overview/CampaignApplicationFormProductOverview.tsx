import { useState } from 'react'

import Button from '../../../../../../common/button/Button'

import Input from '../../../../../../common/input/Input'
import { CAMPAIGN_APPLICATION_MARKET_TYPES, INITIAL_CAMPAIGN_APPLICATION_PRODUCT_OVERVIEW } from '../../CampaignApplicationForm.constants'
import {
  CampaignApplicationFormData,
  CampaignApplicationFormView,
  CampaignApplicationProductOverview,
} from '../../../../../../../pages/campaign-application/CampaignApplication.types'
import LabelTooltip from '../../../../../../common/LabelTooltip'

interface CampaignApplicationFormProductOverviewProps {
  onClickNextButton: (data: CampaignApplicationFormData) => void
  onClickPrevButton: (view: CampaignApplicationFormView) => void
  savedState: CampaignApplicationProductOverview | null
}

function CampaignApplicationFormProductOverview({
  onClickNextButton,
  onClickPrevButton,
  savedState,
}: CampaignApplicationFormProductOverviewProps) {
  const [state, setState] = useState<CampaignApplicationProductOverview | null>(savedState ?? null)

  const isDisabled =
    !state?.discordServer ||
    !state.elevatorPitch ||
    !state.github ||
    !state.marketType ||
    !state.productName ||
    !state.website ||
    !state.xAccount

  return (
    <form
      onSubmit={handleClickNextButton}
      id={CampaignApplicationFormView.CompanyRegistrationInfo}
      className={'text-gray-900 flex flex-col gap-4 mb-20 items-center'}
    >
      <h2 className={'font-semibold text-3xl mb-5 text-gray-100'}>{'Product Overview'}</h2>

      <p className={'max-w-2xl text-center text-gray-100'}>
        {
          'Please provide a brief introduction to the product you are seeking to fund, including URLs to all relevant social media channels.'
        }
      </p>

      <div className={'flex flex-col mx-auto w-full gap-4 max-w-md'}>
        <div className="w-full">
          <LabelTooltip labelContent="Product Name" />
          <Input type={'text'} value={state?.productName ?? ''} onChange={handleSetProductName} />
        </div>

        <div className="gap-2">
          <p className="font-medium text-gray-100">{'Market category'}</p>

          <ul>
            {CAMPAIGN_APPLICATION_MARKET_TYPES.map((market) => (
              <li>
                <label className={'gap-2 flex text-gray-100'}>
                  <input
                    id={`radio-btn--${market}`}
                    type={'radio'}
                    value={market}
                    onChange={handleSetMarket}
                    checked={state?.marketType === market}
                  />

                  {market}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full">
          <LabelTooltip labelContent="Website" />
          <Input type={'url'} value={state?.website ?? ''} onChange={handleSetWebsite} />
        </div>

        <div className="w-full">
          <LabelTooltip labelContent="Github" />
          <Input type={'url'} value={state?.github ?? ''} onChange={handleSetGithub} />
        </div>

        <div className="w-full">
          <LabelTooltip labelContent="X handle" />
          <Input type={'text'} value={state?.xAccount ?? ''} onChange={handleSetXAccount} />
        </div>

        <div className="w-full">
          <LabelTooltip labelContent="Discord server" />
          <Input type={'url'} value={state?.discordServer ?? ''} onChange={handleSetDiscord} />
        </div>

        <div className="w-full">
          <LabelTooltip labelContent="Telegram Channel" />
          <Input type={'text'} value={state?.telegram ?? ''} onChange={handleSetTelegram} />
        </div>

        <div className="w-full">
          <LabelTooltip labelContent="What is the elevator pitch for your project?" />
          <Input type={'text'} value={state?.elevatorPitch ?? ''} onChange={handleSetPitch} />
        </div>
      </div>

      <div className={'justify-between flex mt-10 w-full'}>
        <Button buttonColor="orange" type="button" onClick={handleClickPrevButton}>
          {'Prev'}
        </Button>

        <Button buttonColor="orange" type="submit" isDisabled={isDisabled}>
          {'Next'}
        </Button>
      </div>
    </form>
  )

  function handleSetProductName(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, productName: value } : { ...INITIAL_CAMPAIGN_APPLICATION_PRODUCT_OVERVIEW, productName: value }
    })
  }

  function handleSetMarket(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev
        ? { ...prev, marketType: value as CampaignApplicationProductOverview['marketType'] }
        : { ...INITIAL_CAMPAIGN_APPLICATION_PRODUCT_OVERVIEW, marketType: value as CampaignApplicationProductOverview['marketType'] }
    })
  }

  function handleSetWebsite(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, website: value } : { ...INITIAL_CAMPAIGN_APPLICATION_PRODUCT_OVERVIEW, website: value }
    })
  }

  function handleSetDiscord(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, discordServer: value } : { ...INITIAL_CAMPAIGN_APPLICATION_PRODUCT_OVERVIEW, discordServer: value }
    })
  }

  function handleSetGithub(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, github: value } : { ...INITIAL_CAMPAIGN_APPLICATION_PRODUCT_OVERVIEW, github: value }
    })
  }

  function handleSetXAccount(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, xAccount: value } : { ...INITIAL_CAMPAIGN_APPLICATION_PRODUCT_OVERVIEW, xAccount: value }
    })
  }

  function handleSetTelegram(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, telegram: value } : { ...INITIAL_CAMPAIGN_APPLICATION_PRODUCT_OVERVIEW, telegram: value }
    })
  }

  function handleSetPitch(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, elevatorPitch: value } : { ...INITIAL_CAMPAIGN_APPLICATION_PRODUCT_OVERVIEW, elevatorPitch: value }
    })
  }

  function handleClickNextButton(event: React.SyntheticEvent<HTMLFormElement, Event>) {
    event.preventDefault()
    onClickNextButton({ ...state!, type: CampaignApplicationFormView.ProductOverview })
  }

  function handleClickPrevButton() {
    onClickPrevButton(CampaignApplicationFormView.CompanyRegistrationInfo)
  }
}

export default CampaignApplicationFormProductOverview
