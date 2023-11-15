/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { Campaign, CampaignClient } from '../../contracts/CampaignClient'
import Button from '../common/button/Button'

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
  buttonClass: string
  buttonNode: ReactNode
  typedClient: CampaignClient
  investmentAsa: CampaignWithdrawInvestmentArgs['investmentAsa']
  isDisabled?: boolean
}

const CampaignWithdrawInvestment = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling withdrawInvestment`)
    await props.typedClient.withdrawInvestment(
      {
        investmentAsa: props.investmentAsa,
      },
      { sender },
    )
    setLoading(false)
  }

  return (
    <Button customClassName={props.buttonClass} onClick={callMethod} shouldDisplaySpinner={loading} isDisabled={props.isDisabled}>
      {props.buttonNode}
    </Button>
  )
}

export default CampaignWithdrawInvestment
