import { FormEvent, Fragment, useState } from 'react'
import { CampaignInterface } from '../../interfaces/campaign-interface'
import Modal from '../common/modal/Modal'
import InvestModalInitialView from './view/initial/InvestModalInitialView'
import InvestModalConfirmView from './view/confirm/InvestModalConfirmModal'

interface InvestModalProps {
  campaignStatus: Exclude<CampaignInterface['campaign_status'], 'completed'>
}
function InvestModal({ campaignStatus }: InvestModalProps) {
  const [value, setValue] = useState<number>()
  const [view, setView] = useState<'initial' | 'confirm'>('initial')
  const [investState, setInvestState] = useState<'success' | 'failed'>()

  return (
    <Modal id="invest-modal" modalButtonName={campaignStatus === 'new' ? 'Hypelist' : 'Whitelist'}>
      {renderContent()}
    </Modal>
  )

  function renderContent() {
    let content = <Fragment />

    switch (view) {
      case 'initial': {
        content = <InvestModalInitialView onInvestButtonClick={handleChangeView} inputProps={{ value, onChange: handleChangeValue }} />
        break
      }

      case 'confirm': {
        content = <InvestModalConfirmView onConfirm={handleInvest} onCancel={handleCancel} inputAmount={value!} state={investState} />
      }
    }

    return content
  }

  function handleChangeValue(event: React.SyntheticEvent<HTMLInputElement, Event>) {
    let { value } = event.currentTarget

    // USDC value cannot be a negative number or be greater than max value
    if (value.includes('-')) {
      value = value.replace('-', '')
      // eslint-disable-next-line no-magic-numbers
    } else if (parseFloat(value) > Number(event.currentTarget.max)) {
      value = value.slice(0, value.length - 1)
    }

    setValue(Number(value))
  }

  function handleChangeView(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    event.stopPropagation()

    setView('confirm')
  }

  function handleInvest() {
    setInvestState('success')
  }

  function handleCancel() {
    setView('initial')
  }
}

export default InvestModal
