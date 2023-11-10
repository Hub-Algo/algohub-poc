/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { AlgohubMaster, AlgohubMasterClient } from '../../contracts/AlgohubMaster'

/* Example usage
<AlgohubMasterCreateCampaign
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call createCampaign"
  typedClient={typedClient}
  votersAsa={votersAsa}
  price={price}
  maxBuyCap={maxBuyCap}
  softCap={softCap}
  hardCap={hardCap}
  startTime={startTime}
  endTime={endTime}
  metadataUrl={metadataUrl}
/>
*/
type AlgohubMasterCreateCampaignArgs =
  AlgohubMaster['methods']['createCampaign(asset,uint64,uint64,uint64,uint64,uint64,uint64,string)uint64']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: AlgohubMasterClient
  votersAsa: AlgohubMasterCreateCampaignArgs['votersAsa']
  price: AlgohubMasterCreateCampaignArgs['price']
  maxBuyCap: AlgohubMasterCreateCampaignArgs['maxBuyCap']
  softCap: AlgohubMasterCreateCampaignArgs['softCap']
  hardCap: AlgohubMasterCreateCampaignArgs['hardCap']
  startTime: AlgohubMasterCreateCampaignArgs['startTime']
  endTime: AlgohubMasterCreateCampaignArgs['endTime']
  metadataUrl: AlgohubMasterCreateCampaignArgs['metadataUrl']
}

const AlgohubMasterCreateCampaign = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling createCampaign`)
    await props.typedClient.createCampaign(
      {
        votersAsa: props.votersAsa,
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

export default AlgohubMasterCreateCampaign
