/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { AlgohubCampaignFactory, AlgohubCampaignFactoryClient } from '../contracts/DaoClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<AlgohubCampaignFactoryGetAllCampaignApps
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call getAllCampaignApps"
  typedClient={typedClient}
/>
*/
type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: AlgohubCampaignFactoryClient
}

const AlgohubCampaignFactoryGetAllCampaignApps = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling getAllCampaignApps`)
    await props.typedClient.getAllCampaignApps({}, { sender })
    setLoading(false)
  }

  return (
    <button className={props.buttonClass} onClick={callMethod}>
      {loading ? props.buttonLoadingNode || props.buttonNode : props.buttonNode}
    </button>
  )
}

export default AlgohubCampaignFactoryGetAllCampaignApps
