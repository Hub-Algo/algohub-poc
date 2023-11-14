interface AssetParams {
  clawback: string
  creator: string
  decimals: number
  'default-frozen': boolean
  freeze: string
  manager: string
  name: string
  'name-b64': string
  reserve: string
  total: number
  'unit-name': string
  'unit-name-b64': string
}

export interface AssetInfoInterface {
  'created-at-round': number
  deleted: boolean
  index: number
  params: AssetParams
}
