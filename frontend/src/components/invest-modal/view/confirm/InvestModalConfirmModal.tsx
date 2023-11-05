import { BiError } from 'react-icons/bi'
import Lottie from 'lottie-react'
import Button from '../../../common/button/Button'
import successAnimation from '../../../../core/animation/success-confetti.json'

interface InvestModalConfirmViewProps {
  onConfirm: VoidFunction
  onCancel: VoidFunction
  inputAmount: number
  state?: 'success' | 'failed'
}

function InvestModalConfirmView({ onConfirm, inputAmount, state, onCancel }: InvestModalConfirmViewProps) {
  const outputTokenAmount = inputAmount / 10
  const algoFee = '0.03 ALGO'

  return <div className={'flex flex-col gap-4'}>{renderContent()}</div>

  function renderContent() {
    if (!state) {
      return (
        <>
          <h2>{'Confirm Invest'}</h2>

          <p
            className={'max-w-xl'}
          >{`Please note that once you submit the transaction, it cannot be reverted. When the campaign is completed you will receive ${outputTokenAmount} X token`}</p>

          <ul>
            <li>{`Input token: ${inputAmount} USDC`}</li>
            <li>{`Output token: ${outputTokenAmount} X`}</li>
            <li>{`Transaction fee: ${algoFee}`}</li>
          </ul>

          <div className={'md:grid-cols-2 gap-4 grid grid-cols-1'}>
            <Button onClick={onCancel} customClassName={'w-full'}>
              {'Cancel'}
            </Button>

            <Button onClick={onConfirm} isDisabled={state === 'success'} customClassName={'w-full'}>
              {'Confirm'}
            </Button>
          </div>
        </>
      )
    }

    switch (state) {
      case 'success': {
        return (
          <div className={'h-80 relative'}>
            <div className={'absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center gap-6'}>
              <p className={'text-xl text-green-600 font-bold'}>{'You have successfully invested on this campaign!'}</p>

              <ul className={'text-green-500 font-bold'}>
                <li>{`Input token: ${inputAmount} USDC`}</li>
                <li>{`Output token: ${outputTokenAmount} X`}</li>
                <li>{`Transaction fee: ${algoFee}`}</li>
              </ul>
            </div>

            <Lottie animationData={successAnimation} style={{ height: '300px' }} loop={3} />
          </div>
        )
      }

      case 'failed': {
        return (
          <>
            <h2>{'Confirm Invest'}</h2>

            <p
              className={'max-w-xl'}
            >{`Please note that once you submit the transaction, it cannot be reverted. When the campaign is completed you will receive ${outputTokenAmount} X token`}</p>

            <ul>
              <li>{`Input token: ${inputAmount} USDC`}</li>
              <li>{`Output token: ${outputTokenAmount} X`}</li>
              <li>{`Transaction fee: ${algoFee}`}</li>
            </ul>

            <div className={'alert alert-error opacity-80'}>
              <BiError />

              <span>{'There was an error while sending the transaction. Please try again.'}</span>
            </div>

            <div className={'md:grid-cols-2 gap-4 grid grid-cols-1'}>
              <Button onClick={onCancel} customClassName={'w-full'}>
                {'Cancel'}
              </Button>

              <Button onClick={onConfirm} customClassName={'w-full'}>
                {'Try again'}
              </Button>
            </div>
          </>
        )
      }
    }
  }
}

export default InvestModalConfirmView
