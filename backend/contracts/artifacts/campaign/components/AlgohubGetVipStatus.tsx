/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Algohub, AlgohubClient } from '../contracts/DaoClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<AlgohubGetVipStatus
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call getVipStatus"
  typedClient={typedClient}
  account={account}
/>
*/
type AlgohubGetVipStatusArgs = Dao['methods']['getVipStatus(account)bool']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: AlgohubClient
  account: AlgohubGetVipStatusArgs['account']
}

const AlgohubGetVipStatus = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling getVipStatus`)
    await props.typedClient.getVipStatus(
      {
        account: props.account,
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

export default AlgohubGetVipStatus