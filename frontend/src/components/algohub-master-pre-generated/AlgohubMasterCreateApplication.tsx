/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { AlgohubMaster, AlgohubMasterClient } from '../../contracts/AlgohubMaster'

/* Example usage
<AlgohubMasterCreateApplication
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call createApplication"
  typedClient={typedClient}
  algoToVoteRatio={algoToVoteRatio}
  vipVoteWeight={vipVoteWeight}
  votingPeriod={votingPeriod}
/>
*/
type AlgohubMasterCreateApplicationArgs = AlgohubMaster['methods']['createApplication(uint64,uint64,uint64)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: AlgohubMasterClient
  algoToVoteRatio: AlgohubMasterCreateApplicationArgs['algoToVoteRatio']
  vipVoteWeight: AlgohubMasterCreateApplicationArgs['vipVoteWeight']
  votingPeriod: AlgohubMasterCreateApplicationArgs['votingPeriod']
}

const AlgohubMasterCreateApplication = (props: Props) => {
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

export default AlgohubMasterCreateApplication
