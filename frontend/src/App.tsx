import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { AppDetails } from '@algorandfoundation/algokit-utils/types/app-client'
import { DeflyWalletConnect } from '@blockshake/defly-connect'
import { DaffiWalletConnect } from '@daffiwallet/connect'
import { PeraWalletConnect } from '@perawallet/connect'
import { Account, PROVIDER_ID, ProvidersArray, WalletProvider, useInitializeProviders, useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import { AlgohubClient } from './contracts/AlgohubClient'
import algod from './core/algosdk/AlgodManager'
import ROUTES from './core/routes'
import { USDC_ASSET } from './core/util/asset/usdcConstants'
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
import { CampaignObj, fetchAllCampaignIds, fetchCampaignDetails } from './services/campaignServices'
import { userService } from './services/userServices'

export interface AppState {
  activeAccount?: Account | null
  campaignList: CampaignObj[]
  userData?: UserInterface
  algohubClient: AlgohubClient | undefined
  fetchAndAppendUserData: (walletAddress: string) => Promise<void>
}

export default function App() {
  const [campaignList, setCampaignList] = useState<CampaignObj[]>([])
  const [userData, setUserData] = useState<UserInterface>()
  const [algohubClient, setAlgohubClient] = useState<AlgohubClient>()
  const { activeAccount, signer, activeAddress } = useWallet()

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

  const resetUserData = useCallback(() => {
    setUserData(undefined)
  }, [])

  const fetchAndAppendUserData = useCallback(async (walletAddress: string) => {
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
  }, [])

  const fetchCampaigns = useCallback(async () => {
    const allCampaignIds = await fetchAllCampaignIds(algohubClient)
    const allCampaigns: CampaignObj[] = []
    for (let i = 0; i < allCampaignIds.length; i++) {
      const campaigndetails = await fetchCampaignDetails(Number(allCampaignIds[i]), algod.client)
      allCampaigns.push(campaigndetails)
      setCampaignList(allCampaigns)
    }
  }, [algohubClient])

  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns, activeAccount, algohubClient])

  useEffect(() => {
    const algohubClientAppDetails: AppDetails = {
      resolveBy: 'id',
      id: 479564984,
      sender: activeAddress ? ({ signer, addr: activeAddress } as TransactionSignerAccount) : undefined,
    }

    setAlgohubClient(new AlgohubClient(algohubClientAppDetails, algod.client))
    if (activeAccount) {
      fetchAndAppendUserData(activeAccount?.address)
    }
  }, [activeAccount, activeAddress, fetchAndAppendUserData])

  const router = createBrowserRouter([
    {
      element: (
        <>
          <NavBar userData={userData} resetUserData={resetUserData} providerId={activeAccount?.providerId} />
          <Outlet context={{ activeAccount, campaignList, userData, algohubClient, fetchAndAppendUserData } satisfies AppState} />
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
