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
import About from './pages/About'
import CampaignDetails from './pages/CampaignDetails'
import Home from './pages/Home'
import Profile from './pages/Profile'
import { getAlgodConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'
import campaigns from './dummy-data/campaigns.json'
import { CampaignInterface } from './interfaces/campaign-interface'

export default function App() {
  const [campaignList, setCampaignList] = useState<CampaignInterface[]>([])

  let providersArray: ProvidersArray

  if (import.meta.env.VITE_ALGOD_NETWORK === '') {
    providersArray = [{ id: PROVIDER_ID.KMD }]
  } else {
    providersArray = [
      { id: PROVIDER_ID.DEFLY, clientStatic: DeflyWalletConnect },
      { id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect },
      { id: PROVIDER_ID.DAFFI, clientStatic: DaffiWalletConnect },
      { id: PROVIDER_ID.EXODUS },
      // If you are interested in WalletConnect v2 provider
      // refer to https://github.com/TxnLab/use-wallet for detailed integration instructions
    ]
  }

  const fetchCampaigns = async () => {
    // const allCampaigns = await fetchAllCampaigns()
    setCampaignList(campaigns)
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const { activeAccount } = useWallet()

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
          <NavBar />
          <Outlet context={{ activeAccount, campaignList }} />
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
