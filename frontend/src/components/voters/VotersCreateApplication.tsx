/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Voters, VotersClient } from '../contracts/DaoClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<VotersCreateApplication
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call createApplication"
  typedClient={typedClient}
  algoToVoteRatio={algoToVoteRatio}
  vipVoteWeight={vipVoteWeight}
/>
*/
type VotersCreateApplicationArgs = Dao['methods']['createApplication(uint64,uint64)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: VotersClient
  algoToVoteRatio: VotersCreateApplicationArgs['algoToVoteRatio']
  vipVoteWeight: VotersCreateApplicationArgs['vipVoteWeight']
}

const VotersCreateApplication = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling createApplication`)
    await props.typedClient.create.createApplication(
      {
        algoToVoteRatio: props.algoToVoteRatio,
        vipVoteWeight: props.vipVoteWeight,
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

export default VotersCreateApplication
