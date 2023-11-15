/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Campaign, CampaignClient } from '../contracts/DaoClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<CampaignWithdrawInvestment
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call withdrawInvestment"
  typedClient={typedClient}
  investmentAsa={investmentAsa}
/>
*/
type CampaignWithdrawInvestmentArgs = Dao['methods']['withdrawInvestment(asset)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: CampaignClient
  investmentAsa: CampaignWithdrawInvestmentArgs['investmentAsa']
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
    <button className={props.buttonClass} onClick={callMethod}>
      {loading ? props.buttonLoadingNode || props.buttonNode : props.buttonNode}
    </button>
  )
}

export default CampaignWithdrawInvestment