/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { Campaign, CampaignClient } from '../../contracts/CampaignClient'
import Button from '../common/button/Button'

/* Example usage
<CampaignDepositIdoAsa
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call depositIdoAsa"
  typedClient={typedClient}
  idoXfer={idoXfer}
  idoAsa={idoAsa}
/>
*/
type CampaignDepositIdoAsaArgs = Campaign['methods']['depositIdoAsa(axfer,asset)void']['argsObj']

type Props = {
  children: ReactNode
  typedClient: CampaignClient
  idoXfer?: CampaignDepositIdoAsaArgs['idoXfer']
  idoAsa?: CampaignDepositIdoAsaArgs['idoAsa']
  isDisabled?: boolean
  buttonClass?: string
}

const CampaignDepositIdoAsa = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }
  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling depositIdoAsa`)
    if (props.idoXfer && props.idoAsa) {
      await props.typedClient
        .depositIdoAsa(
          {
            idoXfer: props.idoXfer,
            idoAsa: props.idoAsa,
          },
          { sender },
        )
        .then(() => setLoading(false))
        .catch((error) => {
          setLoading(false)

          return Promise.reject(new Error(error))
        })
    }
  }

  return (
    <Button customClassName={props.buttonClass} onClick={callMethod} shouldDisplaySpinner={loading}>
      {props.children}
    </Button>
  )
}

export default CampaignDepositIdoAsa
