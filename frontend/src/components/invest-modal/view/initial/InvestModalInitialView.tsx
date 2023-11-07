import { FormEvent } from 'react'
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
  const usdcBalance = 50000
  const outputToken = (inputProps.value ?? 0) / 10
  const algoFee = '0.03 ALGO'

  return (
    <form onSubmit={onInvestButtonClick} className={'flex flex-col gap-4'}>
      <p>{'Please enter the amount you want to invest.'}</p>

      <Input
        labels={{ inputTitle: 'Invest', bottomText: `Balance: ${usdcBalance} USDC` }}
        type={'text'}
        value={inputProps.value ?? ''}
        placeholder={'Enter amount'}
        onChange={inputProps.onChange}
        max={usdcBalance}
        min={0}
      />

      <ul>
        <li>{`Output token: ${outputToken}X`} </li>
        <li>{`Fee: ${algoFee}`}</li>
      </ul>

      <Button type="submit" isDisabled={!inputProps.value}>
        {'Invest'}
      </Button>
    </form>
  )
}

export default InvestModalInitialView
