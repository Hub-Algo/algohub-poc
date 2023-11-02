export interface AccountAsset {
  amount: number
  'asset-id': number
  creator: string
  'is-frozen': boolean
}

export interface AccountInformation {
  address: string
  amount: number
  'amount-without-pending-rewards': number
  'apps-local-state': {
    id: number
    'key-value'?: {
      key: string
      value: {
        type: 1 | 2
        bytes: string
        uint: number
      }
    }[]
    schema: {
      'num-byte-slice': number
      'num-uint': number
    }
  }[]
  'apps-total-schema': {
    'num-byte-slice': number
    'num-uint': number
  }
  assets: AccountAsset[]
  'created-apps': unknown[]
  'created-assets': Omit<AccountAsset, 'asset-id'> &
    {
      index: number
    }[]
  'pending-rewards': number
  'reward-base': number
  rewards: number
  round: number
  status: 'Offline'
}
