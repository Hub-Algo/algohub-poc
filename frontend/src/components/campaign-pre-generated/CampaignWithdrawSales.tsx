/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { Campaign, CampaignClient } from '../../contracts/CampaignClient'
import Button from '../common/button/Button'
import Toast from '../common/toast/Toast'
import { microAlgos } from '@algorandfoundation/algokit-utils'

/* Example usage
<CampaignWithdrawSales
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call withdrawSales"
  typedClient={typedClient}
  investmentAsa={investmentAsa}
/>
*/
type CampaignWithdrawSalesArgs = Campaign['methods']['withdrawSales(asset)void']['argsObj']

type Props = {
  buttonClass?: string
  buttonLoadingNode?: ReactNode
  children: ReactNode
  typedClient: CampaignClient
  investmentAsa: CampaignWithdrawSalesArgs['investmentAsa']
  isDisabled?: boolean
}

const CampaignWithdrawSales = (props: Props) => {
  const [toastMessage, setToastMessage] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling withdrawSales`)
    await props.typedClient
      .withdrawSales(
        {
          investmentAsa: props.investmentAsa,
        },
        {
          sender,
          sendParams: {
            fee: microAlgos(2_000),
          },
        },
      )
      .catch((e) => {
        setLoading(false)
        setToastMessage(e.message ?? 'Something went wrong while claiming sales')

        return Promise.reject(e)
      })
      .then(() => {
        setToastMessage('Successfully claimed USDC sales!')
        setLoading(false)
      })
  }

  return (
    <>
      <Button
        customClassName={props.buttonClass}
        onClick={callMethod}
        isDisabled={props.isDisabled}
        shouldDisplaySpinner={loading}
        size="md"
      >
        {props.children}
      </Button>

      <Toast>{toastMessage}</Toast>
    </>
  )
}

export default CampaignWithdrawSales
