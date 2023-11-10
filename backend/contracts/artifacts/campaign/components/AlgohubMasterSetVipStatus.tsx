/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { AlgohubMaster, AlgohubMasterClient } from '../contracts/DaoClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<AlgohubMasterSetVipStatus
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call setVipStatus"
  typedClient={typedClient}
  account={account}
  isVip={isVip}
  votersAsa={votersAsa}
/>
*/
type AlgohubMasterSetVipStatusArgs = Dao['methods']['setVipStatus(account,bool,asset)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: AlgohubMasterClient
  account: AlgohubMasterSetVipStatusArgs['account']
  isVip: AlgohubMasterSetVipStatusArgs['isVip']
  votersAsa: AlgohubMasterSetVipStatusArgs['votersAsa']
}

const AlgohubMasterSetVipStatus = (props: Props) => {
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

export default AlgohubMasterSetVipStatus