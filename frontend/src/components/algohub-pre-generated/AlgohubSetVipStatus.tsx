/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { Algohub, AlgohubClient } from '../../contracts/AlgohubClient'

/* Example usage
<AlgohubSetVipStatus
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call setVipStatus"
  typedClient={typedClient}
  account={account}
  isVip={isVip}
  votersAsa={votersAsa}
/>
*/
type AlgohubSetVipStatusArgs = Algohub['methods']['setVipStatus(account,bool,asset)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: AlgohubClient
  account: AlgohubSetVipStatusArgs['account']
  isVip: AlgohubSetVipStatusArgs['isVip']
  votersAsa: AlgohubSetVipStatusArgs['votersAsa']
}

const AlgohubSetVipStatus = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling setVipStatus`)
    await props.typedClient.setVipStatus(
      {
        account: props.account,
        isVip: props.isVip,
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

export default AlgohubSetVipStatus
