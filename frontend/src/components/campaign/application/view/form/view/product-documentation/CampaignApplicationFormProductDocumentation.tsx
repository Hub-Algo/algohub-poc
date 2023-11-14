import { useState } from 'react'

import Input from '../../../../../../common/input/Input'
import {
  CAMPAIGN_APPLICATION_RAISED_FUNDS_RANGE,
  INITIAL_CAMPAIGN_APPLICATION_PRODUCT_DOCUMENTATION,
} from '../../CampaignApplicationForm.constants'
import Button from '../../../../../../common/button/Button'
import {
  CampaignApplicationFormData,
  CampaignApplicationFormView,
  CampaignApplicationProductDocumentation,
} from '../../../../../../../pages/campaign-application/CampaignApplication.types'
import CreatedAssetsSelect from '../../../../../../common/select/CreatedAssetsSelect'
import { useOutletContext } from 'react-router-dom'
import { UserDataOutletInterface } from '../../../../../../NavBar'
import LabelTooltip from '../../../../../../common/LabelTooltip'

interface CampaignApplicationFormProductDocumentationProps {
  onClickNextButton: (data: CampaignApplicationFormData) => void
  onClickPrevButton: (view: CampaignApplicationFormView) => void
  savedState: CampaignApplicationProductDocumentation | null
}

