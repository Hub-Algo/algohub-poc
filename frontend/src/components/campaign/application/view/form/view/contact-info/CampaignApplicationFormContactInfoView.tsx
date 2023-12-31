import { useState } from 'react'

import Input from '../../../../../../common/input/Input'
import { INITIAL_CAMPAIGN_APPLICATION_CONTACT_INFO } from '../../CampaignApplicationForm.constants'
import Button from '../../../../../../common/button/Button'
import {
  CampaignApplicationContactInfo,
  CampaignApplicationFormData,
  CampaignApplicationFormView,
} from '../../../../../../../pages/campaign-application/CampaignApplication.types'
import LabelTooltip from '../../../../../../common/LabelTooltip'

interface CampaignApplicationFormContactInfoViewProps {
  onClickNextButton: (data: CampaignApplicationFormData) => void
  savedState: CampaignApplicationContactInfo | null
}

function CampaignApplicationFormContactInfoView({ onClickNextButton, savedState }: CampaignApplicationFormContactInfoViewProps) {
  const [state, setState] = useState<CampaignApplicationContactInfo | null>(savedState ?? null)

  const isDisabled = !state?.email || !state.name || !state.surname || !state.role

  return (
    <form onSubmit={handleClickNextButton} id={CampaignApplicationFormView.ContactInfo} className={'flex flex-col gap-4 mb-20'}>
      <h2 className={'font-semibold text-3xl mb-10 mx-auto text-gray-100'}>{'Contact Information'}</h2>

      <p className={'max-w-2xl text-center mb-10 mx-auto text-gray-100'}>
        {
          'The information provided here will be utilized solely for the purpose of contacting your organization, as necessary, to obtain additional information or to verify the details submitted by you. It is in the applicant best interest to provide frequently used channels of communication, to avoid possibly slowing down the application process. '
        }
      </p>

      <div className={'flex flex-col mx-auto max-w-md w-full text-gray-900'}>
        <div className="w-full">
          <LabelTooltip labelContent="First name" />
          <Input type={'text'} value={state?.name ?? ''} onChange={handleSetName} />
        </div>

        <div className="w-full">
          <LabelTooltip labelContent="Last name" />
          <Input type={'text'} value={state?.surname ?? ''} onChange={handleSetLastName} />
        </div>

        <div className="w-full">
          <LabelTooltip labelContent="Role within the organization" />
          <Input type={'text'} value={state?.role ?? ''} onChange={handleSetRole} />
        </div>

        <div className="w-full">
          <LabelTooltip labelContent="Email address" />
          <Input type={'email'} value={state?.email ?? ''} onChange={handleSetEmail} />
        </div>

        <div className="w-full">
          <LabelTooltip labelContent="Discord handle" />
          <Input type={'text'} value={state?.discord ?? ''} onChange={handleSetDiscord} />
        </div>

        <div className="w-full">
          <LabelTooltip labelContent="Twitter handle" />
          <Input type={'text'} value={state?.twitter ?? ''} onChange={handleSetTwitter} />
        </div>

        <div className="w-full">
          <LabelTooltip labelContent="Telegram channel" />
          <Input type={'text'} value={state?.telegram ?? ''} onChange={handleSetTelegram} />
        </div>
      </div>

      <Button type={'submit'} isDisabled={isDisabled} buttonColor={'orange'} customClassName={'ml-auto mt-10'}>
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
