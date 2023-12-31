import { useState } from 'react'

import Input from '../../../../../../common/input/Input'

import { INITIAL_CAMPAIGN_APPLICATION_COMPANY_REGISTRATION_INFO } from '../../CampaignApplicationForm.constants'
import Button from '../../../../../../common/button/Button'
import {
  CampaignApplicationCompanyRegistrationInfo,
  CampaignApplicationFormData,
  CampaignApplicationFormView,
} from '../../../../../../../pages/campaign-application/CampaignApplication.types'
import LabelTooltip from '../../../../../../common/LabelTooltip'

interface CampaignApplicationFormCompanyRegistrationViewProps {
  onClickNextButton: (data: CampaignApplicationFormData) => void
  onClickPrevButton: (view: CampaignApplicationFormView) => void
  savedState: CampaignApplicationCompanyRegistrationInfo | null
}

function CampaignApplicationFormCompanyRegistrationView({
  onClickNextButton,
  onClickPrevButton,
  savedState,
}: CampaignApplicationFormCompanyRegistrationViewProps) {
  const [state, setState] = useState<CampaignApplicationCompanyRegistrationInfo | null>(savedState ?? null)

  const isDisabled =
    !state?.chamberOfCommerceRegistrationNumber || !state.countryOfRegistration || !state.dateOfRegistration || !state.registeredCompanyName

  return (
    <form
      onSubmit={handleClickNextButton}
      id={CampaignApplicationFormView.CompanyRegistrationInfo}
      className={'text-gray-900 flex flex-col gap-4 mb-20 items-center'}
    >
      <h2 className={'font-semibold text-3xl mb-10 text-gray-100'}>{'Company Registration Information'}</h2>

      <p className={'max-w-2xl text-center mb-10 text-gray-100'}>
        {
          'To be eligible for participation in the AlgoHub Token Sales program, you must provide evidence that the organization seeking funding is officially registered with a recognized national institution.'
        }
      </p>

      <div className={'flex flex-col items-center max-w-md'}>
        <div className="w-full">
          <LabelTooltip labelContent="Registered company name" />
          <Input type={'text'} value={state?.registeredCompanyName ?? ''} onChange={handleSetRegisteredCompanyName} />
        </div>

        <div className="w-full">
          <LabelTooltip labelContent="Date of registration" />
          <Input type={'date'} value={state?.dateOfRegistration ?? ''} onChange={handleSetDateOfRegistration} />
        </div>

        <div className="w-full">
          <LabelTooltip labelContent="Country of registration" />
          <Input type={'text'} value={state?.countryOfRegistration ?? ''} onChange={handleSetCountryOfRegistration} />
        </div>

        <div className="w-full">
          <LabelTooltip labelContent="Chamber of Commerce Registration Number (or equivalent)" />
          <Input
            type={'number'}
            value={state?.chamberOfCommerceRegistrationNumber ?? ''}
            onChange={handleChamberOfCommerceRegNumber}
            min={1}
          />
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

  function handleSetRegisteredCompanyName(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev
        ? { ...prev, registeredCompanyName: value }
        : { ...INITIAL_CAMPAIGN_APPLICATION_COMPANY_REGISTRATION_INFO, registeredCompanyName: value }
    })
  }

  function handleSetDateOfRegistration(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev
        ? { ...prev, dateOfRegistration: value }
        : { ...INITIAL_CAMPAIGN_APPLICATION_COMPANY_REGISTRATION_INFO, dateOfRegistration: value }
    })
  }

  function handleChamberOfCommerceRegNumber(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev
        ? { ...prev, chamberOfCommerceRegistrationNumber: Number(value) }
        : { ...INITIAL_CAMPAIGN_APPLICATION_COMPANY_REGISTRATION_INFO, chamberOfCommerceRegistrationNumber: Number(value) }
    })
  }

  function handleSetCountryOfRegistration(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev
        ? { ...prev, countryOfRegistration: value }
        : { ...INITIAL_CAMPAIGN_APPLICATION_COMPANY_REGISTRATION_INFO, countryOfRegistration: value }
    })
  }

  function handleClickNextButton(event: React.SyntheticEvent<HTMLFormElement, Event>) {
    event.preventDefault()
    onClickNextButton({ ...state!, type: CampaignApplicationFormView.CompanyRegistrationInfo })
  }

  function handleClickPrevButton() {
    onClickPrevButton(CampaignApplicationFormView.TeamInfo)
  }
}

export default CampaignApplicationFormCompanyRegistrationView
