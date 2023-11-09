import { useState } from 'react'
import Input from '../../../../common/input/Input'
import {
  CampaignApplicationContactInfo,
  CampaignApplicationFormData,
  CampaignApplicationFormView,
} from '../../CampaignApplicationForm.types'
import { INITIAL_CAMPAIGN_APPLICATION_CONTACT_INFO } from '../../CampaignApplicationForm.constants'
import Button from '../../../../common/button/Button'

interface CampaignApplicationFormContactInfoViewProps {
  onClickNextButton: (data: CampaignApplicationFormData) => void
  savedState?: NonNullable<CampaignApplicationContactInfo>
}

function CampaignApplicationFormContactInfoView({ onClickNextButton, savedState }: CampaignApplicationFormContactInfoViewProps) {
  const [state, setState] = useState<CampaignApplicationContactInfo>(savedState ?? null)

  const isDisabled = !state?.email || !state.name || !state.surname || !state.role

  return (
    <form
      onSubmit={handleClickNextButton}
      id={CampaignApplicationFormView.ContactInfo}
      className={'text-gray-900 flex flex-col gap-4 my-20'}
    >
      <h2 className={'font-semibold text-xl mb-10 mx-auto'}>{'Contact Information'}</h2>

      <p className={'max-w-2xl text-center mb-10 mx-auto'}>
        {
          'The information provided here will be utilized solely for the purpose of contacting your organization, as necessary, to obtain additional information or to verify the details submitted by you. It is in the applicant best interest to provide frequently used channels of communication, to avoid possibly slowing down the application process. '
        }
      </p>

      <div className={'flex flex-col mx-auto max-w-md w-full'}>
        <Input labels={{ inputTitle: 'First name' }} type={'text'} value={state?.name ?? ''} onChange={handleSetName} />

        <Input labels={{ inputTitle: 'Last name' }} type={'text'} value={state?.surname ?? ''} onChange={handleSetLastName} />

        <Input labels={{ inputTitle: 'Role within the organization' }} type={'text'} value={state?.role ?? ''} onChange={handleSetRole} />

        <Input labels={{ inputTitle: 'Email address' }} type={'email'} value={state?.email ?? ''} onChange={handleSetEmail} />

        <Input labels={{ inputTitle: 'Discord handle' }} type={'text'} value={state?.discord ?? ''} onChange={handleSetDiscord} />

        <Input labels={{ inputTitle: 'Twitter handle' }} type={'text'} value={state?.twitter ?? ''} onChange={handleSetTwitter} />

        <Input labels={{ inputTitle: 'Telegram channel' }} type={'text'} value={state?.telegram ?? ''} onChange={handleSetTelegram} />
      </div>

      <Button type="submit" isDisabled={isDisabled} customClassName={'ml-auto mt-10'}>
        {'Next'}
      </Button>
    </form>
  )

  function handleSetName(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, name: value } : { ...INITIAL_CAMPAIGN_APPLICATION_CONTACT_INFO, name: value }
    })
  }

  function handleSetLastName(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, surname: value } : { ...INITIAL_CAMPAIGN_APPLICATION_CONTACT_INFO, surname: value }
    })
  }

  function handleSetRole(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, role: value } : { ...INITIAL_CAMPAIGN_APPLICATION_CONTACT_INFO, role: value }
    })
  }

  function handleSetEmail(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, email: value } : { ...INITIAL_CAMPAIGN_APPLICATION_CONTACT_INFO, email: value }
    })
  }

  function handleSetDiscord(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, discord: value } : { ...INITIAL_CAMPAIGN_APPLICATION_CONTACT_INFO, discord: value }
    })
  }

  function handleSetTelegram(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, telegram: value } : { ...INITIAL_CAMPAIGN_APPLICATION_CONTACT_INFO, telegram: value }
    })
  }

  function handleSetTwitter(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, twitter: value } : { ...INITIAL_CAMPAIGN_APPLICATION_CONTACT_INFO, twitter: value }
    })
  }

  function handleClickNextButton(event: React.SyntheticEvent<HTMLFormElement, Event>) {
    event.preventDefault()
    onClickNextButton({ ...state!, type: CampaignApplicationFormView.ContactInfo })
  }
}

export default CampaignApplicationFormContactInfoView
