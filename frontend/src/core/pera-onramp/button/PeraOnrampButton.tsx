import './_pera-onramp-button.scss'

import { PeraOnramp } from '@perawallet/onramp'
import { useEffect, useRef } from 'react'

import usePeraOnrampAssetOptin from '../hook/usePeraOnrampAssetOptIn'
import Button from '../../../components/common/button/Button'
import Toast from '../../../components/common/toast/Toast'
import useAppContext from '../../util/useAppContext'

function PeraOnrampButton() {
  const state = useAppContext()

  const peraOnrampRef = useRef<null | PeraOnramp>(null)
  const { executeAssetOptin, toastMessage } = usePeraOnrampAssetOptin()

  function handleClick() {
    if (peraOnrampRef.current) {
      peraOnrampRef.current.addFunds({ accountAddress: state.userData?.wallet_address ?? '' }).then(closeModal)
    }
  }

  function closeModal() {
    if (peraOnrampRef.current) {
      peraOnrampRef.current.close()
    }
  }

  useEffect(() => {
    const onramp = new PeraOnramp({
      optInEnabled: Boolean(state.userData?.wallet_address),
    })

    onramp.on({
      OPT_IN_REQUEST: (args) => executeAssetOptin({ ...args, peraOnramp: onramp }),
    })

    peraOnrampRef.current = onramp
  }, [state.userData?.wallet_address, executeAssetOptin])

  return (
    <>
      <Button customClassName={'bg-onramp-green hover:bg-lime-500 text-green-900'} buttonType={'default'} onClick={handleClick} size={'sm'}>
        {'pera onramp'}
      </Button>

      {toastMessage && <Toast>{toastMessage}</Toast>}
    </>
  )
}

export default PeraOnrampButton
