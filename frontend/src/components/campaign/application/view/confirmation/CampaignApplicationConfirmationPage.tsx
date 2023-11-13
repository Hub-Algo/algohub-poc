import {
  useCampaignApplicationDispatchContext,
  useCampaignApplicationStateContext,
} from '../../../../../pages/campaign-application/CampaignApplication.context'
import AlgohubCreateCampaign from '../../../../algohub-pre-generated/AlgohubCreateCampaign'
import { useState } from 'react'
import useAppContext from '../../../../../core/util/useAppContext'
import { filterTruthyObjectValues } from '../../../../../core/util/object/objectUtils'
import Button from '../../../../common/button/Button'
import { CampaignApplicationFormView } from '../../../../../pages/campaign-application/CampaignApplication.types'
import { AppCallTransactionResultOfType } from '@algorandfoundation/algokit-utils/types/app'

function CampaignApplicationConfirmationPage() {
  const dispatch = useCampaignApplicationDispatchContext()
  const state = useAppContext()
  const { formData, campaignId } = useCampaignApplicationStateContext()

  const [hasSubmitted, setHasSubmitted] = useState(false)

  return hasSubmitted ? (
    <div className={'flex flex-col items-center justify-start text-green-600 font-semibold mt-32 gap-8 h-screen'}>
      <p>{'Your campaign application has been submitted!'}</p>

      <Button customClassName={'btn-success'} onClick={handleSetDepositIDOView} isDisabled={!campaignId}>
        {'Deposit IDO'}
      </Button>
    </div>
  ) : (
    <div className={'flex flex-col items-center justify-start text-green-600 font-semibold mt-32 gap-8 h-screen'}>
      <h2>{'Confirm your campaign application!'}</h2>

      {state?.algohubClient && Object.keys(filterTruthyObjectValues(formData)).length === 6 && (
        <AlgohubCreateCampaign
          typedClient={state?.algohubClient}
          votersAsa={478560182}
          price={1000}
          maxBuyCap={formData[CampaignApplicationFormView.FundraisingGoal]?.maxAmount ?? 0}
          softCap={formData[CampaignApplicationFormView.FundraisingGoal]?.maxAmount ?? 0}
          hardCap={formData[CampaignApplicationFormView.FundraisingGoal]?.minAmount ?? 0}
          duration={86400} // 1 day
          metadataUrl={''}
          idoAsa={formData[CampaignApplicationFormView.ProductDocumentation]?.assetId ?? 0}
          buyAsa={formData[CampaignApplicationFormView.ProductDocumentation]?.assetId ?? 0}
          onSuccess={handleSuccessfulApplication}
        >
          {'Submit application'}
        </AlgohubCreateCampaign>
      )}
    </div>
  )

  function handleSetDepositIDOView() {
    dispatch({ type: 'SET_VIEW', view: 'deposit-ido-asa' })
  }

  function handleSuccessfulApplication(response: AppCallTransactionResultOfType<bigint>) {
    setHasSubmitted(true)

    if (response.return) {
      dispatch({
        type: 'SET_CAMPAIGN_ID',
        campaignId: response.return,
      })
    }
  }
}

export default CampaignApplicationConfirmationPage
