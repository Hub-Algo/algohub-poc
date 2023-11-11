/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { Campaign, CampaignClient } from '../../contracts/CampaignClient'

/* Example usage
<CampaignBuy
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call buy"
  typedClient={typedClient}
  buyAsaXfer={buyAsaXfer}
  buyAsa={buyAsa}
  buyAmount={buyAmount}
/>
*/
type CampaignBuyArgs = Campaign['methods']['buy(axfer,asset,uint64)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: CampaignClient
  buyAsaXfer: CampaignBuyArgs['buyAsaXfer']
  buyAsa: CampaignBuyArgs['buyAsa']
  buyAmount: CampaignBuyArgs['buyAmount']
}

const CampaignBuy = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling buy`)
    await props.typedClient.buy(
      {
        buyAsaXfer: props.buyAsaXfer,
        buyAsa: props.buyAsa,
        buyAmount: props.buyAmount,
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

export default CampaignBuy
