/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { AlgohubMaster, AlgohubMasterClient } from '../../contracts/AlgohubMaster'
import Button from '../common/button/Button'

/* Example usage
<AlgohubMasterCreateCampaign
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call createCampaign"
  typedClient={typedClient}
  votersAsa={votersAsa}
  adminAccount={adminAccount}
  idoAsa={idoAsa}
  buyAsa={buyAsa}
  price={price}
  maxBuyCap={maxBuyCap}
  softCap={softCap}
  hardCap={hardCap}
  duration={duration}
  metadataUrl={metadataUrl}
/>
*/
type AlgohubMasterCreateCampaignArgs =
  AlgohubMaster['methods']['createCampaign(asset,account,asset,asset,uint64,uint64,uint64,uint64,uint64,string)uint64']['argsObj']

type Props = {
  buttonClass?: string
  buttonLoadingNode?: ReactNode
  children: ReactNode
  typedClient: AlgohubMasterClient
  votersAsa: AlgohubMasterCreateCampaignArgs['votersAsa']
  adminAccount: AlgohubMasterCreateCampaignArgs['adminAccount']
  idoAsa: AlgohubMasterCreateCampaignArgs['idoAsa']
  buyAsa: AlgohubMasterCreateCampaignArgs['buyAsa']
  price: AlgohubMasterCreateCampaignArgs['price']
  maxBuyCap: AlgohubMasterCreateCampaignArgs['maxBuyCap']
  softCap: AlgohubMasterCreateCampaignArgs['softCap']
  hardCap: AlgohubMasterCreateCampaignArgs['hardCap']
  duration: AlgohubMasterCreateCampaignArgs['duration']
  metadataUrl: AlgohubMasterCreateCampaignArgs['metadataUrl']
  onSuccess?: VoidFunction
}

const AlgohubMasterCreateCampaign = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling createCampaign`)
    await props.typedClient
      .createCampaign(
        {
          votersAsa: props.votersAsa,
          adminAccount: props.adminAccount,
          idoAsa: props.idoAsa,
          buyAsa: props.buyAsa,
          price: props.price,
          maxBuyCap: props.maxBuyCap,
          softCap: props.softCap,
          hardCap: props.hardCap,
          duration: props.duration,
          metadataUrl: props.metadataUrl,
        },
        { sender },
      )
      .then(() => {
        setLoading(false)

        if (props.onSuccess) {
          props.onSuccess()
        }
      })
      .catch((e) => {
        setLoading(false)
        console.error(e)
      })
  }

  return (
    <Button customClassName={props.buttonClass} onClick={callMethod} shouldDisplaySpinner={loading}>
      {props.children}
    </Button>
  )
}

export default AlgohubMasterCreateCampaign
