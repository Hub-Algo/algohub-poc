/* eslint-disable no-console */
import { microAlgos } from '@algorandfoundation/algokit-utils'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { AppDetails } from '@algorandfoundation/algokit-utils/types/app-client'
import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { ReactNode, useState } from 'react'
import { Campaign, CampaignClient } from '../../contracts/CampaignClient'
import algod from '../../core/algosdk/AlgodManager'
import Button from '../common/button/Button'
import Toast from '../common/toast/Toast'

/* Example usage
<CampaignClaim
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call claim"
  typedClient={typedClient}
  idoAsa={idoAsa}
/>
*/
type CampaignClaimArgs = Campaign['methods']['claim(asset)void']['argsObj']

type Props = {
  buttonClass?: string
  children: ReactNode
  campaignId: number | bigint
  idoAsa: CampaignClaimArgs['idoAsa']
  isDisabled?: boolean
}

const CampaignClaim = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }
  const [toastMessage, setToaastMessage] = useState('')

  const callMethod = async () => {
    if (activeAddress) {
      const appDetails = {
        resolveBy: 'id',
        id: props.campaignId,
        sender: { signer, addr: activeAddress } as TransactionSignerAccount,
        creatorAddress: activeAddress,
        findExistingUsing: algod.indexer,
      } as AppDetails

      const campaignClient = new CampaignClient(appDetails, algod.client)

      setLoading(true)
      console.log(`Calling claim`)
      await campaignClient
        .claim(
          {
            idoAsa: props.idoAsa,
          },
          {
            sender,
            sendParams: {
              fee: microAlgos(3_000),
            },
            boxes: [
              new Uint8Array(Buffer.concat([Buffer.from('c'), algosdk.decodeAddress(activeAddress).publicKey])),
              new Uint8Array(Buffer.concat([Buffer.from('i'), algosdk.decodeAddress(activeAddress).publicKey])),
            ],
          },
        )
        .catch((e) => {
          setLoading(false)

          setToaastMessage(e.message ?? `Something went wrong while claiming ${props.idoAsa} asset`)
          return Promise.reject(new Error(e))
        })
        .then((res) => {
          setLoading(false)

          setToaastMessage(res.return ?? `Successfully claimed ${props.idoAsa} asset`)
        })
    }
  }

  return (
    <>
      <Button
        customClassName={props.buttonClass}
        onClick={callMethod}
        shouldDisplaySpinner={loading}
        isDisabled={props.isDisabled}
        size={'md'}
      >
        {props.children}
      </Button>

      <Toast>{toastMessage}</Toast>
    </>
  )
}

export default CampaignClaim
