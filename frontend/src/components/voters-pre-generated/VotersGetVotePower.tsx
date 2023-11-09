/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { Voters, VotersClient } from '../../contracts/VotersClient'

/* Example usage
<VotersGetVotePower
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call getVotePower"
  typedClient={typedClient}
  account={account}
  votersAsa={votersAsa}
/>
*/
type VotersGetVotePowerArgs = Voters['methods']['getVotePower(address,asset)uint64']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: VotersClient
  account: VotersGetVotePowerArgs['account']
  votersAsa: VotersGetVotePowerArgs['votersAsa']
}

const VotersGetVotePower = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling getVotePower`)
    await props.typedClient.getVotePower(
      {
        account: props.account,
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

export default VotersGetVotePower
