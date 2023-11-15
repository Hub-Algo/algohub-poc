import { useOutletContext } from 'react-router-dom'
import PageContainer from '../components/PageContainer'
import ProfileStatsWidget from '../components/ProfileStatsWidget'
import Breadcrumbs from '../components/common/breadcrumbs/Breadcrumbs'
import Tab from '../components/common/tab/Tab'
import { TabItem } from '../components/common/tab/Tab.types'
import { UserInterface } from '../interfaces/userInterface'

export interface UserDataOutletInterface {
  userData: UserInterface
}

function Profile() {
  const { userData } = useOutletContext() as UserDataOutletInterface

  const tabItems: TabItem[] = [
    { id: 'Invested campaigns', content: 'Invested campaigns' },
    {
      id: 'voting-history',
      content: 'Voting History',
    },
    { id: 'details', content: 'Details' },
    {
      id: 'Settings',
      content: 'Settings',
    },
  ]

  return (
    <div className=" flex flex-col gap-10 bg-gray-900">
      <PageContainer>
        <Breadcrumbs pathList={['Home', 'Profile']} />
        <div className="flex flex-col">
          <ProfileStatsWidget username={userData?.username} usdc_balance={userData?.usdc_balance} algo_balance={userData?.algo_balance} />
        </div>
      </PageContainer>

      <Tab items={tabItems}>
        <div className="h-96 flex items-center justify-center">
          <p className="text-3xl text-gray-300">Coming soon</p>
        </div>

        <div className="h-96 flex items-center justify-center">
          <p className="text-3xl text-gray-300">Coming soon</p>
        </div>

        <div className="h-96 flex items-center justify-center">
          <p className="text-3xl text-gray-300">Coming soon</p>
        </div>

        <div className="h-96 flex items-center justify-center">
          <p className="text-3xl text-gray-300">Coming soon</p>
        </div>
      </Tab>
    </div>
  )
}

export default Profile
