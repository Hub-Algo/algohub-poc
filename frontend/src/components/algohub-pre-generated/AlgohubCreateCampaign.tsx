/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { Algohub, AlgohubClient } from '../../contracts/AlgohubClient'
import Button from '../common/button/Button'
import { microAlgos } from '@algorandfoundation/algokit-utils'

/* Example usage
<AlgohubCreateCampaign
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call createCampaign"
  typedClient={typedClient}
  votersAsa={votersAsa}
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
type AlgohubCreateCampaignArgs =
  Algohub['methods']['createCampaign(asset,asset,asset,uint64,uint64,uint64,uint64,uint64,string)uint64']['argsObj']

type Props = {
  buttonClass?: string
  buttonLoadingNode?: ReactNode
  children: ReactNode
  typedClient: AlgohubClient
  votersAsa: AlgohubCreateCampaignArgs['votersAsa']
  idoAsa: AlgohubCreateCampaignArgs['idoAsa']
  buyAsa: AlgohubCreateCampaignArgs['buyAsa']
  price: AlgohubCreateCampaignArgs['price']
  maxBuyCap: AlgohubCreateCampaignArgs['maxBuyCap']
  softCap: AlgohubCreateCampaignArgs['softCap']
  hardCap: AlgohubCreateCampaignArgs['hardCap']
  duration: AlgohubCreateCampaignArgs['duration']
  metadataUrl: AlgohubCreateCampaignArgs['metadataUrl']
  onSuccess?: VoidFunction
}

const AlgohubCreateCampaign = (props: Props) => {
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
          idoAsa: props.idoAsa,
          buyAsa: props.buyAsa,
          price: props.price,
          maxBuyCap: props.maxBuyCap,
          softCap: props.softCap,
          hardCap: props.hardCap,
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
      .catch((e) => {
        console.log(e)
        setLoading(false)

        return Promise.reject(e)
      })
      .then(() => {
        setLoading(false)

        if (props.onSuccess) {
          props.onSuccess()
        }
      })
  }

  return (
    <Button customClassName={props.buttonClass} onClick={callMethod} shouldDisplaySpinner={loading}>
      {props.children}
    </Button>
  )
}

export default AlgohubCreateCampaign
