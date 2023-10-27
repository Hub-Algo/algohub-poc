import { DeflyWalletConnect } from '@blockshake/defly-connect'
import { DaffiWalletConnect } from '@daffiwallet/connect'
import { PeraWalletConnect } from '@perawallet/connect'
import { PROVIDER_ID, ProvidersArray, WalletProvider, useInitializeProviders, useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import NavBar from './components/NavBar'
import ROUTES from './core/routes'
import About from './pages/About'
import Home from './pages/Home'
import Profile from './pages/Profile'
import { getAlgodConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'

export default function App() {
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
            <Outlet context={activeAccount} />
          </>
        ),

        children: [
          { path: ROUTES.BASE, element: <Home /> },
          {
            path: ROUTES.PROFILE.FULL_PATH,
            element: <Profile />,
          },
          { path: ROUTES.PROJECT_DETAIL.FULL_PATH, element: <div>Details</div> },
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
}
