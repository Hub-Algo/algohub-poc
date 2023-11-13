import { Link } from 'react-router-dom'
import routes from '../core/routes'
import { UserPropsInterface } from '../interfaces/user-props-interface'
import { UserInterface } from '../interfaces/userInterface'
import ConnectDropdown from './ConnectDropdown'
import Sidebar from './Sidebar'
import WalletWidget from './WalletWidget'
import useAppContext from '../core/util/useAppContext'

export interface UserDataOutletInterface {
  userData: UserInterface
}

const NavBar = ({ userData, resetUserData }: UserPropsInterface) => {
  const links = [{ title: 'About us', path: routes.ABOUT.ROUTE }]

  const state = useAppContext()

  const linksRenderer = links.map((link) => (
    <li key={link.title} className="hidden md:block">
      <Link to={link.path}>{link.title}</Link>
    </li>
  ))

  return (
    <div className="navbar bg-gray-950 top-0 z-10 text-gray-100 shadow-sm">
      <div className="flex-1">
        <a href={routes.BASE} className="btn btn-ghost normal-case text-xl">
          AlgoHub
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 gap-3 flex items-center w-full">
          {linksRenderer}
          <li className="md:block">
            {state?.activeAccount ? (
              <WalletWidget username={userData?.username} walletAddress={state.activeAccount.address} resetUserData={resetUserData} />
            ) : (
              <ConnectDropdown />
            )}
          </li>
          <li className="md:hidden">
            <Sidebar />
          </li>
        </ul>
      </div>
    </div>
  )
}

export default NavBar
