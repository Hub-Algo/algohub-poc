/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { AlgohubMaster, AlgohubMasterClient } from '../contracts/DaoClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<AlgohubMasterGetVipStatus
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call getVipStatus"
  typedClient={typedClient}
  account={account}
/>
*/
type AlgohubMasterGetVipStatusArgs = Dao['methods']['getVipStatus(account)bool']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: AlgohubMasterClient
  account: AlgohubMasterGetVipStatusArgs['account']
}

const AlgohubMasterGetVipStatus = (props: Props) => {
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

export default AlgohubMasterGetVipStatus