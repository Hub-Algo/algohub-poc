import PageContainer from '../components/PageContainer'
import Tab from '../components/common/tab/Tab'
import { TabItem } from '../components/common/tab/Tab.types'

export default function Profile() {
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

      {
        // TODO: Remove this example
        <Tab items={tabItems}>
          <div>{'Become VIP content'}</div>

          <div>{'Voting History content'}</div>

          <div>{'Details'}</div>

          <div>{'Settings'}</div>
        </Tab>
      }
    </PageContainer>
  )
}
