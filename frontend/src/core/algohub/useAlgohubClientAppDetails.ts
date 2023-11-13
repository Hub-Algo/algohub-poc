import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { useWallet } from '@txnlab/use-wallet'
import { useEffect, useState } from 'react'
import { AppDetails } from '@algorandfoundation/algokit-utils/types/app-client'

function useAlgohubClientAppDetails() {
  const [appDetails, setAppDetails] = useState<AppDetails>()
  const { signer, activeAddress } = useWallet()

  useEffect(() => {
    if (activeAddress) {
      setAppDetails({
        resolveBy: 'id',
        id: 478556883,
        sender: { signer, addr: activeAddress } as TransactionSignerAccount,
      })
    }
  }, [activeAddress, signer])

  return appDetails
}

export default useAlgohubClientAppDetails
