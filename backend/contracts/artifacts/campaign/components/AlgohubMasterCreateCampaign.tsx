/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { AlgohubMaster, AlgohubMasterClient } from '../contracts/DaoClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<AlgohubMasterCreateCampaign
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call createCampaign"
  typedClient={typedClient}
  votersAsa={votersAsa}
  idoAsa={idoAsa}
  buyAsa={buyAsa}
  price={price}
  maxBuyCap={maxBuyCap}
  softCap={softCap}
  hardCap={hardCap}
  duration={duration}
  metadataUrl={metadataUrl}
/>
*/
type AlgohubMasterCreateCampaignArgs = Dao['methods']['createCampaign(asset,asset,asset,uint64,uint64,uint64,uint64,uint64,string)uint64']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: AlgohubMasterClient
  votersAsa: AlgohubMasterCreateCampaignArgs['votersAsa']
  idoAsa: AlgohubMasterCreateCampaignArgs['idoAsa']
  buyAsa: AlgohubMasterCreateCampaignArgs['buyAsa']
  price: AlgohubMasterCreateCampaignArgs['price']
  maxBuyCap: AlgohubMasterCreateCampaignArgs['maxBuyCap']
  softCap: AlgohubMasterCreateCampaignArgs['softCap']
  hardCap: AlgohubMasterCreateCampaignArgs['hardCap']
  duration: AlgohubMasterCreateCampaignArgs['duration']
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
        idoAsa: props.idoAsa,
        buyAsa: props.buyAsa,
        price: props.price,
        maxBuyCap: props.maxBuyCap,
        softCap: props.softCap,
        hardCap: props.hardCap,
        duration: props.duration,
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