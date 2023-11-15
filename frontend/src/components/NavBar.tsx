import { Link } from 'react-router-dom'
import routes from '../core/routes'
import { UserPropsInterface } from '../interfaces/user-props-interface'
import { UserInterface } from '../interfaces/userInterface'
import ConnectDropdown from './ConnectDropdown'
import Sidebar from './Sidebar'
import WalletWidget from './WalletWidget'

export interface UserDataOutletInterface {
  userData: UserInterface
}

const NavBar = ({ userData, resetUserData }: UserPropsInterface) => {
  return (
    <div className="navbar bg-gray-950 top-0 z-10 text-gray-100 shadow-sm">
      <div className="flex-1">
        <a href={routes.BASE} className="btn btn-ghost normal-case text-xl">
          <img className="h-6 md:h-8" src="public/images/algohub_logo_light.png" />
          <h2 className=" text-md md:text-2xl">AlgoHub</h2>
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 gap-1 flex items-center w-full">
          <li className="hidden md:flex">
            <div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p>Testnet</p>
            </div>
          </li>
          <li className="md:block">
            {userData ? (
              <WalletWidget username={userData?.username} walletAddress={userData.wallet_address} resetUserData={resetUserData} />
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
