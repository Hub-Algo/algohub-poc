import axios from 'axios'

export class AssetServices {
  async getAssetInformation(assetId: number) {
    const { data } = await axios.get(`https://testnet-idx.algonode.cloud/v2/assets/${assetId}`)

    const { asset } = data
    return data

    console.log('assetData', data)
  }
}
