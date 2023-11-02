import './_pera-onramp-button.scss'

import { PeraOnramp } from '@perawallet/onramp'
import { useEffect, useRef } from 'react'

import usePeraOnrampAssetOptin from '../hook/usePeraOnrampAssetOptIn'
import { useWallet } from '@txnlab/use-wallet'
import Button from '../../../components/common/button/Button'
import Toast from '../../../components/common/toast/Toast'

function PeraOnrampButton() {
  const { activeAddress } = useWallet()

  const peraOnrampRef = useRef<null | PeraOnramp>(null)
  const { executeAssetOptin, toastMessage } = usePeraOnrampAssetOptin()

  useEffect(() => {
    const onramp = new PeraOnramp({
      optInEnabled: Boolean(activeAddress),
    })

    onramp.on({
      OPT_IN_REQUEST: (args) => executeAssetOptin({ ...args, peraOnramp: onramp }),
    })

    peraOnrampRef.current = onramp
  }, [activeAddress, executeAssetOptin])

  return (
    <>
      <Button customClassName={'bg-onramp-green hover:bg-lime-500 text-green-900'} buttonType={'default'} onClick={handleClick} size={'sm'}>
        {'pera onramp'}
      </Button>

      {toastMessage && <Toast>{toastMessage}</Toast>}
    </>
  )

  function handleClick() {
    if (peraOnrampRef.current) {
      peraOnrampRef.current.addFunds({ accountAddress: activeAddress ?? '' }).then(closeModal)
    }
  }

  function closeModal() {
    if (peraOnrampRef.current) {
      peraOnrampRef.current.close()
    }
  }
}

export default PeraOnrampButton
