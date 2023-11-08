/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { CampaignClient } from '../../contracts/CampaignClient'

/* Example usage
<CampaignVote
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call vote"
  typedClient={typedClient}
  inFavor={inFavor}
  votersAsa={votersAsa}
/>
*/
type CampaignVoteArgs = Dao['methods']['vote(bool,asset)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: CampaignClient
  inFavor: CampaignVoteArgs['inFavor']
  votersAsa: CampaignVoteArgs['votersAsa']
}

const CampaignVote = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling vote`)
    await props.typedClient.vote(
      {
        inFavor: props.inFavor,
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

export default CampaignVote
