import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { AppDetails } from '@algorandfoundation/algokit-utils/types/app-client'
import { DeflyWalletConnect } from '@blockshake/defly-connect'
import { DaffiWalletConnect } from '@daffiwallet/connect'
import { PeraWalletConnect } from '@perawallet/connect'
import { Account, PROVIDER_ID, ProvidersArray, WalletProvider, useInitializeProviders, useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import { AlgohubClient } from './contracts/AlgohubClient'
import algod from './core/algosdk/AlgodManager'
import ROUTES from './core/routes'
import { USDC_ASSET } from './core/util/asset/AssetConstants'
import { getAlgodConfigFromViteEnvironment } from './core/util/network/getAlgoClientConfigs'
import { convertFromBaseUnits } from './core/util/transaction/transactionUtils'
import { WindowSizeContextProvider } from './core/window-size/WindowSizeContext'
import { UserInterface } from './interfaces/userInterface'
import About from './pages/About'
import AllCampaigns from './pages/AllCampaigns'
import CampaignDetails from './pages/CampaignDetails'
import Home from './pages/Home'
import Profile from './pages/Profile'
import { CampaignApplicationContextProvider } from './pages/campaign-application/CampaignApplication.context'
import { fetchAllCampaigns } from './services/campaignServices'
import { userServices } from './services/userServices'
import { NewCampaignInterface } from './interfaces/new-campaign-interface'

export interface AppState {
  activeAccount?: Account | null
  campaignList: NewCampaignInterface[]
  userData?: UserInterface
  algohubClient: AlgohubClient | null
}

export default function App() {
  const [campaignList, setCampaignList] = useState<NewCampaignInterface[]>([])
  const [userData, setUserData] = useState<UserInterface>()
  const { activeAccount, signer, activeAddress } = useWallet()

  const algohubClientAppDetails: AppDetails = {
    resolveBy: 'id',
    id: 479483526,
    sender: { signer, addr: activeAddress } as TransactionSignerAccount,
  }

  const algohubClient = activeAddress ? new AlgohubClient(algohubClientAppDetails, algod.client) : null
  const userService = new userServices()

  let providersArray: ProvidersArray

  if (import.meta.env.VITE_ALGOD_NETWORK === '') {
    providersArray = [{ id: PROVIDER_ID.KMD }]
  } else {
    providersArray = [
      { id: PROVIDER_ID.DEFLY, clientStatic: DeflyWalletConnect },
      { id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect },
      { id: PROVIDER_ID.DAFFI, clientStatic: DaffiWalletConnect },
    ]
  }

  const resetUserData = () => {
    setUserData(undefined)
  }

  const fetchCampaigns = async () => {
    const allCampaigns = await fetchAllCampaigns()
    setCampaignList(allCampaigns)
  }

  const fetchAndAppendUserData = async (walletAddress: string) => {
    const userAssets = (await userService.fetchUserAssets(walletAddress)).assets

    const userCreatedAssets = (await userService.fetchUserAssets(walletAddress)).created_assets

    const usdcBalance = convertFromBaseUnits(
      USDC_ASSET.decimals,
      Number(userAssets?.find((asset) => asset['asset-id'] === USDC_ASSET.id)?.amount ?? 0),
    )

    const { data } = await axios.get(`https://mainnet-api.algonode.cloud/v2/accounts/${walletAddress}`)

    const username = await userService.fetchUserNfd(walletAddress)

    //Algo decimals is being used just as dummy for now
    const algoDecimals = 6

    const algoBalance = (data.amount / 10 ** algoDecimals).toFixed(2)

    setUserData({
      wallet_address: walletAddress,
      username,
      usdc_balance: usdcBalance ? Number(usdcBalance.toFixed(2)) : 0,
      algo_balance: Number(algoBalance),
      user_assets: userAssets,
      user_created_assets: userCreatedAssets,
    })
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  useEffect(() => {
    if (activeAccount) {
      fetchAndAppendUserData(activeAccount?.address)
    }
  }, [activeAccount])

  const algodConfig = getAlgodConfigFromViteEnvironment()

  const walletProviders = useInitializeProviders({
    providers: providersArray,
    nodeConfig: {
      network: algodConfig.network,
      nodeServer: algodConfig.server,
      nodePort: String(algodConfig.port),
      nodeToken: String(algodConfig.token),
    },
    algosdkStatic: algosdk,
  })

  const router = createBrowserRouter([
    {
      element: (
        <>
          <NavBar userData={userData} resetUserData={resetUserData} />
          <Outlet context={{ activeAccount, campaignList, userData, algohubClient } satisfies AppState} />
          <Footer />
        </>
      ),

      children: [
        { path: ROUTES.BASE, element: <Home /> },
        {
          path: ROUTES.PROFILE.FULL_PATH,
          element: <Profile />,
        },
        { path: ROUTES.PROJECT_DETAIL.FULL_PATH, element: <CampaignDetails /> },
        { path: ROUTES.ABOUT.FULL_PATH, element: <About /> },
        { path: ROUTES.CAMPAIGN_APPLICATION_FORM.FULL_PATH, element: <CampaignApplicationContextProvider /> },
        { path: ROUTES.ALL_CAMPAIGNS.FULL_PATH, element: <AllCampaigns /> },
      ],
    },
  ])

  return (
    <WalletProvider value={walletProviders}>
      <WindowSizeContextProvider>
        <RouterProvider router={router} />
      </WindowSizeContextProvider>
    </WalletProvider>
  )
}
