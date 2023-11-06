import { BiDollarCircle, BiWallet } from 'react-icons/bi'
import HeroButton from './HeroButton'
import { UserDataOutletInterface } from './NavBar'
import Button from './common/button/Button'

const HeroSection = ({ userData }: UserDataOutletInterface) => {
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        <div className="rounded-md flex flex-col items-center justify-center ">
          <div className="flex flex-col items-center text-center md:text-start md:items-start">
            <p className="text-6xl font-oswald font-bold text-orange-500">ALGOHUB</p>
            <p className="font-oswald font-normal text-orange-500 w-80 flex flex-col md:text-left">
              <span>{'Powerful Projects. Vetted Quality.'}</span>
              <span>{'Investment, beyond funds'}</span>
            </p>
            <div className="flex w-full gap-6 md:hidden mt-6">
              <Button buttonColor="orange">CREATE CAMPAIGN</Button>
              <Button buttonColor="orange">VIEW ALL CAMPAIGNS</Button>
            </div>
          </div>
        </div>

        <div className="border-2 border-orange-500 rounded-3xl flex items-center justify-center h-64 md:h-full">
          <div className="flex flex-col justify-center items-center gap-6">
            <div className="font-oswald text-xl font-bold text-orange-500 border-b-2 border-t-2 border-transparent hover:border-orange-500 cursor-pointer transition-all py-2 flex items-center gap-2">
              {userData ? (
                <div className="flex flex-col items-center justify-center">
                  <p>{userData.username}</p>
                  <div className="flex">
                    <BiDollarCircle className="h-8" />
                    <p>{userData.usdc_balance} USDC</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <p>CONNECT WALLET</p> <BiWallet />
                </div>
              )}
            </div>
            <div className="font-oswald text-xl text-orange-500 border-b border-t border-transparent hover:border-orange-500 cursor-pointer transition-all py-2">
              ABOUT US
            </div>
            <div className="font-oswald text-xl text-orange-500 border-b border-t border-transparent hover:border-orange-500 cursor-pointer transition-all py-2">
              ABOUT ALGOHUB
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <HeroButton customClassName={'hidden md:flex w-full h-32 md:h-64'}>{'Create campaign'}</HeroButton>
        <HeroButton customClassName={'hidden md:flex w-full h-32 md:h-64'}>{'View campaigns'}</HeroButton>
      </div>
    </div>
  )
}

export default HeroSection
