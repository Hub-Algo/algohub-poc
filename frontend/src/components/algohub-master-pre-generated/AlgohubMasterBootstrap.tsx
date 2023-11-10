/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { AlgohubMaster, AlgohubMasterClient } from '../../contracts/AlgohubMaster'

/* Example usage
<AlgohubMasterBootstrap
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call bootstrap"
  typedClient={typedClient}
  voteAsaTotal={voteAsaTotal}
/>
*/
type AlgohubMasterBootstrapArgs = AlgohubMaster['methods']['bootstrap(uint64)uint64']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: AlgohubMasterClient
  voteAsaTotal: AlgohubMasterBootstrapArgs['voteAsaTotal']
}

const AlgohubMasterBootstrap = (props: Props) => {
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

export default AlgohubMasterBootstrap
