/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Algohub, AlgohubClient } from '../contracts/DaoClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<AlgohubGetVotePower
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call getVotePower"
  typedClient={typedClient}
  account={account}
  votersAsa={votersAsa}
/>
*/
type AlgohubGetVotePowerArgs = Dao['methods']['getVotePower(account,asset)uint64']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: AlgohubClient
  account: AlgohubGetVotePowerArgs['account']
  votersAsa: AlgohubGetVotePowerArgs['votersAsa']
}

const AlgohubGetVotePower = (props: Props) => {
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

export default AlgohubGetVotePower