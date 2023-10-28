import classNames from 'classnames'
import { Option } from './Dropdown.types'
import DropdownItem from './item/DropdownItem'

interface DropdownProps<DropdownItem extends Option = Option> {
  triggerProps: { title: string; customClassName?: string }
  options: DropdownItem[]
  onSelect: (option: DropdownItem) => void
  customClassName?: string
}

function Dropdown<DropdownItem extends Option = Option>({ triggerProps, options, onSelect, customClassName }: DropdownProps<DropdownItem>) {
  function renderContent() {
    return options.map((option) => <DropdownItem key={option.id} onSelect={onSelect} option={option} />)
  }

  return (
    <details className={classNames('dropdown', customClassName)}>
      <summary className={classNames('btn btn-sm rounded-md content-center w-full border-none', triggerProps.customClassName)}>
        {triggerProps.title}
      </summary>
      <ul className={'dropdown-content w-full bg-gray-950'}>{renderContent()}</ul>
    </details>
  )
}

export default Dropdown
