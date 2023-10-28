import { useWallet } from '@txnlab/use-wallet'
import Dropdown from './common/dropdown/Dropdown'
import { Option } from './common/dropdown/Dropdown.types'

type WalletProfileMenuItem = Option & {
  onSelect: VoidFunction
}

const ConnectDropdown = () => {
  const { providers } = useWallet()

  const walletProfileMenuItems: WalletProfileMenuItem[] =
    providers?.map((provider) => {
      return {
        id: provider.metadata.id,
        content: (
          <div className={'flex justify-between'}>
            <p>{provider.metadata.name}</p>

            <img className="w-6" src={provider.metadata.icon} />
          </div>
        ),
        onSelect: provider.connect,
      }
    }) ?? []

  return (
    <Dropdown
      triggerProps={{
        title: 'Connect Wallet',
        customClassName: 'bg-orange-500 text-gray-100 hover:bg-orange-500 hover:text-gray-100 active:bg-orange-600',
      }}
      options={walletProfileMenuItems}
      onSelect={handleSelect}
    />
  )

  function handleSelect(option: WalletProfileMenuItem) {
    option.onSelect()
  }
}

export default ConnectDropdown
