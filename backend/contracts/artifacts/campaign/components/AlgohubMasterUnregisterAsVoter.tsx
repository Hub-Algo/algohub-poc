/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { AlgohubMaster, AlgohubMasterClient } from '../contracts/DaoClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<AlgohubMasterUnregisterAsVoter
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call unregisterAsVoter"
  typedClient={typedClient}
  votersAsa={votersAsa}
/>
*/
type AlgohubMasterUnregisterAsVoterArgs = Dao['methods']['unregisterAsVoter(asset)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: AlgohubMasterClient
  votersAsa: AlgohubMasterUnregisterAsVoterArgs['votersAsa']
}

const AlgohubMasterUnregisterAsVoter = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling unregisterAsVoter`)
    await props.typedClient.unregisterAsVoter(
      {
        votersAsa: props.votersAsa,
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

export default AlgohubMasterUnregisterAsVoter