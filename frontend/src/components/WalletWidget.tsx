import { useWallet } from '@txnlab/use-wallet'
import { generatePath, useNavigate } from 'react-router-dom'
import routes from '../core/routes'
import Dropdown from './common/dropdown/Dropdown'
import { Option } from './common/dropdown/Dropdown.types'
import { useEffect, useRef } from 'react'
import Toast from './common/toast/Toast'
import { PeraOnramp } from '@perawallet/onramp'
import usePeraOnrampAssetOptin from '../core/pera-onramp/hook/usePeraOnrampAssetOptIn'

interface WalletWidgetPropsInterface {
  username: string | undefined
  walletAddress: string
}

type WalletWidgetType = Option & {
  path: string
}

const WalletWidget = ({ username, walletAddress }: WalletWidgetPropsInterface) => {
  const { providers, activeAccount } = useWallet()
  const navigate = useNavigate()

  const peraOnrampRef = useRef<null | PeraOnramp>(null)
  const { executeAssetOptin, toastMessage } = usePeraOnrampAssetOptin()

  function handlePeraOnRampClick() {
    if (peraOnrampRef.current) {
      peraOnrampRef.current.addFunds({ accountAddress: activeAccount?.address ?? '' }).then(closeModal)
    }
  }

  function closeModal() {
    if (peraOnrampRef.current) {
      peraOnrampRef.current.close()
    }
  }

  useEffect(() => {
    const onramp = new PeraOnramp({
      optInEnabled: Boolean(activeAccount?.address),
    })

    onramp.on({
      OPT_IN_REQUEST: (args) => executeAssetOptin({ ...args, peraOnramp: onramp }),
    })

    peraOnrampRef.current = onramp
  }, [activeAccount?.address, executeAssetOptin])

  const links: WalletWidgetType[] = [
    { id: 'disconnect', content: 'Disconnect', path: routes.BASE },
    {
      id: 'profile',
      content: 'Profile',
      path: generatePath(routes.PROFILE.FULL_PATH, { walletAddress }),
    },
    { id: 'addFunds', content: 'Onramp funds', path: '' },
  ]

  function handleSelect(option: WalletWidgetType) {
    switch (option.id) {
      case 'disconnect':
        handleDisconnect()
        break

      case 'addFunds':
        handlePeraOnRampClick()
    }

    navigate(option.path)
  }

  function handleDisconnect() {
    const provider = providers?.filter((provider) => provider.metadata.id === activeAccount?.providerId)

    if (!provider) {
      return
    }

    provider[0].disconnect()
  }

  return (
    <>
      <Dropdown
        triggerProps={{
          title: username as string,
          customClassName: 'bg-orange-500 text-gray-100 hover:bg-orange-600 hover:text-gray-100 active:bg-orange-600',
        }}
        options={links}
        onSelect={handleSelect}
      />
      {toastMessage && <Toast>{toastMessage}</Toast>}
    </>
  )
}

export default WalletWidget
