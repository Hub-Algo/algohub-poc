import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { CampaignClient } from '../../../../../contracts/CampaignClient'
import algod from '../../../../../core/algosdk/AlgodManager'
import useAppContext from '../../../../../core/util/useAppContext'
import { useWallet } from '@txnlab/use-wallet'
import { useCampaignApplicationStateContext } from '../../../../../pages/campaign-application/CampaignApplication.context'
import { CampaignApplicationFormView } from '../../../../../pages/campaign-application/CampaignApplication.types'
import Button from '../../../../common/button/Button'
import { makeAssetTransferTxnWithSuggestedParamsFromObject } from 'algosdk'
import Toast, { ToastProps } from '../../../../common/toast/Toast'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import routes from '../../../../../core/routes'
import { convertToBaseUnits } from '../../../../../core/util/transaction/transactionUtils'

function CampaignApplicationDepositIdoAsa() {
  const { signer } = useWallet()
  const { formData, campaignId } = useCampaignApplicationStateContext()
  const appState = useAppContext()
  const [toastProps, setToastProps] = useState({ type: 'error' as ToastProps['type'], message: '' })
  const [loading, setLoading] = useState(false)
  const campaignContract = new CampaignClient(
    {
      sender: { signer, addr: appState.activeAccount?.address } as TransactionSignerAccount,
      resolveBy: 'id',
      id: campaignId!,
    },
    algod.client,
  )

  const idoAsaId = formData[CampaignApplicationFormView.ProductDocumentation]?.assetId
  const idoAsa = appState.userData?.user_created_assets.find((asset) => asset.index === idoAsaId)

  return (
    <div className={'flex flex-col justify-start text-white font-semibold mt-32 gap-6 h-screen max-w-lg mx-auto'}>
      <p>{'Please note that the deposit amount is calculated base on the fundraising goal you filled in the form'}</p>

      <p>{`If you don't have enough ${idoAsa?.params?.['unit-name']} in your account, the transaction will be reverted`}</p>

      <p>{`Deposit amount: ${
        formData[CampaignApplicationFormView.FundraisingGoal]
          ? ((formData[CampaignApplicationFormView.FundraisingGoal].maxAmount ??
              formData[CampaignApplicationFormView.FundraisingGoal].minAmount) *
              100) /
            Number(formData[CampaignApplicationFormView.FundraisingGoal].usdPricePerToken ?? 0)
          : 0
      }`}</p>

      <Button
        onClick={handleDepositIdoAsa}
        isDisabled={!idoAsaId || toastProps.type === 'success'}
        customClassName={'w-full'}
        size="lg"
        shouldDisplaySpinner={loading}
      >
        {'Deposit Ido Asa'}
      </Button>

      {toastProps.type === 'success' && (
        <Link to={routes.BASE} className="btn btn-success btn-lg">
          {'Go back to main page'}
        </Link>
      )}

      <Toast type={toastProps.type}>{toastProps.message}</Toast>
    </div>
  )

  async function handleDepositIdoAsa() {
    try {
      if (idoAsaId && appState.activeAccount?.address) {
        setLoading(true)
        const suggestedParams = await algod.client.getTransactionParams().do()
        const appMetadata = await campaignContract.appClient.getAppReference()

        const idoAsaAmountToTransfer = formData[CampaignApplicationFormView.FundraisingGoal]
          ? ((formData[CampaignApplicationFormView.FundraisingGoal].maxAmount ??
              formData[CampaignApplicationFormView.FundraisingGoal].minAmount) *
              100) /
            Number(formData[CampaignApplicationFormView.FundraisingGoal].usdPricePerToken ?? 0)
          : 0

        const idoXferTxn = makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: appState.activeAccount.address,
          to: appMetadata.appAddress,
          amount: convertToBaseUnits(idoAsa?.params?.decimals ?? 0, idoAsaAmountToTransfer),
          suggestedParams,
          assetIndex: idoAsaId,
        })

        await campaignContract.depositIdoAsa(
          { idoXfer: idoXferTxn, idoAsa: idoAsaId },
          {
            sender: { signer, addr: appState.activeAccount.address },
          },
        )

        setLoading(false)
        setToastProps({ type: 'success', message: `Successfully deposited ${idoAsaAmountToTransfer} ${idoAsa?.params?.['unit-name']}` })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setLoading(false)
      setToastProps({
        type: 'error',
        message: error.message ?? `Something went wrong while depositing ${idoAsa?.params?.['unit-name']} asset`,
      })
    }
  }
}

export default CampaignApplicationDepositIdoAsa
