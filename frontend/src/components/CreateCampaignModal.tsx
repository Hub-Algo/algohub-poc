import { useWallet } from '@txnlab/use-wallet'
import ConnectDropdown from './ConnectDropdown'
import Modal from './common/modal/Modal'

const CreateCampaignModal = () => {
  const { activeAccount } = useWallet()

  const renderContent = () => {
    return <div>aaaaaa</div>
  }

  return (
    <Modal id={'vote-modal'} modalButtonName={'test'}>
      {activeAccount ? (
        renderContent()
      ) : (
        <div className="h-44 flex flex-col gap-10 text-center">
          <h1 className="text-lg font-bold">Connect your wallet to invest on this project</h1>
          <ConnectDropdown />
        </div>
      )}
    </Modal>
  )
}

export default CreateCampaignModal
