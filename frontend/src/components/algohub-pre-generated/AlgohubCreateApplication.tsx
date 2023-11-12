/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { Algohub, AlgohubClient } from '../../contracts/AlgohubClient'

/* Example usage
<AlgohubCreateApplication
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call createApplication"
  typedClient={typedClient}
  algoToVoteRatio={algoToVoteRatio}
  vipVoteWeight={vipVoteWeight}
  votingPeriod={votingPeriod}
/>
*/
type AlgohubCreateApplicationArgs = Algohub['methods']['createApplication(uint64,uint64,uint64)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: AlgohubClient
  algoToVoteRatio: AlgohubCreateApplicationArgs['algoToVoteRatio']
  vipVoteWeight: AlgohubCreateApplicationArgs['vipVoteWeight']
  votingPeriod: AlgohubCreateApplicationArgs['votingPeriod']
}

const AlgohubCreateApplication = (props: Props) => {
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
        votingPeriod: props.votingPeriod,
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

export default AlgohubCreateApplication
