/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Campaign, CampaignClient } from '../contracts/DaoClient'
import { useWallet } from '@txnlab/use-wallet'

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
type CampaignDepositIdoAsaArgs = Dao['methods']['depositIdoAsa(axfer,asset)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: CampaignClient
  idoXfer: CampaignDepositIdoAsaArgs['idoXfer']
  idoAsa: CampaignDepositIdoAsaArgs['idoAsa']
}

const CampaignDepositIdoAsa = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling depositIdoAsa`)
    await props.typedClient.depositIdoAsa(
      {
        idoXfer: props.idoXfer,
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

export default CampaignDepositIdoAsa