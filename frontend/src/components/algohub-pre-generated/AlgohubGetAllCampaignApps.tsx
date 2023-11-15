/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { useState } from 'react'
import { AlgohubClient } from '../../contracts/AlgohubClient'

/* Example usage
<AlgohubGetAllCampaignApps
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call getAllCampaignApps"
  typedClient={typedClient}
/>
*/
type Props = {
  buttonClass?: string
  typedClient: AlgohubClient
}

const AlgohubGetAllCampaignApps = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling getAllCampaignApps`)
    const allCampaigns = await props.typedClient.getAllCampaignApps({}, { sender })
    console.log(allCampaigns)
    setLoading(false)
  }

  return (
    <button className={props.buttonClass} onClick={callMethod}>
      Get All Campaigns
    </button>
  )
}

export default AlgohubGetAllCampaignApps
