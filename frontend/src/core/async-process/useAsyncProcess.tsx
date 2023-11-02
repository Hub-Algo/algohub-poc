import { useCallback, useRef, useState } from 'react'

import { AsyncProcessCallBack, AsyncProcessState, AsyncStateSetter, UseAsyncProcessOptions } from './asyncProcessTypes'
import { INITIAL_ASYNC_PROCESS_STATE } from './asyncProcessConstants'
import useOnUnmount from '../util/hook/useOnUnmount'

export interface AsyncProcessReturnType<Data> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: AsyncProcessState<Data, any>
  setState: AsyncStateSetter<Data>
  runAsyncProcess: AsyncProcessCallBack<Data>
}

function useAsyncProcess<Data>(options?: UseAsyncProcessOptions<Data>): AsyncProcessReturnType<Data> {
  const { initialState, shouldResetDataWhenPending = true } = options || {}
  const [asyncState, setAsyncState] = useState<AsyncProcessState<Data>>(initialState || INITIAL_ASYNC_PROCESS_STATE)
  const latestDataRef = useRef(asyncState.data)
  const isUnmountedRef = useRef(false)
  const asyncStateSetter = useCallback<AsyncStateSetter<Data>>(
    (state) => (isUnmountedRef.current ? () => undefined : setAsyncState(state)),
    [],
  )

  const runAsyncProcess: AsyncProcessCallBack<Data> = useCallback(
    (promise, asyncCallbackOptions) => {
      const shouldReset =
        typeof asyncCallbackOptions?.forceResetPreviousAsyncState === 'boolean'
          ? asyncCallbackOptions.forceResetPreviousAsyncState
          : shouldResetDataWhenPending

      asyncStateSetter({
        isRequestPending: true,
        isRequestFetched: !shouldReset,
        data: shouldReset ? null : latestDataRef.current,
        error: null,
      })

      promise
        .then((response) => {
          asyncStateSetter({
            isRequestPending: false,
            isRequestFetched: true,
            data: asyncCallbackOptions?.responseSerializer ? asyncCallbackOptions.responseSerializer(response) : response,
            error: null,
          })

          latestDataRef.current = asyncCallbackOptions?.responseSerializer ? asyncCallbackOptions.responseSerializer(response) : response
        })
        .catch((error) => {
          asyncStateSetter({
            isRequestPending: false,
            isRequestFetched: true,
            data: null,
            error,
          })

          latestDataRef.current = null
        })

      return promise
    },
    [asyncStateSetter, shouldResetDataWhenPending],
  )

  useOnUnmount(() => {
    isUnmountedRef.current = true
  })

  return {
    state: asyncState,
    setState: asyncStateSetter,
    runAsyncProcess,
  }
}

export default useAsyncProcess
