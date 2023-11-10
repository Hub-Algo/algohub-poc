/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { AlgohubMasterClient } from '../../contracts/AlgohubMaster'

/* Example usage
<AlgohubMasterGetVotersDetails
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call getVotersDetails"
  typedClient={typedClient}
/>
*/
type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: AlgohubMasterClient
}

const AlgohubMasterGetVotersDetails = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling getVotersDetails`)
    await props.typedClient.getVotersDetails({}, { sender })
    setLoading(false)
  }

  return (
    <button className={props.buttonClass} onClick={callMethod}>
      {loading ? props.buttonLoadingNode || props.buttonNode : props.buttonNode}
    </button>
  )
}

export default AlgohubMasterGetVotersDetails
