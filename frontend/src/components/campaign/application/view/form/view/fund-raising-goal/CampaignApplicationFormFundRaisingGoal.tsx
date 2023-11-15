import { useState } from 'react'
import Input from '../../../../../../common/input/Input'

import { BiQuestionMark } from 'react-icons/bi'
import {
  CampaignApplicationFormData,
  CampaignApplicationFormView,
  CampaignApplicationFundRaisingGoal,
} from '../../../../../../../pages/campaign-application/CampaignApplication.types'
import LabelTooltip from '../../../../../../common/LabelTooltip'
import Button from '../../../../../../common/button/Button'
import { INITIAL_CAMPAIGN_APPLICATION_FUND_RAISING_GOAL } from '../../CampaignApplicationForm.constants'

interface CampaignApplicationFormFundRaisingGoalProps {
  onSubmitForm: (data: CampaignApplicationFormData) => void
  onClickPrevButton: (view: CampaignApplicationFormView) => void
  savedState: CampaignApplicationFundRaisingGoal | null
}

function CampaignApplicationFormFundRaisingGoal({
  onSubmitForm,
  onClickPrevButton,
  savedState,
}: CampaignApplicationFormFundRaisingGoalProps) {
  const [state, setState] = useState<CampaignApplicationFundRaisingGoal | null>(savedState ?? null)

  const isDisabled =
    !state?.financialPlan ||
    !state.hasAgreedToAlgohubTermsOfService ||
    !state.hasConcentToApplicationFee ||
    !state.hasConcentToFundraiseFee ||
    !state.hasConfirmedDataAccuracy ||
    !state.usdPricePerToken ||
    !state.minAmount

  return (
    <form
      onSubmit={handleSubmitForm}
      id={CampaignApplicationFormView.CompanyRegistrationInfo}
      className={'text-gray-900 flex flex-col gap-4 mb-20'}
    >
      <div className={'flex flex-col items-center gap-4'}>
        <h2 className={'font-semibold text-3xl mb-10 text-gray-100'}>{'Fund-Raising Goal'}</h2>

        <p className={'max-w-2xl mb-5 text-gray-100'}>
          {
            'In this section, you will be asked to provide the funding goal(s) you are seeking to reach on the AlgoHub platform; along with the financial plan depicting exactly how the raised funds will be employed by the requesting company. '
          }
        </p>

        <div className="w-full">
          <LabelTooltip
            labelContent="Minimum funding target"
            tooltipText="This will be the minimum amount of funds required for the campaign to be considered successful. In the event that this target is not met within the specified timeframe, it will trigger the automatic termination of the token sale, followed by the prompt refund of all collected capital to the respective investors."
          />
          <Input type={'number'} value={state?.minAmount ?? ''} onChange={handleSetMinAmount} />
        </div>

        <div className="w-full">
          <LabelTooltip
            labelContent="Maximum Funding Target (if applicable)"
            tooltipText="In the event that this target is met within the specified timeframe, the token sales will be considered completed, with no possibility to raise additional funds beyond the Maximum Funding Target."
          />
          <Input type={'number'} value={state?.maxAmount ?? ''} onChange={handleSetMaxAmount} />
        </div>

        <div className="w-full">
          <LabelTooltip labelContent="USD conversionRate of the token" />
          <Input type={'string'} value={state?.usdPricePerToken ?? ''} onChange={handleSetUsdPricePerToken} customClassName={'mx-auto'} />
        </div>

        <div className="w-full">
          <LabelTooltip labelContent="Financial plan" />
          <Input type={'url'} value={state?.financialPlan ?? ''} onChange={handleSetFinancialPlan} customClassName={'mx-auto'} />
        </div>

        <div className="flex flex-col gap-6 mt-6">
          <div className="gap-1 flex flex-col">
            <p className="text-gray-100 font-bold">
              {'In order to prevent spam applications, AlgoHub applies an application fee of 100 USDC.'}
            </p>

            <label className={'gap-2 flex text-gray-300'}>
              <input
                type={'checkbox'}
                value={'yes'}
                onChange={handleSetApplicationFeeConsent}
                checked={state?.hasConcentToApplicationFee}
              />

              {
                'I understand that AlgoHub will apply an application fee of 100 USDC, and I consent to the collection of said fee at application submission time.'
              }
            </label>
          </div>

          <div className="gap-1 flex flex-col">
            <p className="text-gray-100 font-bold">{'AlgoHub applies a fundraise fee equal to 6% of the raised capital.'}</p>

            <label className={'gap-2 flex text-gray-300'}>
              <input type={'checkbox'} value={'yes'} onChange={handleSetFundraiseFeeConsent} checked={state?.hasConcentToFundraiseFee} />

              {
                'I understand that AlgoHub will apply a fundraise fee (6% of the raised capital), and I consent to the collection of said fee should the fundraising goal be met'
              }
            </label>
          </div>

          <div className="gap-1 w-full flex flex-col">
            <p className="text-gray-100 font-bold">{`By submitting this application form, you agree to AlgoHub's terms of service`}</p>

            <label className={'gap-2 flex text-gray-300'}>
              <input
                type={'checkbox'}
                value={'yes'}
                onChange={handleSetAlgohubTermsOfServiceAgreement}
                checked={state?.hasAgreedToAlgohubTermsOfService}
              />

              {"I agree to AlgoHub's terms of service."}
            </label>
          </div>
        </div>

        <div className="gap-4 flex flex-col mt-10 w-full">
          <div className="flex items-center gap-3">
            <label className={'gap-2 flex text-gray-300'}>
              <input type={'checkbox'} value={'yes'} onChange={handleSetHasConfirmed} checked={state?.hasConfirmedDataAccuracy} />

              {'I confirm that the information I have provided is accurate and complete.'}
            </label>
            <div
              className="tooltip tooltip-bottom text-sm"
              data-tip="By submitting this form, you confirm that the information provided is accurate and complete to the best of your knowledge. You acknowledge that any deliberate misrepresentation may result in the rejection of the submitted application at any stage of the process, subject to the sole and absolute discretion of the AlgoHub team. You further understand and agree that the submission of this form does not guarantee acceptance, and that AlgoHub reserves the right to reject any application for any reason without explanation."
            >
              <button className="bg-gray-100 rounded-full">
                <BiQuestionMark className="text-gray-950" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={'flex justify-between mt-10'}>
        <Button type="button" buttonColor="orange" onClick={handleClickPrevButton}>
          {'Prev'}
        </Button>

        <Button type="submit" buttonColor="orange" isDisabled={isDisabled}>
          {'Submit'}
        </Button>
      </div>
    </form>
  )

  function handleSetMinAmount(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, minAmount: Number(value) } : { ...INITIAL_CAMPAIGN_APPLICATION_FUND_RAISING_GOAL, minAmount: Number(value) }
    })
  }

  function handleSetMaxAmount(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, maxAmount: Number(value) } : { ...INITIAL_CAMPAIGN_APPLICATION_FUND_RAISING_GOAL, maxAmount: Number(value) }
    })
  }

  function handleSetUsdPricePerToken(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, usdPricePerToken: value } : { ...INITIAL_CAMPAIGN_APPLICATION_FUND_RAISING_GOAL, usdPricePerToken: value }
    })
  }

  function handleSetFinancialPlan(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev ? { ...prev, financialPlan: value } : { ...INITIAL_CAMPAIGN_APPLICATION_FUND_RAISING_GOAL, financialPlan: value }
    })
  }

  function handleSetFundraiseFeeConsent(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev
        ? { ...prev, hasConcentToFundraiseFee: value === 'yes' }
        : { ...INITIAL_CAMPAIGN_APPLICATION_FUND_RAISING_GOAL, hasConcentToFundraiseFee: value === 'yes' }
    })
  }

  function handleSetAlgohubTermsOfServiceAgreement(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev
        ? { ...prev, hasAgreedToAlgohubTermsOfService: value === 'yes' }
        : { ...INITIAL_CAMPAIGN_APPLICATION_FUND_RAISING_GOAL, hasAgreedToAlgohubTermsOfService: value === 'yes' }
    })
  }

  function handleSetApplicationFeeConsent(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev
        ? { ...prev, hasConcentToApplicationFee: value === 'yes' }
        : { ...INITIAL_CAMPAIGN_APPLICATION_FUND_RAISING_GOAL, hasConcentToApplicationFee: value === 'yes' }
    })
  }

  function handleSetHasConfirmed(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    const { value } = event.currentTarget

    setState((prev) => {
      return prev
        ? { ...prev, hasConfirmedDataAccuracy: value === 'yes' }
        : { ...INITIAL_CAMPAIGN_APPLICATION_FUND_RAISING_GOAL, hasConfirmedDataAccuracy: value === 'yes' }
    })
  }
  function handleSubmitForm() {
    onSubmitForm({ ...state!, type: CampaignApplicationFormView.FundraisingGoal })
  }

  function handleClickPrevButton() {
    onClickPrevButton(CampaignApplicationFormView.ProductDocumentation)
  }
}

export default CampaignApplicationFormFundRaisingGoal
