/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Algohub, AlgohubClient } from '../contracts/DaoClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<AlgohubGetVoteAsa
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call getVoteAsa"
  typedClient={typedClient}
  voteAsa={voteAsa}
/>
*/
type AlgohubGetVoteAsaArgs = Dao['methods']['getVoteAsa(asset)uint64']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: AlgohubClient
  voteAsa: AlgohubGetVoteAsaArgs['voteAsa']
}

const AlgohubGetVoteAsa = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling getVoteAsa`)
    await props.typedClient.getVoteAsa(
      {
        voteAsa: props.voteAsa,
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

export default AlgohubGetVoteAsa