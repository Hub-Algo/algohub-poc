import { BiWallet } from 'react-icons/bi'

const HeroSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:h-screen bg-gray-900">
      <div className="colspan-1 h-screen">
        <div className="h-3/5 rounded-md flex flex-col items-center justify-center ">
          <div className="w-2/3 flex flex-col items-center text-center">
            <p className="text-5xl font-oswald font-bold text-orange-500">ALGOHUB</p>
            <p className="font-oswald font-normal text-orange-500">Powerful Projects. Vetted Quality. Investment, beyond funds</p>
          </div>
        </div>
        <div className="h-2/5 rounded-xl border-2 border-orange-500 rounded-br-none border-b-0 border-l-0"></div>
      </div>
      <div className="colspan-1">
        <div className="border-2 border-orange-500 rounded-xl border-t-0 rounded-tl-none flex items-center justify-center h-full md:h-3/5">
          <div className="flex flex-col w-2/3 justify-center items-center h-full gap-6">
            <div className="font-oswald text-xl font-bold text-orange-500 border-b-2 border-t-2 border-transparent hover:border-orange-500 cursor-pointer transition-all py-2 flex items-center gap-2 ">
              <p>Connect wallet</p> <BiWallet />
            </div>
            <div className="font-oswald text-xl text-orange-500 border-b border-t border-transparent hover:border-orange-500 cursor-pointer transition-all py-2">
              Documentation
            </div>
            <div className="font-oswald text-xl text-orange-500 border-b border-t border-transparent hover:border-orange-500 cursor-pointer transition-all py-2">
              About Algohub
            </div>
          </div>
        </div>
        <div className="h-2/5 border-2 border-t-0 border-orange-500 border-b-0 rounded-xl rounded-bl-none"></div>
      </div>
    </div>
  )
}

export default HeroSection
