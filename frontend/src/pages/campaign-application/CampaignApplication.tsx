import { Fragment } from 'react'
import CampaignApplicationSteps from '../../components/CampaignApplicationSteps'
import PageContainer from '../../components/PageContainer'
import { useCampaignApplicationStateContext } from './CampaignApplication.context'
import CampaignApplicationForm from '../../components/campaign/application/view/form/CampaignApplicationForm'
import CampaignApplicationConfirmationPage from '../../components/campaign/application/view/confirmation/CampaignApplicationConfirmationPage'
import CampaignApplicationDepositIdoAsa from '../../components/campaign/application/view/deposit-ido-asa/CampaignApplicationDepositIdoAsa'
import { useWallet } from '@txnlab/use-wallet'
import EmptyStatePage from '../../components/common/EmptyStatePage'

function CampaignApplication() {
  const { view } = useCampaignApplicationStateContext()
  const { activeAccount } = useWallet()

  return (
    <div>
      {activeAccount ? (
        <PageContainer>
          <CampaignApplicationSteps />
          {renderView()}
        </PageContainer>
      ) : (
        <PageContainer>
          <EmptyStatePage />
        </PageContainer>
      )}
    </div>
  )

  function renderView() {
    let content = <Fragment />

    switch (view) {
      case 'form': {
        content = <CampaignApplicationForm />
        break
      }

      case 'confirmation': {
        content = <CampaignApplicationConfirmationPage />
        break
      }
      case 'deposit-ido-asa': {
        content = <CampaignApplicationDepositIdoAsa />
        break
      }

      default:
        break
    }

    return content
  }
}

export default CampaignApplication
