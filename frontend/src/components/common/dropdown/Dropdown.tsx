import classNames from 'classnames'
import { Option } from './Dropdown.types'
import DropdownItem from './item/DropdownItem'

interface DropdownProps<DropdownItem extends Option = Option> {
  triggerProps: { title: string; customClassName?: string }
  options: DropdownItem[]
  onSelect: (option: DropdownItem) => void
  customClassName?: string
}

function Dropdown<DropdownItem extends Option = Option>(props: DropdownProps<DropdownItem>) {
  const { triggerProps, options, onSelect, customClassName } = props

  return (
    <details className={classNames('dropdown', customClassName)}>
      <summary className={classNames('btn font-bold rounded-md content-center', triggerProps.customClassName)}>
        {triggerProps.title}
      </summary>

      <ul className={'dropdown-content w-full'}>{renderContent()}</ul>
    </details>
  )

  function renderContent() {
    return options.map((option) => <DropdownItem key={option.id} onSelect={onSelect} option={option} />)
  }
}

export default Dropdown
