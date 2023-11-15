import { FormEvent, Fragment, useEffect, useState } from 'react'
import algosdk, { makeAssetTransferTxnWithSuggestedParamsFromObject } from 'algosdk'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { useWallet } from '@txnlab/use-wallet'
import Toast from '../common/toast/Toast'
import InvestModalConfirmView from './view/confirm/InvestModalConfirmModal'
import InvestModalInitialView from './view/initial/InvestModalInitialView'
import { convertToBaseUnits } from '../../core/util/transaction/transactionUtils'
import Modal from '../common/modal/Modal'
import useAppContext from '../../core/util/useAppContext'
import algod from '../../core/algosdk/AlgodManager'
import { CampaignClient } from '../../contracts/CampaignClient'
import { USDC_ASSET } from '../../core/util/asset/assetConstants'
import { CampaignObj } from '../../services/campaignServices'
import { AssetInfoInterface } from '../../interfaces/AssetInfoInterface'
import { assetServices } from '../../services/assetServices'
interface InvestModalProps {
  campaignStatus: 'hypelist' | 'whitelist'
  campaign: CampaignObj
}

function InvestModal({ campaignStatus, campaign }: InvestModalProps) {
  const state = useAppContext()
  const { signer } = useWallet()
  const [value, setValue] = useState<number>()
  const [view, setView] = useState<'initial' | 'confirm'>('initial')
  const [investState, setInvestState] = useState<'success' | 'failed'>()
  const [toastMessage, setToaastMessage] = useState('')
  const [loading, setLoading] = useState<boolean>()
  const [idoAsaInfo, setIdoAsaInfo] = useState<AssetInfoInterface>()

  const fetchIdoAssetInfo = async (assetId: number) => {
    const { asset } = await assetServices.getAssetInformation(assetId)
    setIdoAsaInfo(asset)
  }

  useEffect(() => {
    fetchIdoAssetInfo(campaign.idoAsa)
  }, [campaign.idoAsa])

  return (
    <>
      <Modal id="invest-modal" modalButtonName={campaignStatus === 'hypelist' ? 'Hypelist' : 'Invest'}>
        {renderContent()}
      </Modal>

      <Toast type={investState === 'failed' ? 'error' : 'success'}>{toastMessage}</Toast>
    </>
  )

  function renderContent() {
    let content = <Fragment />

    switch (view) {
      case 'initial': {
        content = (
          <InvestModalInitialView
            onInvestButtonClick={handleChangeView}
            inputProps={{ value, onChange: handleChangeValue }}
            campaign={campaign}
            idoAsa={idoAsaInfo}
          />
        )
        break
      }

      case 'confirm': {
        content = (
          <InvestModalConfirmView
            onConfirm={handleInvest}
            onCancel={handleCancel}
            inputAmount={value!}
            state={investState}
            shouldDisplaySpinner={loading}
            idoAsa={idoAsaInfo}
            conversionRate={campaign.conversionRate}
          />
        )
      }
    }

    return content
  }

  function handleChangeValue(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    let { value } = event.currentTarget

    // USDC value cannot be a negative number or be greater than max value
    if (value.includes('-')) {
      value = value.replace('-', '')
    } else if (parseFloat(value) > Number(event.currentTarget.max)) {
      value = value.slice(0, value.length - 1)
    }

    setValue(Number(value))
  }

  function handleChangeView(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    event.stopPropagation()

    setView('confirm')
  }

  async function handleInvest() {
    try {
      if (state.activeAccount?.address && value) {
        setLoading(true)

        if (!state.userData?.usdc_balance || (state.userData?.usdc_balance && state.userData.usdc_balance < value)) {
          throw new Error(`You don't have enough balance to invest ${value} USDC`)
        }

        const campaignContract = new CampaignClient(
          {
            sender: { signer, addr: state.activeAccount.address } as TransactionSignerAccount,
            resolveBy: 'id',
            id: Number(campaign.appId),
          },
          algod.client,
        )

        const suggestedParams = await algod.client.getTransactionParams().do()
        const appClient = await campaignContract.appClient.getAppReference()
        const investmentAmount = convertToBaseUnits(USDC_ASSET.decimals, value)
        const investXferTxn = makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: state.activeAccount.address,
          to: appClient.appAddress,
          amount: investmentAmount,
          suggestedParams: suggestedParams,
          assetIndex: USDC_ASSET.id, // TODO: Use mainnet usdc asset
        })

        await campaignContract.invest(
          { investmentAsaXfer: investXferTxn, investmentAsa: USDC_ASSET.id, investmentAmount: value },
          {
            sender: { signer, addr: state.activeAccount?.address } as TransactionSignerAccount,
            boxes: [new Uint8Array(Buffer.concat([Buffer.from('p'), algosdk.decodeAddress(state.activeAccount.address).publicKey]))],
          },
        )

        setLoading(false)
        setInvestState('success')
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setLoading(false)
      setInvestState('failed')
      setToaastMessage(e.message ?? 'Something went wrong while sending the transaction.')
    }
  }

  function handleCancel() {
    setView('initial')
    setInvestState(undefined)
  }
}

export default InvestModal
