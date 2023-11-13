import { useState } from 'react'
import Input from '../../../../common/input/Input'
import { CampaignApplicationFormData, CampaignApplicationFormView, CampaignApplicationTeamInfo } from '../../CampaignApplicationForm.types'
import { INITIAL_CAMPAIGN_APPLICATION_TEAM_INFO } from '../../CampaignApplicationForm.constants'
import Button from '../../../../common/button/Button'

interface CampaignApplicatioFormTeamInfoViewProps {
  onClickPrevButton: (view: CampaignApplicationFormView) => void
  onClickNextButton: (data: CampaignApplicationFormData) => void
  savedState?: CampaignApplicationTeamInfo
}

function CampaignApplicatioFormTeamInfoView({ onClickNextButton, onClickPrevButton, savedState }: CampaignApplicatioFormTeamInfoViewProps) {
  const [state, setState] = useState<CampaignApplicationTeamInfo | null>(savedState ?? null)

  const isDisabled = !state?.employeeNumber || !state.founder

  return (
    <form
      onSubmit={handleClickNextButton}
      id={CampaignApplicationFormView.ContactInfo}
      className={'text-gray-900 flex flex-col gap-4 my-20'}
    >
      <div className={'flex flex-col items-center mx-auto max-w-md w-full'}>
        <h2 className={'font-semibold text-3xl mb-10 text-cente text-gray-100'}>{'Team Information'}</h2>

        <Input
          labels={{ inputTitle: 'Number of employees' }}
          type={'number'}
          value={state?.employeeNumber ?? ''}
          onChange={handleSetEmployeeNumber}
          min={0}
        />

        <Input
          labels={{ inputTitle: 'Founder information' }}
          type={'text'}
          value={state?.founder ?? ''}
          onChange={handleSetFounderInformation}
        />

        <Input
          labels={{ inputTitle: 'Cofounder information' }}
          type={'text'}
          value={state?.cofounder ?? ''}
          onChange={handleSetCofounderInformation}
        />
      </div>

      <div className={'justify-between flex mt-10'}>
        <Button buttonColor="orange" type="button" onClick={handleClickPrevButton}>
          {'Prev'}
        </Button>

        <Button buttonColor="orange" type="submit" isDisabled={isDisabled}>
          {'Next'}
        </Button>
      </div>
    </form>
  )

  function handleSetEmployeeNumber(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev
        ? { ...prev, employeeNumber: Number(value) }
        : { ...INITIAL_CAMPAIGN_APPLICATION_TEAM_INFO, employeeNumber: Number(value) }
    })
  }

  function handleSetFounderInformation(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, founder: value } : { ...INITIAL_CAMPAIGN_APPLICATION_TEAM_INFO, founder: value }
    })
  }

  function handleSetCofounderInformation(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, cofounder: value } : { ...INITIAL_CAMPAIGN_APPLICATION_TEAM_INFO, cofounder: value }
    })
  }

  function handleClickNextButton(event: React.SyntheticEvent<HTMLFormElement, Event>) {
    event.preventDefault()
    onClickNextButton({ ...state!, type: CampaignApplicationFormView.TeamInfo })
  }

  function handleClickPrevButton() {
    onClickPrevButton(CampaignApplicationFormView.ContactInfo)
  }
}

export default CampaignApplicatioFormTeamInfoView
