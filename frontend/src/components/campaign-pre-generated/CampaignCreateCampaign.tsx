/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { Campaign, CampaignClient } from '../../contracts/CampaignClient'
import Button from '../common/button/Button'
import { microAlgos } from '@algorandfoundation/algokit-utils'

/* Example usage
<CampaignCreateCampaign
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call createCampaign"
  typedClient={typedClient}
  adminAccount={adminAccount}
  votersAsa={votersAsa}
  idoAsa={idoAsa}
  buyAsa={buyAsa}
  price={price}
  maxBuyCap={maxBuyCap}
  softCap={softCap}
  hardCap={hardCap}
  votingPeriod={votingPeriod}
  duration={duration}
  metadataUrl={metadataUrl}
/>
*/
type CampaignCreateCampaignArgs =
  Campaign['methods']['createCampaign(account,asset,asset,asset,uint64,uint64,uint64,uint64,uint64,uint64,string)void']['argsObj']

type Props = {
  children: ReactNode
  typedClient: CampaignClient
  adminAccount: CampaignCreateCampaignArgs['adminAccount']
  votersAsa: CampaignCreateCampaignArgs['votersAsa']
  idoAsa: CampaignCreateCampaignArgs['idoAsa']
  buyAsa: CampaignCreateCampaignArgs['buyAsa']
  price: CampaignCreateCampaignArgs['price']
  maxBuyCap: CampaignCreateCampaignArgs['maxBuyCap']
  softCap: CampaignCreateCampaignArgs['softCap']
  hardCap: CampaignCreateCampaignArgs['hardCap']
  votingPeriod: CampaignCreateCampaignArgs['votingPeriod']
  duration: CampaignCreateCampaignArgs['duration']
  metadataUrl: CampaignCreateCampaignArgs['metadataUrl']
  customClassName?: string
  onSuccess?: VoidFunction
}

const CampaignCreateCampaign = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling createCampaign`)
    await props.typedClient.createCampaign(
      {
        adminAccount: props.adminAccount,
        votersAsa: props.votersAsa,
        idoAsa: props.idoAsa,
        buyAsa: props.buyAsa,
        price: props.price,
        maxBuyCap: props.maxBuyCap,
        softCap: props.softCap,
        hardCap: props.hardCap,
        votingPeriod: props.votingPeriod,
        duration: props.duration,
        metadataUrl: props.metadataUrl,
      },
      {
        sender,
        sendParams: {
          fee: microAlgos(8_000),
        },
      },
    )
    setLoading(false)

    if (props.onSuccess) {
      props.onSuccess()
    }
  }

  return (
    <Button customClassName={props.customClassName} onClick={callMethod} shouldDisplaySpinner={loading}>
      {props.children}
    </Button>
  )
}

export default CampaignCreateCampaign
