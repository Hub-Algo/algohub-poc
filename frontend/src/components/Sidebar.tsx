import { BiMenu } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import routes from '../core/routes'

const Sidebar = () => {
  const navigate = useNavigate()

  return (
    <div className="drawer drawer-end hover:text-gray-100">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer-4" className="drawer-button md:hidden">
          <BiMenu className="hover:text-gray-100 text-lg" />
        </label>
      </div>
      <div className="drawer-side z-10">
        <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>

        <ul className="menu p-4 w-80 min-h-full bg-gray-900 text-gray-100 flex flex-col h-full">
          <div className="py-2 border-b-2 border-orange-500">
            <li className="font-bold ">
              <a className="hover:text-gray-100 font-oswald text-4xl" onClick={() => navigate(routes.BASE)}>
                <img className="h-10" src="../public/images/algohub_logo_light.png" />
                <h3>Algohub</h3>
              </a>
            </li>
          </div>
          <div className="py-2">
            <li className="hover:bg-orange-500 transition-all rounded-md">
              <a className="hover:text-gray-100" onClick={() => navigate(routes.ABOUT.ROUTE)}>
                About us
              </a>
            </li>
            <li className="hover:bg-orange-500 transition-all rounded-md">
              <a onClick={() => navigate(routes.ALL_CAMPAIGNS.ROUTE)} className="hover:text-gray-100">
                All campaigns
              </a>
            </li>
          </div>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
