/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { Campaign, CampaignClient } from '../../contracts/CampaignClient'

/* Example usage
<CampaignWithdrawIdoAsa
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call withdrawIdoAsa"
  typedClient={typedClient}
  idoAsa={idoAsa}
/>
*/
type CampaignWithdrawIdoAsaArgs = Campaign['methods']['withdrawIdoAsa(asset)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: CampaignClient
  idoAsa: CampaignWithdrawIdoAsaArgs['idoAsa']
}

const CampaignWithdrawIdoAsa = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling withdrawIdoAsa`)
    await props.typedClient.withdrawIdoAsa(
      {
        idoAsa: props.idoAsa,
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

export default CampaignWithdrawIdoAsa
