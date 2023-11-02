//Use axios to fetch data?

import axios from 'axios'

export class userServices {
  public async fetchUserAssets(walletAddress: string) {
    try {
      const response = await axios.get(`https://mainnet-idx.algonode.cloud/v2/accounts/${walletAddress}/assets`)
      const { data } = response
      const { assets } = data
      return assets
    } catch (error) {
      throw new Error('error fetchin user assets')
    }
  }

  public async fetchUserNfd(walletAddress: string) {
    try {
      const response = await axios.get(`https://api.nf.domains/nfd/v2/address?address=${walletAddress}`)
      const { data } = response
      return data[walletAddress][0].name
    } catch (error) {
      throw new Error('error fetchin user nfd')
    }
  }
}
