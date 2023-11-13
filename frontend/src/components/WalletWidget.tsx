import { PeraOnramp } from '@perawallet/onramp'
import { useWallet } from '@txnlab/use-wallet'
import { useEffect, useRef } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import usePeraOnrampAssetOptin from '../core/pera-onramp/hook/usePeraOnrampAssetOptIn'
import routes from '../core/routes'
import Dropdown from './common/dropdown/Dropdown'
import { Option } from './common/dropdown/Dropdown.types'
import Toast from './common/toast/Toast'
import useAppContext from '../core/util/useAppContext'

interface WalletWidgetPropsInterface {
  username: string | undefined
  walletAddress: string
  resetUserData: () => void
}

type WalletWidgetType = Option & {
  path: string
}

const WalletWidget = ({ username, walletAddress, resetUserData }: WalletWidgetPropsInterface) => {
  const { providers } = useWallet()
  const state = useAppContext()
  const navigate = useNavigate()

  const peraOnrampRef = useRef<null | PeraOnramp>(null)
  const { executeAssetOptin, toastMessage } = usePeraOnrampAssetOptin()

  function handlePeraOnRampClick() {
    if (peraOnrampRef.current) {
      peraOnrampRef.current.addFunds({ accountAddress: state?.activeAccount?.address ?? '' }).then(closeModal)
    }
  }

  function closeModal() {
    if (peraOnrampRef.current) {
      peraOnrampRef.current.close()
    }
  }

  useEffect(() => {
    const onramp = new PeraOnramp({
      optInEnabled: Boolean(state?.activeAccount?.address),
    })

    onramp.on({
      OPT_IN_REQUEST: (args) => executeAssetOptin({ ...args, peraOnramp: onramp }),
    })

    peraOnrampRef.current = onramp
  }, [state?.activeAccount?.address, executeAssetOptin])

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
    const provider = providers?.filter((provider) => provider.metadata.id === state.activeAccount?.providerId)

    if (!provider) {
      return
    }
    resetUserData()
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
