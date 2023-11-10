/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { AlgohubMaster, AlgohubMasterClient } from '../../contracts/AlgohubMaster'

/* Example usage
<AlgohubMasterRegisterAsVoter
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call registerAsVoter"
  typedClient={typedClient}
  votersAsa={votersAsa}
/>
*/
type AlgohubMasterRegisterAsVoterArgs = AlgohubMaster['methods']['registerAsVoter(asset)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: AlgohubMasterClient
  votersAsa: AlgohubMasterRegisterAsVoterArgs['votersAsa']
}

const AlgohubMasterRegisterAsVoter = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling registerAsVoter`)
    await props.typedClient.registerAsVoter(
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

export default AlgohubMasterRegisterAsVoter
