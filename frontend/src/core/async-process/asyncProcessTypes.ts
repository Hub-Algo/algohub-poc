/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AsyncProcessState<Data = any, Payload = any> {
  isRequestPending: boolean
  isRequestFetched: boolean
  data: Data | null
  error: Error | null
  requestPayload?: Payload
}

export interface UseAsyncProcessOptions<Data = any> {
  initialState?: AsyncProcessState<Data>
  shouldResetDataWhenPending?: boolean
}

export type AsyncProcessCallBack<Data> = <Response extends Data>(
  promise: Promise<Response>,
  options?: {
    forceResetPreviousAsyncState?: boolean
    responseSerializer?: (response: Response) => Data
  },
) => Promise<Response>

export type AsyncStateSetter<Data> = React.Dispatch<React.SetStateAction<AsyncProcessState<Data, any>>>
