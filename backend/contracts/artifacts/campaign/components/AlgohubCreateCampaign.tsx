/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Algohub, AlgohubClient } from '../contracts/DaoClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<AlgohubCreateCampaign
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call createCampaign"
  typedClient={typedClient}
  votersAsa={votersAsa}
  idoAsa={idoAsa}
  investmentAsa={investmentAsa}
  price={price}
  maxInvestmentPerAccount={maxInvestmentPerAccount}
  minTotalInvestment={minTotalInvestment}
  maxTotalInvestment={maxTotalInvestment}
  duration={duration}
  metadataUrl={metadataUrl}
  vestingPercentages={vestingPercentages}
  vestingDurations={vestingDurations}
/>
*/
type AlgohubCreateCampaignArgs = Dao['methods']['createCampaign(asset,asset,asset,uint64,uint64,uint64,uint64,uint64,string,uint64[],uint64[])uint64']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: AlgohubClient
  votersAsa: AlgohubCreateCampaignArgs['votersAsa']
  idoAsa: AlgohubCreateCampaignArgs['idoAsa']
  investmentAsa: AlgohubCreateCampaignArgs['investmentAsa']
  price: AlgohubCreateCampaignArgs['price']
  maxInvestmentPerAccount: AlgohubCreateCampaignArgs['maxInvestmentPerAccount']
  minTotalInvestment: AlgohubCreateCampaignArgs['minTotalInvestment']
  maxTotalInvestment: AlgohubCreateCampaignArgs['maxTotalInvestment']
  duration: AlgohubCreateCampaignArgs['duration']
  metadataUrl: AlgohubCreateCampaignArgs['metadataUrl']
  vestingPercentages: AlgohubCreateCampaignArgs['vestingPercentages']
  vestingDurations: AlgohubCreateCampaignArgs['vestingDurations']
}

const AlgohubCreateCampaign = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling createCampaign`)
    await props.typedClient.createCampaign(
      {
        votersAsa: props.votersAsa,
        idoAsa: props.idoAsa,
        investmentAsa: props.investmentAsa,
        price: props.price,
        maxInvestmentPerAccount: props.maxInvestmentPerAccount,
        minTotalInvestment: props.minTotalInvestment,
        maxTotalInvestment: props.maxTotalInvestment,
        duration: props.duration,
        metadataUrl: props.metadataUrl,
        vestingPercentages: props.vestingPercentages,
        vestingDurations: props.vestingDurations,
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

export default AlgohubCreateCampaign