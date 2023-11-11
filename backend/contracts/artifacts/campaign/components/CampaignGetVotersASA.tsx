/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Campaign, CampaignClient } from '../contracts/DaoClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<CampaignGetVotersAsa
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call getVotersAsa"
  typedClient={typedClient}
/>
*/
type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: CampaignClient
}

const CampaignGetVotersAsa = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling getVotersAsa`)
    await props.typedClient.getVotersAsa(
      {},
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

export default CampaignGetVotersAsa