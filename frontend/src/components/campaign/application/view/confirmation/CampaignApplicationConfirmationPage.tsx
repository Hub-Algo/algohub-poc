import { AppCallTransactionResultOfType } from '@algorandfoundation/algokit-utils/types/app'
import { useState } from 'react'
import { USDC_ASSET } from '../../../../../core/util/asset/usdcConstants'
import { filterTruthyObjectValues } from '../../../../../core/util/object/objectUtils'
import useAppContext from '../../../../../core/util/useAppContext'
import {
  useCampaignApplicationDispatchContext,
  useCampaignApplicationStateContext,
} from '../../../../../pages/campaign-application/CampaignApplication.context'
import { CampaignApplicationData, CampaignApplicationFormView } from '../../../../../pages/campaign-application/CampaignApplication.types'
import AlgohubCreateCampaign from '../../../../algohub-pre-generated/AlgohubCreateCampaign'
import Button from '../../../../common/button/Button'

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
          metadata={formData as CampaignApplicationData}
          conversionRate={Number(formData[CampaignApplicationFormView.FundraisingGoal]?.usdPricePerToken) ?? 0}
          maxInvestmentPerAccount={formData[CampaignApplicationFormView.FundraisingGoal]?.maxAmount ?? 0}
          minTotalInvestment={formData[CampaignApplicationFormView.FundraisingGoal]?.maxAmount ?? 0}
          maxTotalInvestment={
            formData[CampaignApplicationFormView.FundraisingGoal]?.maxAmount ??
            formData[CampaignApplicationFormView.FundraisingGoal]?.minAmount ??
            0
          }
          duration={86400} // 1 day
          idoAsa={formData[CampaignApplicationFormView.ProductDocumentation]?.assetId ?? 0}
          investmentAsa={USDC_ASSET.id} // TODO: Set USDC mainnet id
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
