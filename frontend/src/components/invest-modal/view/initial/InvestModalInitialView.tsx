import { FormEvent } from 'react'
import { convertFromBaseUnits } from '../../../../core/util/transaction/transactionUtils'
import useAppContext from '../../../../core/util/useAppContext'
import { AssetInfoInterface } from '../../../../interfaces/AssetInfoInterface'
import { CampaignObj } from '../../../../services/campaignServices'
import Button from '../../../common/button/Button'
import Input from '../../../common/input/Input'

interface InvestModalInitialViewProps {
  inputProps: {
    value?: number
    onChange: (event: React.SyntheticEvent<HTMLInputElement, Event>) => void
  }
  onInvestButtonClick: (event: FormEvent<HTMLFormElement>) => void
  campaign: CampaignObj
  idoAsa?: AssetInfoInterface
}

function InvestModalInitialView({ inputProps, onInvestButtonClick, campaign, idoAsa }: InvestModalInitialViewProps) {
  const { userData } = useAppContext()
  const outputToken = (inputProps.value ?? 0) * campaign.conversionRate
  const algoFee = '0.03 ALGO' // TODO: Calculate manually
  const maxInvestmentPerAccount = campaign.maxInvestmentPerAccount

  return (
    <form onSubmit={onInvestButtonClick} className={'flex flex-col gap-4'}>
      <p className="text-gray-100">{'Please enter the amount you want to invest.'}</p>

      <Input
        labels={{
          inputTitle: 'Invest',
          bottomText: `Balance: ${userData?.usdc_balance} USDC`,
        }}
        type={'text'}
        value={inputProps.value ?? ''}
        placeholder={'Enter amount'}
        onChange={inputProps.onChange}
        max={Math.max(userData?.usdc_balance ?? 0, maxInvestmentPerAccount)}
        min={0}
      />

      <ul className="text-gray-100">
        <li>
          {`Available Investment: ${convertFromBaseUnits(
            idoAsa?.params?.decimals || 0,
            campaign.maxTotalInvestment - campaign.investedAmount,
          )} ${idoAsa?.params['unit-name']}`}{' '}
        </li>
        <li>{`Output token: ${outputToken} ${idoAsa?.params['unit-name']}`} </li>
        <li>{`Fee: ${algoFee}`}</li>
      </ul>

      <Button type="submit" isDisabled={!inputProps.value} size={'md'}>
        {'Invest'}
      </Button>
    </form>
  )
}

export default InvestModalInitialView
