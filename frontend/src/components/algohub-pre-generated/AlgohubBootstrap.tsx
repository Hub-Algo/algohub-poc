/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { Algohub, AlgohubClient } from '../../contracts/AlgohubClient'

/* Example usage
<AlgohubBootstrap
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call bootstrap"
  typedClient={typedClient}
  voteAsaTotal={voteAsaTotal}
/>
*/
type AlgohubBootstrapArgs = Algohub['methods']['bootstrap(uint64)uint64']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: AlgohubClient
  voteAsaTotal: AlgohubBootstrapArgs['voteAsaTotal']
}

const AlgohubBootstrap = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling bootstrap`)
    await props.typedClient.bootstrap(
      {
        voteAsaTotal: props.voteAsaTotal,
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

export default AlgohubBootstrap
