import { BiWallet } from 'react-icons/bi'

const HeroSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen bg-gray-900">
      <div className="colspan-1">
        <div className="h-3/5 rounded-md flex flex-col items-center justify-center ">
          <div className="w-2/3 flex flex-col items-center text-center md:text-start md:items-start">
            <p className="text-6xl font-oswald font-bold text-orange-500">ALGOHUB</p>
            <p className="font-oswald font-normal text-orange-500 w-80">Powerful Projects. Vetted Quality. Investment, beyond funds</p>
          </div>
        </div>
        <div className="h-2/5 border-2 border-orange-500 border-b-0 rounded-xl rounded-b-none font-oswald text-3xl text-orange-500 font-bold md:flex justify-center items-center hover:border-b-8 hover:border-l-8 hover:rounded-none hover:rounded-tr-xl transition-all cursor-pointer hidden">
          CREATE CAMPAIGN
        </div>
      </div>
      <div className="colspan-1">
        <div className="border-2 border-orange-500 rounded-xl md:rounded-xl md:border-t-0 rounded-t-none md:rounded-tl-none md:rounded-t-none flex items-center justify-center h-full md:h-3/5">
          <div className="flex flex-col w-2/3 justify-center items-center h-full gap-6">
            <div className="font-oswald text-xl font-bold text-orange-500 border-b-2 border-t-2 border-transparent hover:border-orange-500 cursor-pointer transition-all py-2 flex items-center gap-2">
              <p>CONNECT WALLET</p> <BiWallet />
            </div>
            <div className="font-oswald text-xl text-orange-500 border-b border-t border-transparent hover:border-orange-500 cursor-pointer transition-all py-2">
              ABOUT US
            </div>
            <div className="font-oswald text-xl text-orange-500 border-b border-t border-transparent hover:border-orange-500 cursor-pointer transition-all py-2">
              ABOUT ALGOHUB
            </div>
          </div>
        </div>
        <div className="h-2/5 border-2 border-t-0 border-orange-500 border-b-0 rounded-xl rounded-b-none font-oswald text-3xl text-orange-500 font-bold flex justify-center items-center hover:border-b-8 hover:border-r-8 hover:rounded-tr-none transition-all cursor-pointer">
          VIEW CAMPAIGNS
        </div>
      </div>
    </div>
  )
}

export default HeroSection
