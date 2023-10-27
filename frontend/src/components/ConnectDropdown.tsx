import { useWallet } from '@txnlab/use-wallet'

const ConnectDropdown = () => {
  const { providers } = useWallet()

  const walletProvidersRenderer = providers?.map((provider) => (
    <li key={provider.metadata.name}>
      <button onClick={provider.connect} className="flex justify-between">
        <p>{provider.metadata.name}</p>
        <img className="w-6" src={provider.metadata.icon} />
      </button>
    </li>
  ))

  //--------------------------------------------------------------------------
  return (
    <details>
      <summary className="bg-orange-500 text-gray-100 hover:bg-orange-500 hover:text-gray-100 active:bg-orange-600 font-bold">
        Connect Wallet
      </summary>
      <ul className="p-2 bg-base-300 w-36">{walletProvidersRenderer}</ul>
    </details>
  )
  //--------------------------------------------------------------------------
}

export default ConnectDropdown
