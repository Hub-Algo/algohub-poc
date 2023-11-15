import { Fragment, useState } from 'react'
import Modal from './common/modal/Modal'
import Button from './common/button/Button'
import classNames from 'classnames'

function VoteModal({ hasVotedAlready }: { hasVotedAlready: boolean }) {
  const votingPower = 2

  const [state, setState] = useState<'initial' | 'success' | 'error'>('initial')
  const [vote, setVote] = useState<'YES' | 'NO'>()

  return (
    <Modal id={'vote-modal'} modalButtonName={hasVotedAlready ? 'Update vote' : 'Vote'}>
      {renderContent()}
    </Modal>
  )

  function renderContent() {
    let content = <Fragment />

    switch (state) {
      case 'initial': {
        content = (
          <div className={'flex flex-col gap-3'}>
            <h2 className={'font-bold text-lg'}>{'Vote for the campaign'}</h2>

            <p>{'You can participate in the voting with your voting power and update your vote during the voting period'}</p>

            <p>{`Current voting power: ${votingPower}`}</p>

            <div className={'flex flex-row gap-3'}>
              <Button buttonColor={'orange'} onClick={handleSendYesTxn} customClassName={'basis-1/2 min-w-max'}>
                {'Yes'}
              </Button>

              <Button buttonColor={'neutral'} onClick={handleSendNoTxn} customClassName={'basis-1/2 min-w-max'}>
                {'No'}
              </Button>
            </div>
          </div>
        )
        break
      }

      case 'success': {
        content = (
          <div className={'flex flex-col gap-3'}>
            <h2 className={'font-bold text-lg'}>{'Vote for the campaign'}</h2>

            <p>{'Successfully voted for the campaign!'}</p>

            <div className={'flex flex-row gap-2'}>
              <p>{'You voted: '}</p>

              <p className={classNames('font-bold', { 'text-green-500': vote === 'YES', 'text-rose-500': vote === 'NO' })}>{vote}</p>
            </div>
          </div>
        )
        break
      }
      case 'error': {
        content = (
          <div className={'flex flex-col gap-3'}>
            <h2 className={'font-bold text-lg'}>{'Vote for the campaign'}</h2>

            <p>{'There was an error while sending the vote transaction. Please try again.'}</p>

            <div className={'flex flex-row flex-wrap gap-3'}>
              <Button buttonColor={'orange'} onClick={handleSendYesTxn}>
                {'Yes'}
              </Button>

              <Button buttonColor={'neutral'} onClick={handleSendNoTxn}>
                {'No'}
              </Button>
            </div>
          </div>
        )
        break
      }
      default:
        break
    }

    return content
  }

  function handleSendNoTxn() {
    setVote('NO')
    setState('success')
  }

  function handleSendYesTxn() {
    setVote('YES')
    setState('success')
  }
}

export default VoteModal
