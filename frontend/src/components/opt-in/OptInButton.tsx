import { useWallet } from '@txnlab/use-wallet'
import algod from '../../core/algosdk/AlgodManager'
import { generateOptIntoAssetTxn } from '../../core/util/asset/assetUtils'
import Button from '../common/button/Button'
import algosdk from 'algosdk'
import Toast from '../common/toast/Toast'
import { useState } from 'react'
import useAppContext from '../../core/util/useAppContext'

interface OptInButtonProps {
  assetId: number
  activeAddress: string
}

function OptInButton({ assetId, activeAddress }: OptInButtonProps) {
  const { fetchAndAppendUserData } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [toastMessage, setToaastMessage] = useState<string>()
  const { signTransactions, sendTransactions } = useWallet()

  return (
    <>
      <Button onClick={handleOptIn} shouldDisplaySpinner={loading} size={'md'} buttonColor={'secondary'}>
        {'opt in to asset'}
      </Button>

      <Toast>{toastMessage}</Toast>
    </>
  )

  async function handleOptIn() {
    try {
      setLoading(true)

      const optIntoTINYAssetTxn = await generateOptIntoAssetTxn({
        client: algod.client,
        initiatorAddr: activeAddress,
        assetID: assetId,
      })

      const txn = algosdk.encodeUnsignedTransaction(optIntoTINYAssetTxn)

      const signedTxns = await signTransactions([txn])
      const waitRoundsToConfirm = 4
      const { txId } = await sendTransactions(signedTxns, waitRoundsToConfirm)

      await fetchAndAppendUserData(activeAddress)

      setLoading(false)
      setToaastMessage(`Successfully opted-in to ${assetId}\n Txn ID: ${txId}`)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setLoading(false)
      setToaastMessage(e.message ?? `Something went wrong while opting in to ${assetId}`)

      return Promise.reject(e)
    }
  }
}

export default OptInButton
