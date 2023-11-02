/* eslint-disable */
/**
 * This file was automatically generated by @algorandfoundation/algokit-client-generator.
 * DO NOT MODIFY IT BY HAND.
 * requires: @algorandfoundation/algokit-utils: ^2
 */
import * as algokit from '@algorandfoundation/algokit-utils'
import type {
  AppCallTransactionResult,
  AppCallTransactionResultOfType,
  CoreAppCallArgs,
  RawAppCallArgs,
  TealTemplateParams,
  ABIAppCallArg,
} from '@algorandfoundation/algokit-utils/types/app'
import type {
  AppClientCallCoreParams,
  AppClientCompilationParams,
  AppClientDeployCoreParams,
  AppDetails,
  ApplicationClient,
} from '@algorandfoundation/algokit-utils/types/app-client'
import type { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import type { SendTransactionResult, TransactionToSign, SendTransactionFrom } from '@algorandfoundation/algokit-utils/types/transaction'
import type { TransactionWithSigner } from 'algosdk'
import { Algodv2, OnApplicationComplete, Transaction, AtomicTransactionComposer } from 'algosdk'
export const APP_SPEC: AppSpec = {
  hints: {
    'hello(string)string': {
      call_config: {
        no_op: 'CALL',
      },
    },
  },
  source: {
    approval:
      'I3ByYWdtYSB2ZXJzaW9uIDgKaW50Y2Jsb2NrIDAgMQpieXRlY2Jsb2NrIDB4CnR4biBOdW1BcHBBcmdzCmludGNfMCAvLyAwCj09CmJueiBtYWluX2w0CnR4bmEgQXBwbGljYXRpb25BcmdzIDAKcHVzaGJ5dGVzIDB4MDJiZWNlMTEgLy8gImhlbGxvKHN0cmluZylzdHJpbmciCj09CmJueiBtYWluX2wzCmVycgptYWluX2wzOgp0eG4gT25Db21wbGV0aW9uCmludGNfMCAvLyBOb09wCj09CnR4biBBcHBsaWNhdGlvbklECmludGNfMCAvLyAwCiE9CiYmCmFzc2VydApjYWxsc3ViIGhlbGxvY2FzdGVyXzMKaW50Y18xIC8vIDEKcmV0dXJuCm1haW5fbDQ6CnR4biBPbkNvbXBsZXRpb24KaW50Y18wIC8vIE5vT3AKPT0KYm56IG1haW5fbDEwCnR4biBPbkNvbXBsZXRpb24KcHVzaGludCA0IC8vIFVwZGF0ZUFwcGxpY2F0aW9uCj09CmJueiBtYWluX2w5CnR4biBPbkNvbXBsZXRpb24KcHVzaGludCA1IC8vIERlbGV0ZUFwcGxpY2F0aW9uCj09CmJueiBtYWluX2w4CmVycgptYWluX2w4Ogp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAohPQphc3NlcnQKY2FsbHN1YiBkZWxldGVfMQppbnRjXzEgLy8gMQpyZXR1cm4KbWFpbl9sOToKdHhuIEFwcGxpY2F0aW9uSUQKaW50Y18wIC8vIDAKIT0KYXNzZXJ0CmNhbGxzdWIgdXBkYXRlXzAKaW50Y18xIC8vIDEKcmV0dXJuCm1haW5fbDEwOgp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAo9PQphc3NlcnQKaW50Y18xIC8vIDEKcmV0dXJuCgovLyB1cGRhdGUKdXBkYXRlXzA6CnByb3RvIDAgMAp0eG4gU2VuZGVyCmdsb2JhbCBDcmVhdG9yQWRkcmVzcwo9PQovLyB1bmF1dGhvcml6ZWQKYXNzZXJ0CnB1c2hpbnQgVE1QTF9VUERBVEFCTEUgLy8gVE1QTF9VUERBVEFCTEUKLy8gQ2hlY2sgYXBwIGlzIHVwZGF0YWJsZQphc3NlcnQKcmV0c3ViCgovLyBkZWxldGUKZGVsZXRlXzE6CnByb3RvIDAgMAp0eG4gU2VuZGVyCmdsb2JhbCBDcmVhdG9yQWRkcmVzcwo9PQovLyB1bmF1dGhvcml6ZWQKYXNzZXJ0CnB1c2hpbnQgVE1QTF9ERUxFVEFCTEUgLy8gVE1QTF9ERUxFVEFCTEUKLy8gQ2hlY2sgYXBwIGlzIGRlbGV0YWJsZQphc3NlcnQKcmV0c3ViCgovLyBoZWxsbwpoZWxsb18yOgpwcm90byAxIDEKYnl0ZWNfMCAvLyAiIgpwdXNoYnl0ZXMgMHg0ODY1NmM2YzZmMmMyMCAvLyAiSGVsbG8sICIKZnJhbWVfZGlnIC0xCmV4dHJhY3QgMiAwCmNvbmNhdApmcmFtZV9idXJ5IDAKZnJhbWVfZGlnIDAKbGVuCml0b2IKZXh0cmFjdCA2IDAKZnJhbWVfZGlnIDAKY29uY2F0CmZyYW1lX2J1cnkgMApyZXRzdWIKCi8vIGhlbGxvX2Nhc3RlcgpoZWxsb2Nhc3Rlcl8zOgpwcm90byAwIDAKYnl0ZWNfMCAvLyAiIgpkdXAKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQpmcmFtZV9idXJ5IDEKZnJhbWVfZGlnIDEKY2FsbHN1YiBoZWxsb18yCmZyYW1lX2J1cnkgMApwdXNoYnl0ZXMgMHgxNTFmN2M3NSAvLyAweDE1MWY3Yzc1CmZyYW1lX2RpZyAwCmNvbmNhdApsb2cKcmV0c3Vi',
    clear: 'I3ByYWdtYSB2ZXJzaW9uIDgKcHVzaGludCAwIC8vIDAKcmV0dXJu',
  },
  state: {
    global: {
      num_byte_slices: 0,
      num_uints: 0,
    },
    local: {
      num_byte_slices: 0,
      num_uints: 0,
    },
  },
  schema: {
    global: {
      declared: {},
      reserved: {},
    },
    local: {
      declared: {},
      reserved: {},
    },
  },
  contract: {
    name: 'hello_world',
    methods: [
      {
        name: 'hello',
        args: [
          {
            type: 'string',
            name: 'name',
          },
        ],
        returns: {
          type: 'string',
        },
      },
    ],
    networks: {},
  },
  bare_call_config: {
    delete_application: 'CALL',
    no_op: 'CREATE',
    update_application: 'CALL',
  },
}

/**
 * Defines an onCompletionAction of 'no_op'
 */
export type OnCompleteNoOp = { onCompleteAction?: 'no_op' | OnApplicationComplete.NoOpOC }
/**
 * Defines an onCompletionAction of 'opt_in'
 */
export type OnCompleteOptIn = { onCompleteAction: 'opt_in' | OnApplicationComplete.OptInOC }
/**
 * Defines an onCompletionAction of 'close_out'
 */
export type OnCompleteCloseOut = { onCompleteAction: 'close_out' | OnApplicationComplete.CloseOutOC }
/**
 * Defines an onCompletionAction of 'delete_application'
 */
export type OnCompleteDelApp = { onCompleteAction: 'delete_application' | OnApplicationComplete.DeleteApplicationOC }
/**
 * Defines an onCompletionAction of 'update_application'
 */
export type OnCompleteUpdApp = { onCompleteAction: 'update_application' | OnApplicationComplete.UpdateApplicationOC }
/**
 * A state record containing a single unsigned integer
 */
export type IntegerState = {
  /**
   * Gets the state value as a BigInt
   */
  asBigInt(): bigint
  /**
   * Gets the state value as a number.
   */
  asNumber(): number
}
/**
 * A state record containing binary data
 */
export type BinaryState = {
  /**
   * Gets the state value as a Uint8Array
   */
  asByteArray(): Uint8Array
  /**
   * Gets the state value as a string
   */
  asString(): string
}

/**
 * Defines the types of available calls and state of the HelloWorld smart contract.
 */
export type HelloWorld = {
  /**
   * Maps method signatures / names to their argument and return types.
   */
  methods: Record<
    'hello(string)string' | 'hello',
    {
      argsObj: {
        name: string
      }
      argsTuple: [name: string]
      returns: string
    }
  >
}
/**
 * Defines the possible abi call signatures
 */
export type HelloWorldSig = keyof HelloWorld['methods']
/**
 * Defines an object containing all relevant parameters for a single call to the contract. Where TSignature is undefined, a bare call is made
 */
export type TypedCallParams<TSignature extends HelloWorldSig | undefined> = {
  method: TSignature
  methodArgs: TSignature extends undefined ? undefined : Array<ABIAppCallArg | undefined>
} & AppClientCallCoreParams &
  CoreAppCallArgs
/**
 * Defines the arguments required for a bare call
 */
export type BareCallArgs = Omit<RawAppCallArgs, keyof CoreAppCallArgs>
/**
 * Maps a method signature from the HelloWorld smart contract to the method's arguments in either tuple of struct form
 */
export type MethodArgs<TSignature extends HelloWorldSig> = HelloWorld['methods'][TSignature]['argsObj' | 'argsTuple']
/**
 * Maps a method signature from the HelloWorld smart contract to the method's return type
 */
export type MethodReturn<TSignature extends HelloWorldSig> = HelloWorld['methods'][TSignature]['returns']

/**
 * A factory for available 'create' calls
 */
export type HelloWorldCreateCalls = (typeof HelloWorldCallFactory)['create']
/**
 * Defines supported create methods for this smart contract
 */
export type HelloWorldCreateCallParams = TypedCallParams<undefined> & OnCompleteNoOp
/**
 * A factory for available 'update' calls
 */
export type HelloWorldUpdateCalls = (typeof HelloWorldCallFactory)['update']
/**
 * Defines supported update methods for this smart contract
 */
export type HelloWorldUpdateCallParams = TypedCallParams<undefined>
/**
 * A factory for available 'delete' calls
 */
export type HelloWorldDeleteCalls = (typeof HelloWorldCallFactory)['delete']
/**
 * Defines supported delete methods for this smart contract
 */
export type HelloWorldDeleteCallParams = TypedCallParams<undefined>
/**
 * Defines arguments required for the deploy method.
 */
export type HelloWorldDeployArgs = {
  deployTimeParams?: TealTemplateParams
  /**
   * A delegate which takes a create call factory and returns the create call params for this smart contract
   */
  createCall?: (callFactory: HelloWorldCreateCalls) => HelloWorldCreateCallParams
  /**
   * A delegate which takes a update call factory and returns the update call params for this smart contract
   */
  updateCall?: (callFactory: HelloWorldUpdateCalls) => HelloWorldUpdateCallParams
  /**
   * A delegate which takes a delete call factory and returns the delete call params for this smart contract
   */
  deleteCall?: (callFactory: HelloWorldDeleteCalls) => HelloWorldDeleteCallParams
}

/**
 * Exposes methods for constructing all available smart contract calls
 */
export abstract class HelloWorldCallFactory {
  /**
   * Gets available create call factories
   */
  static get create() {
    return {
      /**
       * Constructs a create call for the hello_world smart contract using a bare call
       *
       * @param params Any parameters for the call
       * @returns A TypedCallParams object for the call
       */
      bare(params: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs & AppClientCompilationParams & OnCompleteNoOp = {}) {
        return {
          method: undefined,
          methodArgs: undefined,
          ...params,
        }
      },
    }
  }

  /**
   * Gets available update call factories
   */
  static get update() {
    return {
      /**
       * Constructs an update call for the hello_world smart contract using a bare call
       *
       * @param params Any parameters for the call
       * @returns A TypedCallParams object for the call
       */
      bare(params: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs & AppClientCompilationParams = {}) {
        return {
          method: undefined,
          methodArgs: undefined,
          ...params,
        }
      },
    }
  }

  /**
   * Gets available delete call factories
   */
  static get delete() {
    return {
      /**
       * Constructs a delete call for the hello_world smart contract using a bare call
       *
       * @param params Any parameters for the call
       * @returns A TypedCallParams object for the call
       */
      bare(params: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs = {}) {
        return {
          method: undefined,
          methodArgs: undefined,
          ...params,
        }
      },
    }
  }

  /**
   * Constructs a no op call for the hello(string)string ABI method
   *
   * @param args Any args for the contract call
   * @param params Any additional parameters for the call
   * @returns A TypedCallParams object for the call
   */
  static hello(args: MethodArgs<'hello(string)string'>, params: AppClientCallCoreParams & CoreAppCallArgs) {
    return {
      method: 'hello(string)string' as const,
      methodArgs: Array.isArray(args) ? args : [args.name],
      ...params,
    }
  }
}

/**
 * A client to make calls to the hello_world smart contract
 */
export class HelloWorldClient {
  /**
   * The underlying `ApplicationClient` for when you want to have more flexibility
   */
  public readonly appClient: ApplicationClient

  private readonly sender: SendTransactionFrom | undefined

  /**
   * Creates a new instance of `HelloWorldClient`
   *
   * @param appDetails appDetails The details to identify the app to deploy
   * @param algod An algod client instance
   */
  constructor(
    appDetails: AppDetails,
    private algod: Algodv2,
  ) {
    this.sender = appDetails.sender
    this.appClient = algokit.getAppClient(
      {
        ...appDetails,
        app: APP_SPEC,
      },
      algod,
    )
  }

  /**
   * Checks for decode errors on the AppCallTransactionResult and maps the return value to the specified generic type
   *
   * @param result The AppCallTransactionResult to be mapped
   * @param returnValueFormatter An optional delegate to format the return value if required
   * @returns The smart contract response with an updated return value
   */
  protected mapReturnValue<TReturn>(
    result: AppCallTransactionResult,
    returnValueFormatter?: (value: any) => TReturn,
  ): AppCallTransactionResultOfType<TReturn> {
    if (result.return?.decodeError) {
      throw result.return.decodeError
    }
    const returnValue =
      result.return?.returnValue !== undefined && returnValueFormatter !== undefined
        ? returnValueFormatter(result.return.returnValue)
        : (result.return?.returnValue as TReturn | undefined)
    return { ...result, return: returnValue }
  }

  /**
   * Calls the ABI method with the matching signature using an onCompletion code of NO_OP
   *
   * @param typedCallParams An object containing the method signature, args, and any other relevant parameters
   * @param returnValueFormatter An optional delegate which when provided will be used to map non-undefined return values to the target type
   * @returns The result of the smart contract call
   */
  public async call<TSignature extends keyof HelloWorld['methods']>(
    typedCallParams: TypedCallParams<TSignature>,
    returnValueFormatter?: (value: any) => MethodReturn<TSignature>,
  ) {
    return this.mapReturnValue<MethodReturn<TSignature>>(await this.appClient.call(typedCallParams), returnValueFormatter)
  }

  /**
   * Idempotently deploys the hello_world smart contract.
   *
   * @param params The arguments for the contract calls and any additional parameters for the call
   * @returns The deployment result
   */
  public deploy(params: HelloWorldDeployArgs & AppClientDeployCoreParams = {}): ReturnType<ApplicationClient['deploy']> {
    const createArgs = params.createCall?.(HelloWorldCallFactory.create)
    const updateArgs = params.updateCall?.(HelloWorldCallFactory.update)
    const deleteArgs = params.deleteCall?.(HelloWorldCallFactory.delete)
    return this.appClient.deploy({
      ...params,
      updateArgs,
      deleteArgs,
      createArgs,
      createOnCompleteAction: createArgs?.onCompleteAction,
    })
  }

  /**
   * Gets available create methods
   */
  public get create() {
    const $this = this
    return {
      /**
       * Creates a new instance of the hello_world smart contract using a bare call.
       *
       * @param args The arguments for the bare call
       * @returns The create result
       */
      bare(
        args: BareCallArgs & AppClientCallCoreParams & AppClientCompilationParams & CoreAppCallArgs & OnCompleteNoOp = {},
      ): Promise<AppCallTransactionResultOfType<undefined>> {
        return $this.appClient.create(args) as unknown as Promise<AppCallTransactionResultOfType<undefined>>
      },
    }
  }

  /**
   * Gets available update methods
   */
  public get update() {
    const $this = this
    return {
      /**
       * Updates an existing instance of the hello_world smart contract using a bare call.
       *
       * @param args The arguments for the bare call
       * @returns The update result
       */
      bare(
        args: BareCallArgs & AppClientCallCoreParams & AppClientCompilationParams & CoreAppCallArgs = {},
      ): Promise<AppCallTransactionResultOfType<undefined>> {
        return $this.appClient.update(args) as unknown as Promise<AppCallTransactionResultOfType<undefined>>
      },
    }
  }

  /**
   * Gets available delete methods
   */
  public get delete() {
    const $this = this
    return {
      /**
       * Deletes an existing instance of the hello_world smart contract using a bare call.
       *
       * @param args The arguments for the bare call
       * @returns The delete result
       */
      bare(args: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs = {}): Promise<AppCallTransactionResultOfType<undefined>> {
        return $this.appClient.delete(args) as unknown as Promise<AppCallTransactionResultOfType<undefined>>
      },
    }
  }

  /**
   * Makes a clear_state call to an existing instance of the hello_world smart contract.
   *
   * @param args The arguments for the bare call
   * @returns The clear_state result
   */
  public clearState(args: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.appClient.clearState(args)
  }

  /**
   * Calls the hello(string)string ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The result of the call
   */
  public hello(args: MethodArgs<'hello(string)string'>, params: AppClientCallCoreParams & CoreAppCallArgs = {}) {
    return this.call(HelloWorldCallFactory.hello(args, params))
  }

  public compose(): HelloWorldComposer {
    const client = this
    const atc = new AtomicTransactionComposer()
    let promiseChain: Promise<unknown> = Promise.resolve()
    const resultMappers: Array<undefined | ((x: any) => any)> = []
    return {
      hello(args: MethodArgs<'hello(string)string'>, params?: AppClientCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() =>
          client.hello(args, { ...params, sendParams: { ...params?.sendParams, skipSending: true, atc } }),
        )
        resultMappers.push(undefined)
        return this
      },
      get update() {
        const $this = this
        return {
          bare(args?: BareCallArgs & AppClientCallCoreParams & AppClientCompilationParams & CoreAppCallArgs) {
            promiseChain = promiseChain.then(() =>
              client.update.bare({ ...args, sendParams: { ...args?.sendParams, skipSending: true, atc } }),
            )
            resultMappers.push(undefined)
            return $this
          },
        }
      },
      get delete() {
        const $this = this
        return {
          bare(args?: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs) {
            promiseChain = promiseChain.then(() =>
              client.delete.bare({ ...args, sendParams: { ...args?.sendParams, skipSending: true, atc } }),
            )
            resultMappers.push(undefined)
            return $this
          },
        }
      },
      clearState(args?: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs) {
        promiseChain = promiseChain.then(() => client.clearState({ ...args, sendParams: { ...args?.sendParams, skipSending: true, atc } }))
        resultMappers.push(undefined)
        return this
      },
      addTransaction(
        txn: TransactionWithSigner | TransactionToSign | Transaction | Promise<SendTransactionResult>,
        defaultSender?: SendTransactionFrom,
      ) {
        promiseChain = promiseChain.then(async () =>
          atc.addTransaction(await algokit.getTransactionWithSigner(txn, defaultSender ?? client.sender)),
        )
        return this
      },
      async atc() {
        await promiseChain
        return atc
      },
      async execute() {
        await promiseChain
        const result = await algokit.sendAtomicTransactionComposer({ atc, sendParams: {} }, client.algod)
        return {
          ...result,
          returns: result.returns?.map((val, i) => (resultMappers[i] !== undefined ? resultMappers[i]!(val.returnValue) : val.returnValue)),
        }
      },
    } as unknown as HelloWorldComposer
  }
}
export type HelloWorldComposer<TReturns extends [...any[]] = []> = {
  /**
   * Calls the hello(string)string ABI method.
   *
   * @param args The arguments for the contract call
   * @param params Any additional parameters for the call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  hello(
    args: MethodArgs<'hello(string)string'>,
    params?: AppClientCallCoreParams & CoreAppCallArgs,
  ): HelloWorldComposer<[...TReturns, MethodReturn<'hello(string)string'>]>

  /**
   * Gets available update methods
   */
  readonly update: {
    /**
     * Updates an existing instance of the hello_world smart contract using a bare call.
     *
     * @param args The arguments for the bare call
     * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
     */
    bare(
      args?: BareCallArgs & AppClientCallCoreParams & AppClientCompilationParams & CoreAppCallArgs,
    ): HelloWorldComposer<[...TReturns, undefined]>
  }

  /**
   * Gets available delete methods
   */
  readonly delete: {
    /**
     * Deletes an existing instance of the hello_world smart contract using a bare call.
     *
     * @param args The arguments for the bare call
     * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
     */
    bare(args?: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs): HelloWorldComposer<[...TReturns, undefined]>
  }

  /**
   * Makes a clear_state call to an existing instance of the hello_world smart contract.
   *
   * @param args The arguments for the bare call
   * @returns The typed transaction composer so you can fluently chain multiple calls or call execute to execute all queued up transactions
   */
  clearState(args?: BareCallArgs & AppClientCallCoreParams & CoreAppCallArgs): HelloWorldComposer<[...TReturns, undefined]>

  /**
   * Adds a transaction to the composer
   *
   * @param txn One of: A TransactionWithSigner object (returned as is), a TransactionToSign object (signer is obtained from the signer property), a Transaction object (signer is extracted from the defaultSender parameter), an async SendTransactionResult returned by one of algokit utils helpers (signer is obtained from the defaultSender parameter)
   * @param defaultSender The default sender to be used to obtain a signer where the object provided to the transaction parameter does not include a signer.
   */
  addTransaction(
    txn: TransactionWithSigner | TransactionToSign | Transaction | Promise<SendTransactionResult>,
    defaultSender?: SendTransactionFrom,
  ): HelloWorldComposer<TReturns>
  /**
   * Returns the underlying AtomicTransactionComposer instance
   */
  atc(): Promise<AtomicTransactionComposer>
  /**
   * Executes the transaction group and returns an array of results
   */
  execute(): Promise<HelloWorldComposerResults<TReturns>>
}
export type HelloWorldComposerResults<TReturns extends [...any[]]> = {
  returns: TReturns
  groupId: string
  txIds: string[]
  transactions: Transaction[]
}
