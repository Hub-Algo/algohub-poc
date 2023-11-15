/* eslint-disable no-console */
import { microAlgos } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { ReactNode, useState } from 'react'
import { Campaign, CampaignClient } from '../../contracts/CampaignClient'
import Button from '../common/button/Button'
import Toast from '../common/toast/Toast'

/* Example usage
<CampaignWithdrawInvestment
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call withdrawInvestment"
  typedClient={typedClient}
  investmentAsa={investmentAsa}
/>
*/
type CampaignWithdrawInvestmentArgs = Campaign['methods']['withdrawInvestment(asset)void']['argsObj']

type Props = {
  children: ReactNode
  typedClient: CampaignClient
  investmentAsa: CampaignWithdrawInvestmentArgs['investmentAsa']
  isDisabled?: boolean
  buttonClass?: string
}

const CampaignWithdrawInvestment = (props: Props) => {
  const [toastMessage, setToaastMessage] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    if (activeAddress) {
      setLoading(true)
      console.log(`Calling withdrawInvestment`)
      await props.typedClient
        .withdrawInvestment(
          {
            investmentAsa: props.investmentAsa,
          },
          {
            sender,
            sendParams: {
              fee: microAlgos(3_000),
            },
            boxes: [new Uint8Array(Buffer.concat([Buffer.from('i'), algosdk.decodeAddress(activeAddress).publicKey]))],
          },
        )
        .then(() => {
          setLoading(false)
          setToaastMessage('Successfully withdrown USDc investment')
        })
        .catch((e) => {
          setLoading(false)
          setToaastMessage(e.message ?? 'Something went wrong while withdrawing investment')
          return Promise.reject(e)
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
        size="md"
      >
        {props.children}
      </Button>

      <Toast>{toastMessage}</Toast>
    </>
  )
}

export default CampaignWithdrawInvestment
