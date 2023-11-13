import { useEffect, useState } from 'react'
import { useCampaignApplicationStateContext } from '../../../../../../pages/campaign-application/CampaignApplication.context'
import { CampaignApplicationFormView } from '../../../../../../pages/campaign-application/CampaignApplication.types'
import { Transaction, makeAssetTransferTxnWithSuggestedParamsFromObject } from 'algosdk'
import useAppContext from '../../../../../../core/util/useAppContext'
import algod from '../../../../../../core/algosdk/AlgodManager'
import { CampaignClient } from '../../../../../../contracts/CampaignClient'

function useGenerateDepositIdoAsaTxn(campaignContract: CampaignClient) {
  const appState = useAppContext()

  const { formData } = useCampaignApplicationStateContext()
  const [state, setState] = useState<Transaction>()
  const idoAsaToTransfer = formData[CampaignApplicationFormView.FundraisingGoal]
    ? formData[CampaignApplicationFormView.FundraisingGoal]?.minAmount /
      Number(formData[CampaignApplicationFormView.FundraisingGoal]?.usdPricePerToken)
    : 0
  const idoAsa = formData[CampaignApplicationFormView.ProductDocumentation]?.assetId

  useEffect(() => {
    ;(async () => {
      if (idoAsa && appState.userData?.wallet_address) {
        const suggestedParams = await algod.client.getTransactionParams().do()
        const appMetadata = await campaignContract.appClient.getAppReference()

        const idoXferTxn = makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: appState.userData.wallet_address,
          to: appMetadata.appAddress,
          amount: idoAsaToTransfer * 1000000,
          suggestedParams,
          assetIndex: idoAsa,
        })

        setState(idoXferTxn)
      }
    })()
  }, [appState.userData?.wallet_address, campaignContract.appClient, idoAsa, idoAsaToTransfer])

  return state
}

export default useGenerateDepositIdoAsaTxn
