/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { Voters, VotersClient } from '../../contracts/VotersClient'

/* Example usage
<VotersSetVIPStatus
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call setVIPStatus"
  typedClient={typedClient}
  account={account}
  isVIP={isVIP}
  votersAsa={votersAsa}
/>
*/
type VotersSetVIPStatusArgs = Voters['methods']['setVIPStatus(address,bool,asset)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: VotersClient
  account: VotersSetVIPStatusArgs['account']
  isVIP: VotersSetVIPStatusArgs['isVIP']
  votersAsa: VotersSetVIPStatusArgs['votersAsa']
}

const VotersSetVIPStatus = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling setVIPStatus`)
    await props.typedClient.setVipStatus(
      {
        account: props.account,
        isVIP: props.isVIP,
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

export default VotersSetVIPStatus
