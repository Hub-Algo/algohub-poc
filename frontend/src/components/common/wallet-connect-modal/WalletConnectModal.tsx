import { Provider, useWallet } from '@txnlab/use-wallet'
import Button from '../button/Button'
import { userServices } from '../../../services/userServices'

interface WalletConnectModalPropsInterface {
  buttonLabel: string
}

const WalletConnectModal = ({ buttonLabel }: WalletConnectModalPropsInterface) => {
  const { providers } = useWallet()

  const userService = new userServices()

  const walletConnectOptionsRenderer = providers?.map((provider) => (
    <Button buttonColor="orange" onClick={() => handleProviderConnectClick(provider)}>
      <div className="flex items-center gap-3">
        <p>{provider.metadata.name}</p>
        <div className="rounded-full overflow-hidden">
          <img className="w-6" src={provider.metadata.icon} />
        </div>
      </div>
    </Button>
  ))

  const id = 'connect-wallet-modal'

  const modalElement = document.getElementById(id) as HTMLDialogElement

  function handleOpenModal() {
    if (modalElement) {
      modalElement.showModal()
    }
  }

  const handleCloseModal = () => {
    modalElement.close()
  }

  const handleProviderConnectClick = (provider: Provider) => {
    userService.connectWallet(provider)
    handleCloseModal()
  }
  return (
    <>
      <Button buttonColor="orange" onClick={handleOpenModal}>
        {buttonLabel}
      </Button>
      <dialog id={id} className="modal">
        <div className="modal-box flex flex-col gap-6 bg-gray-800">
          <button onClick={handleCloseModal} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            x
          </button>
          <h1 className="text-gray-100">Select a wallet to use</h1>
          <div className="flex flex-col gap-3">{walletConnectOptionsRenderer}</div>
        </div>
        <form method="dialog" className="modal-backdrop"></form>
      </dialog>
    </>
  )
}

export default WalletConnectModal
