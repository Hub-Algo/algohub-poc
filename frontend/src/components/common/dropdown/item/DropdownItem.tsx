import { Option } from '../Dropdown.types'

interface DropdownItemProps<DropdownItem extends Option = Option> {
  option: DropdownItem
  onSelect: (option: DropdownItem) => void
}

function DropdownItem<DropdownItem extends Option = Option>({ option, onSelect }: DropdownItemProps<DropdownItem>) {
  return (
    <li className={'flex'} onClick={handleClick}>
      {typeof option.content === 'string' ? <p>{option?.content}</p> : option.content}
    </li>
  )

  function handleClick() {
    onSelect(option)
  }
}

export default DropdownItem
