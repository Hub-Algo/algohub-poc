import PageContainer from '../components/PageContainer'
import Button from '../components/common/button/Button'
import Tab from '../components/common/tab/Tab'
import { TabItem } from '../components/common/tab/Tab.types'
import useAsyncProcess from '../core/async-process/useAsyncProcess'
import { Asset, useWallet } from '@txnlab/use-wallet'
import { useEffect } from 'react'

function Profile() {
  const { getAssets, activeAddress } = useWallet()
  const { state, runAsyncProcess } = useAsyncProcess<Asset[]>()

  // TODO: This is an example usage of running async processes using useAsyncProcess hook.
  // Somehow it doesn't set the state and I don't understand why. Remove this useEffect
  useEffect(() => {
    if (activeAddress) {
      runAsyncProcess(getAssets())
    }
  }, [getAssets, runAsyncProcess, activeAddress])

  const tabItems: TabItem[] = [
    { id: 'become-vip', content: 'Become VIP' },
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
      <div>Profile</div>

      <Button shouldDisplaySpinner={state.isRequestPending}>{'profile button'}</Button>
      {
        // TODO: Remove this example
        <Tab items={tabItems}>
          <div>{'Become VIP content'}</div>

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
