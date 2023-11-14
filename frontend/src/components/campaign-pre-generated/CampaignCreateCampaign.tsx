/* eslint-disable no-console */
import { microAlgos } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { Campaign, CampaignClient } from '../../contracts/CampaignClient'
import Button from '../common/button/Button'

/* Example usage
<CampaignCreateCampaign
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call createCampaign"
  typedClient={typedClient}
  adminAccount={adminAccount}
  votersAsa={votersAsa}
  idoAsa={idoAsa}
  investmentAsa={investmentAsa}
  price={price}
  maxInvestmentPerAccount={maxInvestmentPerAccount}
  minTotalInvestment={minTotalInvestment}
  maxTotalInvestment={maxTotalInvestment}
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
  investmentAsa: CampaignCreateCampaignArgs['investmentAsa']
  price: CampaignCreateCampaignArgs['price']
  maxInvestmentPerAccount: CampaignCreateCampaignArgs['maxInvestmentPerAccount']
  minTotalInvestment: CampaignCreateCampaignArgs['minTotalInvestment']
  maxTotalInvestment: CampaignCreateCampaignArgs['maxTotalInvestment']
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
        investmentAsa: props.investmentAsa,
        price: props.price,
        maxInvestmentPerAccount: props.maxInvestmentPerAccount,
        minTotalInvestment: props.minTotalInvestment,
        maxTotalInvestment: props.maxTotalInvestment,
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
