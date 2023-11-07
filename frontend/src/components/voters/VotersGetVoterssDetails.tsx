/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Voters, VotersClient } from '../contracts/DaoClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<VotersGetVoterssDetails
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call getVoterssDetails"
  typedClient={typedClient}
/>
*/
type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: VotersClient
}

const VotersGetVoterssDetails = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling getVoterssDetails`)
    await props.typedClient.getVoterssDetails(
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

export default VotersGetVoterssDetails