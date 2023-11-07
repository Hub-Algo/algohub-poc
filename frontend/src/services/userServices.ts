//Use axios to fetch data?
import { Provider } from '@txnlab/use-wallet'
import axios from 'axios'

const API_URL = import.meta.env.API_URL

export class userServices {
  async connectWallet(provider: Provider) {
    provider.connect()
  }

  async fetchUserAssets(walletAddress: string) {
    try {
      const response = await axios.get(`https://mainnet-idx.algonode.cloud/v2/accounts/${walletAddress}/assets`)
      const { data } = response
      const { assets } = data
      return assets
    } catch (error) {
      throw new Error('error fetchin user assets')
    }
  }

  async signupUser(walletAddress: string) {
    try {
      const requestData = { wallet_address: walletAddress }
      const innerConfig = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }

      const response = await axios.post(`http://localhost:3000/auth/signin`, requestData, innerConfig)
      const { data } = response
      return data
    } catch (error) {
      throw new Error('Error signing up user')
    }
  }
}
