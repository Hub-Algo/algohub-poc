import { AssetInterface } from './AssetInterface'
import { CreatedAssetInterface } from './CreatedAssetsInterface'

export interface UserInterface {
  wallet_address: string
  username: string
  usdc_balance: number
  algo_balance: number
  user_assets: AssetInterface[]
  user_created_assets: CreatedAssetInterface[]
}
