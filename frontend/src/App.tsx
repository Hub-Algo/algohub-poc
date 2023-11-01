import { DeflyWalletConnect } from '@blockshake/defly-connect'
import { DaffiWalletConnect } from '@daffiwallet/connect'
import { PeraWalletConnect } from '@perawallet/connect'
import { PROVIDER_ID, ProvidersArray, WalletProvider, useInitializeProviders, useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { useEffect, useState } from 'react'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import ROUTES from './core/routes'
import { CampaignInterface } from './interfaces/campaign-interface'
import { UserInterface } from './interfaces/userInterface'
import About from './pages/About'
import CampaignDetails from './pages/CampaignDetails'
import Home from './pages/Home'
import Profile from './pages/Profile'
import { fetchAllCampaigns } from './services/campaignServices'
import { userServices } from './services/userServices'
import { ellipseAddress } from './utils/ellipseAddress'
import { getAlgodConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'

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

  const fetchCampaigns = async () => {
    const allCampaigns = await fetchAllCampaigns()
    setCampaignList(allCampaigns)
  }

  const fetchAndAppendUserData = async (walletAddress: string) => {
    if (activeAccount) {
      const userAssets = await userService.fetchUserAssets(walletAddress)
      const userNfd = await userService.fetchUserNfd(walletAddress)

      const usdcDecimals = 6
      //Asset needs type
      const usdcBalance = userAssets.filter((asset: { assetId: number }) => asset['asset-id'] === 31566704)[0].amount / 10 ** usdcDecimals

      //Algo decimals is being used just as dummy for now
      const algoDecimals = 6
      const username = userNfd || ellipseAddress(walletAddress)
      setUserData({ wallet_address: activeAccount.address, username, usdc_balance: usdcBalance, algo_balance: 1 * algoDecimals })
    }
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
          <NavBar userData={userData} />
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
      ],
    },
  ])

  return (
    <WalletProvider value={walletProviders}>
      <RouterProvider router={router} />
    </WalletProvider>
  )
}
