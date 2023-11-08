import classNames from 'classnames'
import { TabItem } from '../Tab.types'

type TabHeaderItemProps = {
  tab: TabItem
  isActive: boolean
  index: number
  onClick: (index: number) => void
}

function TabHeaderItem({ tab, isActive, index, onClick }: TabHeaderItemProps) {
  return (
    <a
      id={tab.id}
      tabIndex={index}
      className={classNames('tab text-gray-200', { 'tab-bordered tab-active text-gray-100': isActive })}
      onClick={handleClick}
    >
      {tab.content}
    </a>
  )

  function handleClick() {
    onClick(index)
  }
}

export default TabHeaderItem
