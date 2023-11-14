import { useState } from 'react'

import { TabItem } from './Tab.types'
import TabHeaderItem from './item/TabHeaderItem'

interface TabProps {
  items: TabItem[]
  children: React.ReactNode[]
}

function Tab({ items, children }: TabProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  return (
    <div className={'w-full bg-gray-950 my-6 h-96'}>
      <div className={'w-full overflow-x-auto'}>
        <div className={'tabs flex-nowrap'}>
          {items.map((item, index) => (
            <TabHeaderItem key={item.id} tab={item} index={index} isActive={activeTabIndex === index} onClick={setActiveTabIndex} />
          ))}
        </div>
      </div>

      <div className="p-6">{children[activeTabIndex]}</div>
    </div>
  )
}

export default Tab
