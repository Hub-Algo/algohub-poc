import { BiDollarCircle } from 'react-icons/bi'
import routes from '../core/routes'
import HeroButton from './HeroButton'
import { UserDataOutletInterface } from './NavBar'
import Button from './common/button/Button'

const HeroSection = ({ userData }: UserDataOutletInterface) => {
  return (
    <div className="flex flex-col h-96 md:h-screen bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        <div className="rounded-md flex flex-col items-center justify-center ">
          <div className="flex flex-col items-center text-center md:text-start md:items-start">
            <div className="flex items-center">
              <h3 className="text-5xl text-gray-100">ALGO</h3>
              <img className="h-16" src="/images/algohub_logo_light.png" alt="" />
              <h3 className="text-5xl text-gray-100">HUB</h3>
            </div>
            <p className=" text-xl font-normal text-gray-400 w-96 flex flex-col md:text-left">
              <span>{'The Home of Algorand Projects.'}</span>
            </p>
            <div className="flex w-full justify-around md:hidden mt-6 items-center">
              <Button buttonColor="orange">
                <a href={routes.CAMPAIGN_APPLICATION_FORM.ROUTE}>CREATE CAMPAIGN</a>
              </Button>
              <Button buttonColor="orange">
                <a href={routes.ALL_CAMPAIGNS.ROUTE}>VIEW ALL CAMPAIGNS</a>
              </Button>
            </div>
          </div>
        </div>

        <div className="border-2 border-orange-500 rounded-3xl hidden md:flex items-center justify-center h-full md:h-full rounded-b-none md:border-r-0 md:rounded-bl-xl rounded-t-none md:rounded-br-none border-t-0">
          <div className="flex flex-col justify-center items-center gap-6">
            <div className=" text-xl font-bold text-orange-500 border-b-2 border-t-2 border-transparent hover:border-orange-500 cursor-pointer transition-all py-2 flex items-center gap-2">
              {userData ? (
                <div className="flex flex-col items-center justify-center">
                  <p>{userData.username.toUpperCase()}</p>
                  <div className="flex">
                    <BiDollarCircle className="h-8" />
                    <p className="font-normal">{userData.usdc_balance} USDC</p>
                  </div>
                </div>
              ) : null}
            </div>
            <a
              href={routes.ABOUT.ROUTE}
              className=" text-xl text-orange-500 border-b border-t border-transparent hover:border-orange-500 cursor-pointer transition-all py-2"
            >
              ABOUT US
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <HeroButton
          href={routes.CAMPAIGN_APPLICATION_FORM.ROUTE}
          customClassName={'hidden md:flex w-full h-32 md:h-64 border-l-0 rounded-l-none'}
        >
          {'Create campaign'}
        </HeroButton>
        <HeroButton href={routes.ALL_CAMPAIGNS.ROUTE} customClassName={'hidden md:flex w-full h-32 md:h-64 border-r-0 rounded-r-none'}>
          {'View campaigns'}
        </HeroButton>
      </div>
    </div>
  )
}

export default HeroSection
