/* eslint-disable no-console */
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { Campaign, CampaignClient } from '../../contracts/CampaignClient'

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
  conversionRate={conversionRate}
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
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: CampaignClient
  adminAccount: CampaignCreateCampaignArgs['adminAccount']
  votersAsa: CampaignCreateCampaignArgs['votersAsa']
  idoAsa: CampaignCreateCampaignArgs['idoAsa']
  investmentAsa: CampaignCreateCampaignArgs['investmentAsa']
  conversionRate: CampaignCreateCampaignArgs['conversionRate']
  maxInvestmentPerAccount: CampaignCreateCampaignArgs['maxInvestmentPerAccount']
  minTotalInvestment: CampaignCreateCampaignArgs['minTotalInvestment']
  maxTotalInvestment: CampaignCreateCampaignArgs['maxTotalInvestment']
  votingPeriod: CampaignCreateCampaignArgs['votingPeriod']
  duration: CampaignCreateCampaignArgs['duration']
  metadataUrl: CampaignCreateCampaignArgs['metadataUrl']
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
        conversionRate: props.conversionRate,
        maxInvestmentPerAccount: props.maxInvestmentPerAccount,
        minTotalInvestment: props.minTotalInvestment,
        maxTotalInvestment: props.maxTotalInvestment,
        votingPeriod: props.votingPeriod,
        duration: props.duration,
        metadataUrl: props.metadataUrl,
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

export default CampaignCreateCampaign
