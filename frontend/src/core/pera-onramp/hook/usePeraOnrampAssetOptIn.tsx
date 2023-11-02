import { PeraOnramp } from '@perawallet/onramp'
import { useCallback, useState } from 'react'

import { useWallet } from '@txnlab/use-wallet'
import algod from '../../algosdk/AlgodManager'
import { generateOptIntoAssetTxns } from '../../util/transaction/transactionUtils'

function usePeraOnrampAssetOptin() {
  const { signTransactions, sendTransactions } = useWallet()
  const [toastMessage, setToastMessage] = useState<string>()

  const executeAssetOptin = useCallback(
    async ({ accountAddress, assetID, peraOnramp }: { accountAddress: string; assetID: string; peraOnramp: PeraOnramp }) => {
      try {
        const optInTxns = await generateOptIntoAssetTxns({
          client: algod.client,
          assetID: Number(assetID),
          initiatorAddr: accountAddress,
        })

        peraOnramp.close()

        if (optInTxns) {
          setToastMessage(`Please sign the transaction to opt-in to the ${assetID}`)

          const signedTxns = await signTransactions(optInTxns)

          setToastMessage('Sending the transaction...')

          await sendTransactions(signedTxns, 4)

          setToastMessage(`Opt-in to ${assetID} has been successful!`)

          peraOnramp.addFunds({ accountAddress })
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setToastMessage(`Opt-in to ${assetID} has failed: ${error?.message ?? 'Reason unknown'}`)
      }
    },
    [sendTransactions, signTransactions],
  )

  return { executeAssetOptin, toastMessage }
}

export default usePeraOnrampAssetOptin
