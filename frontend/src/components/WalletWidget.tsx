import { useWallet } from '@txnlab/use-wallet'
import { generatePath, useNavigate } from 'react-router-dom'
import routes from '../core/routes'
import Dropdown from './common/dropdown/Dropdown'
import { Option } from './common/dropdown/Dropdown.types'

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

  const links: WalletWidgetType[] = [
    { id: 'disconnect', content: 'Disconnect', path: routes.BASE },
    {
      id: 'profile',
      content: 'Profile',
      path: generatePath(routes.PROFILE.FULL_PATH, { walletAddress }),
    },
  ]

  return (
    <Dropdown
      triggerProps={{
        title: username as string,
        customClassName: 'bg-orange-500 text-gray-100 hover:bg-orange-600 hover:text-gray-100 active:bg-orange-600',
      }}
      options={links}
      onSelect={handleSelect}
    />
  )

  function handleSelect(option: WalletWidgetType) {
    if (option.id === 'disconnect') {
      handleDisconnect()
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
}

export default WalletWidget
