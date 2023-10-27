import { useWallet } from '@txnlab/use-wallet'
import { Link, generatePath } from 'react-router-dom'
import routes from '../core/routes'
import { ellipseAddress } from '../utils/ellipseAddress'

interface WalletWidgetPropsInterface {
  walletAddress: string
}

const WalletWidget = ({ walletAddress }: WalletWidgetPropsInterface) => {
  const { providers, activeAccount } = useWallet()

  const handleDisconnect = () => {
    if (!provider) {
      return
    }
    provider[0].disconnect()
  }

  const provider = providers?.filter((provider) => provider.metadata.id === activeAccount?.providerId)

  const links = [
    { title: 'disconnect', path: routes.BASE, function: handleDisconnect },
    {
      title: 'profile',
      path: generatePath(routes.PROFILE.FULL_PATH, { walletAddress }),
    },
  ]

  const linksRenderer = links.map((link) => (
    <li key={link.title}>
      <Link onClick={link.function} to={link.path}>
        {link.title}
      </Link>
    </li>
  ))

  return (
    <details>
      <summary className="bg-orange-500 text-gray-100 hover:bg-orange-600 hover:text-gray-100 active:bg-orange-600 font-bold">
        {ellipseAddress(walletAddress)}
      </summary>
      <ul className="p-2 bg-base-300 w-36">{linksRenderer}</ul>
    </details>
  )
}

export default WalletWidget
