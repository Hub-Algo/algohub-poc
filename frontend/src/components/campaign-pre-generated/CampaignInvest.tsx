/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { Campaign, CampaignClient } from '../../contracts/CampaignClient'

/* Example usage
<CampaignInvest
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call invest"
  typedClient={typedClient}
  investmentAsaXfer={investmentAsaXfer}
  investmentAsa={investmentAsa}
  investmentAmount={investmentAmount}
/>
*/
type CampaignInvestArgs = Campaign['methods']['invest(axfer,asset,uint64)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: CampaignClient
  investmentAsaXfer: CampaignInvestArgs['investmentAsaXfer']
  investmentAsa: CampaignInvestArgs['investmentAsa']
  investmentAmount: CampaignInvestArgs['investmentAmount']
}

const CampaignInvest = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling invest`)
    await props.typedClient.invest(
      {
        investmentAsaXfer: props.investmentAsaXfer,
        investmentAsa: props.investmentAsa,
        investmentAmount: props.investmentAmount,
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

export default CampaignInvest
