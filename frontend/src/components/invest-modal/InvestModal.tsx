import { FormEvent, Fragment, useState } from 'react'
import { CampaignInterface } from '../../interfaces/campaign-interface'
import Modal from '../common/modal/Modal'
import InvestModalInitialView from './view/initial/InvestModalInitialView'
import InvestModalConfirmView from './view/confirm/InvestModalConfirmModal'
import algosdk, { makeAssetTransferTxnWithSuggestedParamsFromObject } from 'algosdk'
import useAppContext from '../../core/util/useAppContext'
import algod from '../../core/algosdk/AlgodManager'
import { CampaignClient } from '../../contracts/CampaignClient'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { useWallet } from '@txnlab/use-wallet'
import Toast from '../common/toast/Toast'
import { USDC_ASSET } from '../../core/util/asset/AssetConstants'

interface InvestModalProps {
  campaignStatus: string
  campaignId: bigint | number
}
function InvestModal({ campaignStatus, campaignId }: InvestModalProps) {
  const state = useAppContext()
  const { signer } = useWallet()
  const [value, setValue] = useState<number>()
  const [view, setView] = useState<'initial' | 'confirm'>('initial')
  const [investState, setInvestState] = useState<'success' | 'failed'>()
  const [toastMessage, setToaastMessage] = useState('')
  const [loading, setLoading] = useState<boolean>()

  return (
    <>
      <Modal id="invest-modal" modalButtonName={campaignStatus === 'new' ? 'Hypelist' : 'Whitelist'}>
        {renderContent()}
      </Modal>

      <Toast type={investState === 'failed' ? 'error' : 'success'}>{toastMessage}</Toast>
    </>
  )

  function renderContent() {
    let content = <Fragment />

    switch (view) {
      case 'initial': {
        content = <InvestModalInitialView onInvestButtonClick={handleChangeView} inputProps={{ value, onChange: handleChangeValue }} />
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

        const campaignContract = new CampaignClient(
          {
            sender: { signer, addr: state.activeAccount?.address } as TransactionSignerAccount,
            resolveBy: 'id',
            id: campaignId!,
          },
          algod.client,
        )

        const suggestedParams = await algod.client.getTransactionParams().do()
        const appClient = await campaignContract.appClient.getAppReference()
        const buyAmount = value * Math.pow(10, 6)
        const buyXferTxn = makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: state.activeAccount.address,
          to: appClient.appAddress,
          amount: buyAmount,
          suggestedParams: suggestedParams,
          assetIndex: USDC_ASSET.id, // TODO: Use mainnet usdc asset
        })

        if (!state.userData?.usdc_balance && state.userData?.usdc_balance && state.userData.usdc_balance < value) {
          throw new Error(`You don't have enough balance to invest ${value} USDC`)
        }

        await campaignContract.buy(
          { buyAsaXfer: buyXferTxn, buyAsa: USDC_ASSET.id, buyAmount: buyAmount },
          {
            sender: { signer, addr: state.activeAccount?.address } as TransactionSignerAccount,
            boxes: [
              {
                appIndex: 0,
                name: new Uint8Array(
                  Buffer.from(`${Buffer.from('p').toString('hex')}${algosdk.encodeAddress(Buffer.from(state.activeAccount.address))}`),
                ),
              },
            ],
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
