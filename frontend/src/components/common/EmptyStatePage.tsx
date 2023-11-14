import WalletConnectModal from './wallet-connect-modal/WalletConnectModal'

const EmptyStatePage = () => {
  return (
    <div className="h-screen text-3xl text-gray-400 w-full flex flex-col justify-center text-center items-center gap-6">
      Connect your wallet in order to use this functionality
      <WalletConnectModal buttonLabel="Connect Wallet" />
    </div>
  )
}

export default EmptyStatePage