function CampaignApplicationFormProductDocumentation({
  onClickNextButton,
  onClickPrevButton,
  savedState,
}: CampaignApplicationFormProductDocumentationProps) {
  const [state, setState] = useState<CampaignApplicationProductDocumentation | null>(savedState ?? null)

  const { userData } = useOutletContext() as UserDataOutletInterface

  console.log('user data from form', userData)

  const isDisabled =
    !state?.assetId ||
    !state.hasConsentToInDepthInterview ||
    !state.pitchDeck ||
    !state.raisedFundsRange ||
    !state.roadmap ||
    !state.tokenVestingSchedule ||
    !state.whitepaper

  return (
    <form
      onSubmit={handleClickNextButton}
      id={CampaignApplicationFormView.CompanyRegistrationInfo}
      className={'text-gray-900 flex flex-col gap-4 mb-20 items-center'}
    >
      <h2 className={'font-semibold text-3xl mb-5 text-gray-100'}>{'Product Documentation'}</h2>

      <p className={'max-w-2xl text-center mb-5 text-gray-100'}>
        {
          'To be eligible for funding in the AlgoHub Token Sales program, your product submission will undergo a comprehensive approval process, which includes, but is not limited to, community due diligence and a supermajority vote. To facilitate a smoother evaluation process and enhance your chances of approval, please ensure that the product documentation you are entering below is accurate and complete.'
        }
      </p>

      <div className={'flex flex-col items-center gap-4 max-w-md'}>
        <div className={'gap-4 flex flex-col'}>
          <p className="text-gray-100">
            {'Have you previously raised funds for this project (if yes, please select the corresponding range)?'}
          </p>

          <ul>
            {CAMPAIGN_APPLICATION_RAISED_FUNDS_RANGE.map((range) => (
              <li>
                <label className={'gap-2 flex text-gray-100'}>
                  <input
                    id={`radio-btn--${range}`}
                    type={'radio'}
                    value={range}
                    onChange={handleSetRange}
                    checked={state?.raisedFundsRange === range}
                  />

                  {range}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full">
          <LabelTooltip labelContent="Link to Roadmap" />
          <Input type={'url'} value={state?.roadmap ?? ''} onChange={handleSetRoadmap} />
        </div>

        <div className="w-full">
          <LabelTooltip labelContent="Link to Whitepaper" />
          <Input type={'url'} value={state?.whitepaper ?? ''} onChange={handleSetWhitepaper} />
        </div>
        <div className="w-full">
          <LabelTooltip labelContent="Link to Token Vesting Schedule" />
          <Input type={'url'} value={state?.tokenVestingSchedule ?? ''} onChange={handleSetTokenVestingSchedule} />
        </div>

        <div className="w-full">
          <LabelTooltip labelContent="Audit Report" />
          <Input type={'url'} value={state?.auditReport ?? ''} onChange={handleSetAuditReport} />
        </div>

        <div className="w-full">
          <LabelTooltip
            labelContent="Token - Asset ID"
            tooltipText={
              'Please note that you will be required to sign an authentication transaction with the creator address for the entered Asset ID.'
            }
          />
          <CreatedAssetsSelect options={userData.user_created_assets} handleSetAssetId={handleSetAssetId} />
        </div>
        <div className="w-full">
          <LabelTooltip
            labelContent={'Smart Contracts - Application IDs (if applicable)'}
            tooltipText={
              "Please note that you will be required to sign an authentication transaction with the creator address for each of the entered Application IDs.'"
            }
          />

          <Input type={'text'} value={state?.appId ?? ''} onChange={handleSetAppId} />
        </div>

        <div className="w-full">
          <LabelTooltip labelContent={`Link to Pitch Deck`} />
          <Input type={'url'} value={state?.pitchDeck ?? ''} onChange={handleSetPitchDeck} />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-gray-100 font-bold">{'Do you consent to an in-depth interview regarding your product?'}</p>

          <label className={'gap-2 flex text-gray-100'}>
            <input type={'checkbox'} value={'Yes, I consent'} onChange={handleSetConsent} checked={state?.hasConsentToInDepthInterview} />
            {'Yes, I consent'}
          </label>
        </div>
      </div>

      <div className={'justify-between flex w-full mt-10'}>
        <Button type="button" buttonColor="orange" onClick={handleClickPrevButton}>
          {'Prev'}
        </Button>

        <Button type="submit" buttonColor="orange" isDisabled={isDisabled}>
          {'Next'}
        </Button>
      </div>
    </form>
  )

  function handleSetRange(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev
        ? { ...prev, raisedFundsRange: value }
        : { ...INITIAL_CAMPAIGN_APPLICATION_PRODUCT_DOCUMENTATION, raisedFundsRange: value }
    })
  }

  function handleSetTokenVestingSchedule(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev
        ? { ...prev, tokenVestingSchedule: value }
        : { ...INITIAL_CAMPAIGN_APPLICATION_PRODUCT_DOCUMENTATION, tokenVestingSchedule: value }
    })
  }

  function handleSetRoadmap(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, roadmap: value } : { ...INITIAL_CAMPAIGN_APPLICATION_PRODUCT_DOCUMENTATION, roadmap: value }
    })
  }

  function handleSetAuditReport(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, auditReport: value } : { ...INITIAL_CAMPAIGN_APPLICATION_PRODUCT_DOCUMENTATION, auditReport: value }
    })
  }

  function handleSetAssetId(assetId: number) {
    setState((prev) => {
      return prev ? { ...prev, assetId } : { ...INITIAL_CAMPAIGN_APPLICATION_PRODUCT_DOCUMENTATION, assetId }
    })

    console.log('formState', state)
  }
  function handleSetAppId(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, appId: value } : { ...INITIAL_CAMPAIGN_APPLICATION_PRODUCT_DOCUMENTATION, appId: value }
    })
  }
  function handleSetPitchDeck(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, pitchDeck: value } : { ...INITIAL_CAMPAIGN_APPLICATION_PRODUCT_DOCUMENTATION, pitchDeck: value }
    })
  }
  function handleSetWhitepaper(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, whitepaper: value } : { ...INITIAL_CAMPAIGN_APPLICATION_PRODUCT_DOCUMENTATION, whitepaper: value }
    })
  }

  function handleSetConsent(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev
        ? { ...prev, hasConsentToInDepthInterview: value === 'Yes, I consent' }
        : { ...INITIAL_CAMPAIGN_APPLICATION_PRODUCT_DOCUMENTATION, hasConsentToInDepthInterview: value === 'Yes, I consent' }
    })
  }

  function handleClickNextButton(event: React.SyntheticEvent<HTMLFormElement, Event>) {
    event.preventDefault()
    onClickNextButton({ ...state!, type: CampaignApplicationFormView.ProductDocumentation })
  }

  function handleClickPrevButton() {
    onClickPrevButton(CampaignApplicationFormView.ProductOverview)
  }
}

export default CampaignApplicationFormProductDocumentation
