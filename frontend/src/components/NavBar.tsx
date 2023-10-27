import { useWallet } from '@txnlab/use-wallet'
import ConnectDropdown from './ConnectDropdown'
import { Link } from 'react-router-dom'
import WalletWidget from './WalletWidget'
import routes from '../core/routes'

const NavBar = () => {
  const links = [{ title: 'About us', path: routes.ABOUT.ROUTE }]

  const { activeAccount } = useWallet()

  const linksRenderer = links.map((link) => (
    <li key={link.title}>
      <Link to={link.path}>{link.title}</Link>
    </li>
  ))

  return (
    <div className="navbar bg-base-200 top-0 z-10">
      <div className="flex-1">
        <a href={routes.BASE} className="btn btn-ghost normal-case text-xl">
          AlgoHub
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 gap-3">
          {linksRenderer}
          <li>{activeAccount ? <WalletWidget walletAddress={activeAccount.address} /> : <ConnectDropdown />}</li>
        </ul>
      </div>
    </div>
  )
}

export default NavBar
