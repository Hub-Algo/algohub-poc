import { Asset, useWallet } from '@txnlab/use-wallet'
import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import PageContainer from '../components/PageContainer'
import ProfileStatsWidget from '../components/ProfileStatsWidget'
import CampaignList from '../components/campaign-list/CampaignList'
import Breadcrumbs from '../components/common/breadcrumbs/Breadcrumbs'
import Tab from '../components/common/tab/Tab'
import { TabItem } from '../components/common/tab/Tab.types'
import useAsyncProcess from '../core/async-process/useAsyncProcess'
import { UserInterface } from '../interfaces/userInterface'
import { CampaignOutletInterface } from './CampaignDetails'

export interface UserDataOutletInterface {
  userData: UserInterface
}

function Profile() {
  const { getAssets, activeAddress } = useWallet()
  // const { state, runAsyncProcess } = useAsyncProcess<Asset[]>()

  const { userData } = useOutletContext() as UserDataOutletInterface

  // TODO: This is an example usage of running async processes using useAsyncProcess hook.
  // Somehow it doesn't set the state and I don't understand why. Remove this useEffect
  useEffect(() => {
    if (activeAddress) {
      runAsyncProcess(getAssets())
    }
  }, [getAssets, runAsyncProcess, activeAddress])

  const { campaignList } = useOutletContext() as CampaignOutletInterface

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
    <PageContainer>
      <Breadcrumbs pathList={['Home', 'Profile']} />
      <div className="flex flex-col">
        <ProfileStatsWidget username={userData.username} usdc_balance={userData.usdc_balance} algo_balance={userData.algo_balance} />
      </div>
      {
        <Tab items={tabItems}>
          <CampaignList campaigns={campaignList} />

          <div>{'Voting History content'}</div>

          <div>
            <p>{'Details'}</p>
          </div>

          <div>{'Settings'}</div>
        </Tab>
      }
    </PageContainer>
  )
}

export default Profile
