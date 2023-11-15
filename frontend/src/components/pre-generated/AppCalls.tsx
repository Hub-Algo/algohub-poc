import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { AppDetails } from '@algorandfoundation/algokit-utils/types/app-client'
import { useWallet } from '@txnlab/use-wallet'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { AlgohubClient } from '../../contracts/AlgohubClient'
import { CampaignClient } from '../../contracts/CampaignClient'
import algod from '../../core/algosdk/AlgodManager'
import AlgohubGetTotalVoters from '../algohub-pre-generated/AlgohubGetTotalVoters'

interface AppCallsInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const AppCalls = ({ openModal, setModalState }: AppCallsInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [contractInput, setContractInput] = useState<string>('')

  const { signer, activeAddress } = useWallet()

  const appDetails = {
    resolveBy: 'id',
    id: 478556883,
    sender: { signer, addr: activeAddress } as TransactionSignerAccount,
    creatorAddress: activeAddress,
    findExistingUsing: algod.indexer,
  } as AppDetails

  const campaignClient = new CampaignClient(appDetails, algod.client)
  const algohubClient = new AlgohubClient(appDetails, algod.client)

  const { enqueueSnackbar } = useSnackbar()

  const sendAppCall = async () => {
    setLoading(true)

    // Please note, in typical production scenarios,
    // you wouldn't want to use deploy directly from your frontend.
    // Instead, you would deploy your contract on your backend and reference it by id.
    // Given the simplicity of the starter contract, we are deploying it on the frontend
    // for demonstration purposes.
    // const isLocal = await algokit.isLocalNet(algodClient)
    // const deployParams = {
    //   allowDelete: isLocal,
    //   allowUpdate: isLocal,
    //   onSchemaBreak: isLocal ? 'replace' : 'fail',
    //   onUpdate: isLocal ? 'update' : 'fail',
    // }
    // await appClient.deploy(deployParams).catch((e: Error) => {
    //   enqueueSnackbar(`Error deploying the contract: ${e.message}`, { variant: 'error' })
    //   setLoading(false)
    //   return
    // })

    const campaignResponse = await campaignClient.getCampaign({}).catch((e: Error) => {
      enqueueSnackbar(`Error calling the contract: ${e.message}`, { variant: 'error' })
      setLoading(false)
      return
    })

    const algohubResponse = await algohubClient.getAllCampaignApps({}).catch((e: Error) => {
      console.log(`Error calling the contract: ${e.message}`, { variant: 'error' })
      setLoading(false)
      return e
    })

    enqueueSnackbar(`Response from the campaign contract. Campaign Details: ${campaignResponse?.return}`, { variant: 'success' })
    console.log(`Response from the algohub master contract. All Campaigns: ${algohubResponse}`, { variant: 'success' })
    setLoading(false)
  }

  return (
    <dialog id="appcalls_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Say hello to your Algorand smart contract</h3>
        <br />
        <input
          type="text"
          placeholder="Provide input to hello function"
          className="input input-bordered w-full"
          value={contractInput}
          onChange={(e) => {
            setContractInput(e.target.value)
          }}
        />
        <AlgohubGetTotalVoters
          buttonClass="btn m-2"
          buttonLoadingNode={<span className="loading loading-spinner" />}
          buttonNode="Call getTotalVoters"
          typedClient={algohubClient}
        />

        <div className="modal-action ">
          <button className="btn" onClick={() => setModalState(false)}>
            Close
          </button>
          <button className={`btn`} onClick={sendAppCall}>
            {loading ? <span className="loading loading-spinner" /> : 'Send application call'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default AppCalls
