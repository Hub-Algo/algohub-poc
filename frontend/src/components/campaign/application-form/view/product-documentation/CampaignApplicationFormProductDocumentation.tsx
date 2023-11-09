import { useState } from 'react'
import Input from '../../../../common/input/Input'
import {
  CampaignApplicationProductDocumentation,
  CampaignApplicationFormData,
  CampaignApplicationFormView,
} from '../../CampaignApplicationForm.types'
import {
  CAMPAIGN_APPLICATION_RAISED_FUNDS_RANGE,
  INITIAL_CAMPAIGN_APPLICATION_PRODUCT_DOCUMENTATION,
} from '../../CampaignApplicationForm.constants'
import Button from '../../../../common/button/Button'

interface CampaignApplicationFormProductDocumentationProps {
  onClickNextButton: (data: CampaignApplicationFormData) => void
  onClickPrevButton: (view: CampaignApplicationFormView) => void
  savedState?: CampaignApplicationProductDocumentation
}

function CampaignApplicationFormProductDocumentation({
  onClickNextButton,
  onClickPrevButton,
  savedState,
}: CampaignApplicationFormProductDocumentationProps) {
  const [state, setState] = useState<CampaignApplicationProductDocumentation | null>(savedState ?? null)

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
      className={'text-gray-900 flex flex-col gap-4 my-20 items-center'}
    >
      <h2 className={'font-semibold text-xl mb-5'}>{'Product Documentation'}</h2>

      <p className={'max-w-2xl text-center mb-5'}>
        {
          'To be eligible for funding in the AlgoHub Token Sales program, your product submission will undergo a comprehensive approval process, which includes, but is not limited to, community due diligence and a supermajority vote. To facilitate a smoother evaluation process and enhance your chances of approval, please ensure that the product documentation you are entering below is accurate and complete.'
        }
      </p>

      <div className={'flex flex-col items-center gap-4 max-w-md'}>
        <div className={'gap-4 flex flex-col'}>
          <p>{'Have you previously raised funds for this project (if yes, please select the corresponding range)?'}</p>

          <ul>
            {CAMPAIGN_APPLICATION_RAISED_FUNDS_RANGE.map((range) => (
              <li>
                <label className={'gap-2 flex'}>
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

        <Input labels={{ inputTitle: 'Link to Roadmap' }} type={'url'} value={state?.roadmap ?? ''} onChange={handleSetRoadmap} />

        <Input labels={{ inputTitle: 'Link to Whitepaper' }} type={'url'} value={state?.whitepaper ?? ''} onChange={handleSetWhitepaper} />

        <Input
          labels={{ inputTitle: 'Link to Token Vesting Schedule' }}
          type={'url'}
          value={state?.tokenVestingSchedule ?? ''}
          onChange={handleSetTokenVestingSchedule}
        />

        <Input labels={{ inputTitle: `Audit Report` }} type={'url'} value={state?.auditReport ?? ''} onChange={handleSetAuditReport} />

        <p>
          {'Please note that you will be required to sign an authentication transaction with the creator address for the entered Asset ID.'}
        </p>

        <Input labels={{ inputTitle: `Token - Asset ID` }} type={'number'} value={state?.assetId ?? ''} onChange={handleSetAssetId} />

        <p>
          {
            'Please note that you will be required to sign an authentication transaction with the creator address for each of the entered Application IDs.'
          }
        </p>

        <Input
          labels={{ inputTitle: `Smart Contracts - Application IDs (if applicable)` }}
          type={'text'}
          value={state?.appId ?? ''}
          onChange={handleSetAppId}
        />

        <Input labels={{ inputTitle: `Link to Pitch Deck` }} type={'url'} value={state?.pitchDeck ?? ''} onChange={handleSetPitchDeck} />

        <div className="flex flex-col gap-4">
          <p>{'Do you consent to an in-depth interview regarding your product?'}</p>

          <label className={'gap-2 flex'}>
            <input type={'checkbox'} value={'Yes, I consent'} onChange={handleSetConsent} checked={state?.hasConsentToInDepthInterview} />

            {'Yes, I consent'}
          </label>
        </div>
      </div>

      <div className={'justify-between flex w-full mt-10'}>
        <Button type="button" onClick={handleClickPrevButton}>
          {'Prev'}
        </Button>

        <Button type="submit" isDisabled={isDisabled}>
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

  function handleSetAssetId(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, assetId: Number(value) } : { ...INITIAL_CAMPAIGN_APPLICATION_PRODUCT_DOCUMENTATION, assetId: Number(value) }
    })
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

  function handleClickNextButton() {
    onClickNextButton({ ...state!, type: CampaignApplicationFormView.ProductDocumentation })
  }

  function handleClickPrevButton() {
    onClickPrevButton(CampaignApplicationFormView.ProductOverview)
  }
}

export default CampaignApplicationFormProductDocumentation
