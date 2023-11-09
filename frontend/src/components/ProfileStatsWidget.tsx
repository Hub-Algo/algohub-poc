import { BiDollarCircle } from 'react-icons/bi'
import { SiAlgorand } from 'react-icons/si'
import { UserInterface } from '../interfaces/userInterface'

const ProfileStatsWidget = ({ username, usdc_balance, algo_balance }: Partial<UserInterface>) => {
  return (
    <div className=" rounded-md border border-orange-500 bg-gray-950 flex flex-col">
      <div className="stat text-3xl text-gray-100 font-bold">{username}</div>
      <div className="flex flex-col md:flex-row">
        <div className="stat border-none">
          <div className="stat-title text-gray-100">USDC Balance:</div>
          <div className="stat-value flex items-end text-gray-100">
            <BiDollarCircle className="h-8" />
            {usdc_balance}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title text-gray-100">Voting power</div>
          <div className="stat-value flex items-center text-gray-100">
            <SiAlgorand className="h-6" />
            {algo_balance}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileStatsWidget
