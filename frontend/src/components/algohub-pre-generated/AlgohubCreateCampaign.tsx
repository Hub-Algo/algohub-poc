/* eslint-disable no-console */
import { microAlgos } from '@algorandfoundation/algokit-utils'
import { AppCallTransactionResultOfType } from '@algorandfoundation/algokit-utils/types/app'
import { useWallet } from '@txnlab/use-wallet'
import { ReactNode, useState } from 'react'
import { Algohub, AlgohubClient } from '../../contracts/AlgohubClient'
import { CampaignApplicationData } from '../../pages/campaign-application/CampaignApplication.types'
import { metadataService } from '../../services/metadataService'
import Button from '../common/button/Button'

/* Example usage
<AlgohubCreateCampaign
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call createCampaign"
  typedClient={typedClient}
  votersAsa={votersAsa}
  idoAsa={idoAsa}
  investmentAsa={investmentAsa}
  conversionRate={conversionRate}
  maxInvestmentPerAccount={maxInvestmentPerAccount}
  minTotalInvestment={minTotalInvestment}
  maxTotalInvestment={maxTotalInvestment}
  duration={duration}
  metadataUrl={metadataUrl}
/>
*/
type AlgohubCreateCampaignArgs =
  Algohub['methods']['createCampaign(asset,asset,asset,uint64,uint64,uint64,uint64,uint64,string,uint64[],uint64[])uint64']['argsObj']

type Props = {
  buttonClass?: string
  buttonLoadingNode?: ReactNode
  children: ReactNode
  typedClient: AlgohubClient
  metadata: CampaignApplicationData
  idoAsa: AlgohubCreateCampaignArgs['idoAsa']
  investmentAsa: AlgohubCreateCampaignArgs['investmentAsa']
  conversionRate: AlgohubCreateCampaignArgs['conversionRate']
  maxInvestmentPerAccount: AlgohubCreateCampaignArgs['maxInvestmentPerAccount']
  minTotalInvestment: AlgohubCreateCampaignArgs['minTotalInvestment']
  maxTotalInvestment: AlgohubCreateCampaignArgs['maxTotalInvestment']
  duration: AlgohubCreateCampaignArgs['duration']
  // metadataUrl: AlgohubCreateCampaignArgs['metadataUrl']
  // vestingPercentages: AlgohubCreateCampaignArgs['vestingPercentages']
  // vestingDurations: AlgohubCreateCampaignArgs['vestingDurations']
  onSuccess?: (response: AppCallTransactionResultOfType<bigint>) => void
}

const AlgohubCreateCampaign = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }
  const metadataSrvc = new metadataService()

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling createCampaign`)
    const metadataResp = await metadataSrvc.uploadMetadata(props.metadata)

    const state = await props.typedClient.appClient.getGlobalState()

    await props.typedClient
      .createCampaign(
        {
          votersAsa: Number(state.votersAsaId.value),
          idoAsa: props.idoAsa,
          investmentAsa: props.investmentAsa,
          conversionRate: props.conversionRate,
          maxInvestmentPerAccount: props.maxInvestmentPerAccount,
          minTotalInvestment: props.minTotalInvestment,
          maxTotalInvestment: props.maxTotalInvestment,
          duration: props.duration,
          metadataUrl: metadataResp.url,
          vestingPercentages: [100],
          vestingDurations: [0],
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
      .then((res) => {
        setLoading(false)

        if (props.onSuccess) {
          props.onSuccess(res)
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
