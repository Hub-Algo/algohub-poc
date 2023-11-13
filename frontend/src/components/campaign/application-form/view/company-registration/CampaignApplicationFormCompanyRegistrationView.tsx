import { useState } from 'react'
import Input from '../../../../common/input/Input'
import {
  CampaignApplicationCompanyRegistrationInfo,
  CampaignApplicationFormData,
  CampaignApplicationFormView,
} from '../../CampaignApplicationForm.types'
import { INITIAL_CAMPAIGN_APPLICATION_COMPANY_REGISTRATION_INFO } from '../../CampaignApplicationForm.constants'
import Button from '../../../../common/button/Button'

interface CampaignApplicationFormCompanyRegistrationViewProps {
  onClickNextButton: (data: CampaignApplicationFormData) => void
  onClickPrevButton: (view: CampaignApplicationFormView) => void
  savedState?: CampaignApplicationCompanyRegistrationInfo
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
      className={'text-gray-900 flex flex-col gap-4 my-20 items-center'}
    >
      <h2 className={'font-semibold text-3xl mb-10 text-gray-100'}>{'Company Registration Information'}</h2>

      <p className={'max-w-2xl text-center mb-10 text-gray-100'}>
        {
          'To be eligible for participation in the AlgoHub Token Sales program, you must provide evidence that the organization seeking funding is officially registered with a recognized national institution.'
        }
      </p>

      <div className={'flex flex-col items-center max-w-md'}>
        <Input
          labels={{ inputTitle: 'Registered company name' }}
          type={'text'}
          value={state?.registeredCompanyName ?? ''}
          onChange={handleSetRegisteredCompanyName}
        />

        <Input
          labels={{ inputTitle: 'Date of registration' }}
          type={'date'}
          value={state?.dateOfRegistration ?? ''}
          onChange={handleSetDateOfRegistration}
        />

        <Input
          labels={{ inputTitle: 'Country of registration' }}
          type={'text'}
          value={state?.countryOfRegistration ?? ''}
          onChange={handleSetCountryOfRegistration}
        />

        <Input
          labels={{ inputTitle: `Chamber of Commerce Registration Number (or equivalent)` }}
          type={'number'}
          value={state?.chamberOfCommerceRegistrationNumber ?? ''}
          onChange={handleChamberOfCommerceRegNumber}
          min={1}
        />
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
