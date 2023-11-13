/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import Button from '../common/button/Button'
import { AppCallTransactionResultOfType } from '@algorandfoundation/algokit-utils/types/app'
import { AlgohubClient } from '../../contracts/AlgohubClient'

/* Example usage
<AlgohubGetAllCampaignApps
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call getAllCampaignApps"
  typedClient={typedClient}
/>
*/
type Props = {
  buttonClass?: string
  buttonLoadingNode?: ReactNode
  children: ReactNode
  typedClient: AlgohubClient
  onSuccess?: (response: AppCallTransactionResultOfType<bigint[]>) => void
}

const AlgohubGetAllCampaignApps = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling getAllCampaignApps`)
    const response = await props.typedClient.getAllCampaignApps({}, { sender })
    setLoading(false)

    if (props.onSuccess) {
      props.onSuccess(response)
    }
  }

  return (
    <Button customClassName={props.buttonClass} onClick={callMethod} shouldDisplaySpinner={loading}>
      {props.children}
    </Button>
  )
}

export default AlgohubGetAllCampaignApps
