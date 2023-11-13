import classNames from 'classnames'
import { useCampaignApplicationStateContext } from '../pages/campaign-application/CampaignApplication.context'

const CAMPAIGN_APPLICATION_STEPS = [
  { id: 'form', title: 'Fill the form' },
  { id: 'confirmation', title: 'Confirm your application' },
  { id: 'deposit-ido-asa', title: 'Deposit IDO ASA' },
]

function CampaignApplicationSteps() {
  const { view } = useCampaignApplicationStateContext()
  const activeStepIndex = CAMPAIGN_APPLICATION_STEPS.findIndex((step) => step.id === view)

  return (
    <ul className="steps">
      {CAMPAIGN_APPLICATION_STEPS.map((step, index) => (
        <li className={classNames('step text-gray-400', 'mt-20', { 'step-primary text-gray-100': activeStepIndex >= index })}>
          {step.title}
        </li>
      ))}
    </ul>
  )
}

export default CampaignApplicationSteps
