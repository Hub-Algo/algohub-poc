import { DeflyWalletConnect } from '@blockshake/defly-connect'
import { DaffiWalletConnect } from '@daffiwallet/connect'
import { PeraWalletConnect } from '@perawallet/connect'
import { PROVIDER_ID, ProvidersArray, WalletProvider, useInitializeProviders, useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import ROUTES from './core/routes'
import { getAlgodConfigFromViteEnvironment } from './core/util/network/getAlgoClientConfigs'
import { WindowSizeContextProvider } from './core/window-size/WindowSizeContext'
import { CampaignInterface } from './interfaces/campaign-interface'
import { UserInterface } from './interfaces/userInterface'
import About from './pages/About'
import CampaignDetails from './pages/CampaignDetails'
import Home from './pages/Home'
import Profile from './pages/Profile'
import { fetchAllCampaigns } from './services/campaignServices'
import CampaignApplicationForm from './components/campaign/application-form/CampaignApplicationForm'
import { userServices } from './services/userServices'

export default function App() {
  const [campaignList, setCampaignList] = useState<CampaignInterface[]>([])
  const [userData, setUserData] = useState<UserInterface>()

  const userService = new userServices()

  const { activeAccount } = useWallet()

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
    const userAssets = await userService.fetchUserAssets(walletAddress)

    // const user = await userService.signupUser(walletAddress)
    const usdcDecimals = 6
    //Asset needs type
    const usdcBalance = userAssets.filter((asset: { assetId: number }) => asset['asset-id'] === 31566704)[0].amount / 10 ** usdcDecimals

    const { data } = await axios.get(`https://mainnet-api.algonode.cloud/v2/accounts/${walletAddress}`)

    const username = await userService.fetchUserNfd(walletAddress)

    //Algo decimals is being used just as dummy for now
    const algoDecimals = 6

    const algoBalance = (data.amount / 10 ** algoDecimals).toFixed(2)

    setUserData({
      wallet_address: walletAddress,
      username,
      usdc_balance: Number(usdcBalance.toFixed(2)),
      algo_balance: Number(algoBalance),
    })
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  useEffect(() => {
    if (activeAccount) {
      fetchAndAppendUserData(activeAccount?.address)
    }
    // TODO: Remove this hook once we set fetchAndAppendUserData inside a useCallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <Outlet context={{ activeAccount, campaignList, userData }} />
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
        { path: ROUTES.CAMPAIGN_APPLICATION_FORM.FULL_PATH, element: <CampaignApplicationForm /> },
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
