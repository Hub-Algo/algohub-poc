/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Campaign, CampaignClient } from '../contracts/DaoClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<CampaignCreateCampaign
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call createCampaign"
  typedClient={typedClient}
  price={price}
  maxBuyCap={maxBuyCap}
  softCap={softCap}
  hardCap={hardCap}
  startTime={startTime}
  endTime={endTime}
  metadataUrl={metadataUrl}
/>
*/
type CampaignCreateCampaignArgs = Dao['methods']['createCampaign(uint64,uint64,uint64,uint64,uint64,uint64,string)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: CampaignClient
  price: CampaignCreateCampaignArgs['price']
  maxBuyCap: CampaignCreateCampaignArgs['maxBuyCap']
  softCap: CampaignCreateCampaignArgs['softCap']
  hardCap: CampaignCreateCampaignArgs['hardCap']
  startTime: CampaignCreateCampaignArgs['startTime']
  endTime: CampaignCreateCampaignArgs['endTime']
  metadataUrl: CampaignCreateCampaignArgs['metadataUrl']
}

const CampaignCreateCampaign = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling createCampaign`)
    await props.typedClient.createCampaign(
      {
        price: props.price,
        maxBuyCap: props.maxBuyCap,
        softCap: props.softCap,
        hardCap: props.hardCap,
        startTime: props.startTime,
        endTime: props.endTime,
        metadataUrl: props.metadataUrl,
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

export default CampaignCreateCampaign