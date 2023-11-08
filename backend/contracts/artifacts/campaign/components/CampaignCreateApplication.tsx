/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { CampaignClient } from '../../contracts/CampaignClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<CampaignCreateApplication
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call createApplication"
  typedClient={typedClient}
  votersAsa={votersAsa}
  idoAsa={idoAsa}
  buyAsa={buyAsa}
  price={price}
  maxBuyCap={maxBuyCap}
  softCap={softCap}
  hardCap={hardCap}
  startTime={startTime}
  endTime={endTime}
  vestingSchedule={vestingSchedule}
  metadataUrl={metadataUrl}
/>
*/
type CampaignCreateApplicationArgs = Dao['methods']['createApplication(asset,asset,asset,uint64,uint64,uint64,uint64,uint64,uint64,uint64,string)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: CampaignClient
  votersAsa: CampaignCreateApplicationArgs['votersAsa']
  idoAsa: CampaignCreateApplicationArgs['idoAsa']
  buyAsa: CampaignCreateApplicationArgs['buyAsa']
  price: CampaignCreateApplicationArgs['price']
  maxBuyCap: CampaignCreateApplicationArgs['maxBuyCap']
  softCap: CampaignCreateApplicationArgs['softCap']
  hardCap: CampaignCreateApplicationArgs['hardCap']
  startTime: CampaignCreateApplicationArgs['startTime']
  endTime: CampaignCreateApplicationArgs['endTime']
  vestingSchedule: CampaignCreateApplicationArgs['vestingSchedule']
  metadataUrl: CampaignCreateApplicationArgs['metadataUrl']
}

const CampaignCreateApplication = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling createApplication`)
    await props.typedClient.create.createApplication(
      {
        votersAsa: props.votersAsa,
        idoAsa: props.idoAsa,
        buyAsa: props.buyAsa,
        price: props.price,
        maxBuyCap: props.maxBuyCap,
        softCap: props.softCap,
        hardCap: props.hardCap,
        startTime: props.startTime,
        endTime: props.endTime,
        vestingSchedule: props.vestingSchedule,
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

export default CampaignCreateApplication
