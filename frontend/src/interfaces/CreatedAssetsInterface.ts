export interface CreatedAssetInterface {
  'created-at-round'?: number
  deleted?: boolean
  index?: number
  params?: {
    clawback?: string
    creator?: string
    decimals?: number
    'default-frozen'?: boolean
    freeze?: string
    manager?: string
    name?: string
    'name-b64'?: string
    reserve?: string
    total?: number
    'unit-name'?: string
    'unit-name-b64'?: string
  }
}
