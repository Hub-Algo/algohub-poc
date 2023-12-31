/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Campaign, CampaignClient } from '../contracts/DaoClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<CampaignWithdrawSales
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call withdrawSales"
  typedClient={typedClient}
  investmentAsa={investmentAsa}
/>
*/
type CampaignWithdrawSalesArgs = Dao['methods']['withdrawSales(asset)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: CampaignClient
  investmentAsa: CampaignWithdrawSalesArgs['investmentAsa']
}

const CampaignWithdrawSales = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling withdrawSales`)
    await props.typedClient.withdrawSales(
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

export default CampaignWithdrawSales