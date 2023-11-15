import { FormEvent } from 'react'
import useAppContext from '../../../../core/util/useAppContext'
import Button from '../../../common/button/Button'
import Input from '../../../common/input/Input'

interface InvestModalInitialViewProps {
  inputProps: {
    value?: number
    onChange: (event: React.SyntheticEvent<HTMLInputElement, Event>) => void
  }
  onInvestButtonClick: (event: FormEvent<HTMLFormElement>) => void
}
function InvestModalInitialView({ inputProps, onInvestButtonClick }: InvestModalInitialViewProps) {
  const { userData } = useAppContext()
  const outputToken = (inputProps.value ?? 0) / 10 // TODO: Calculate output token
  const algoFee = '0.03 ALGO' // TODO: Calculate manually
  const maxInvestmentPerAccount = 5000 // TODO: fetch this info from the contract/api

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
        <li>{`Output token: ${outputToken}X`} </li>
        <li>{`Fee: ${algoFee}`}</li>
      </ul>

      <Button type="submit" isDisabled={!inputProps.value} size={'md'}>
        {'Invest'}
      </Button>
    </form>
  )
}

export default InvestModalInitialView
