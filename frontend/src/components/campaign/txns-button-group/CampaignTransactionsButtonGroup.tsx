import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { AppDetails } from '@algorandfoundation/algokit-utils/types/app-client'
import { useWallet } from '@txnlab/use-wallet'
import { Fragment } from 'react'
import { CampaignClient } from '../../../contracts/CampaignClient'
import algod from '../../../core/algosdk/AlgodManager'
import useAppContext from '../../../core/util/useAppContext'
import VoteModal from '../../VoteModal'
import CampaignClaim from '../../campaign-pre-generated/CampaignClaim'
import CampaignWithdrawIdoAsa from '../../campaign-pre-generated/CampaignWithdrawIdoAsa'
import CampaignWithdrawInvestment from '../../campaign-pre-generated/CampaignWithdrawInvestment'
import CampaignWithdrawSales from '../../campaign-pre-generated/CampaignWithdrawSales'
import WalletConnectModal from '../../common/wallet-connect-modal/WalletConnectModal'
import InvestModal from '../../invest-modal/InvestModal'
import OptInButton from '../../opt-in/OptInButton'
import { USDC_ASSET } from '../../../core/util/asset/AssetConstants'

function CampaignTransactionsButtonGroup({
  campaignId,
  campaignPeriod,
  campaignGoalStatus,
  userStatus,
  idoAsaId,
}: {
  campaignId: number | bigint
  campaignPeriod: 'voting' | 'investing' | 'ended'
  campaignGoalStatus: 'incomplete' | 'softcap' | 'hardcap'
  userStatus: 'voted' | 'voted_and_invested' | 'invested' | 'not_interacted' | 'campaign_owner'
  idoAsaId: number
}) {
  const { activeAccount, userData } = useAppContext()
  const { signer } = useWallet()

  const appDetails = {
    resolveBy: 'id',
    id: campaignId,
    sender: { signer, addr: activeAccount?.address } as TransactionSignerAccount,
    creatorAddress: activeAccount?.address,
    findExistingUsing: algod.indexer,
  } as AppDetails

  const campaignClient = new CampaignClient(appDetails, algod.client)
  const hasUserOptedInToIdoAsa = userData?.user_assets.some((asset) => asset['asset-id'] === idoAsaId)
  const hasUserOptedInToInvestAsa = userData?.user_assets.some((asset) => asset['asset-id'] === USDC_ASSET.id)

  return !activeAccount ? <WalletConnectModal buttonLabel="Connect to vote" /> : renderContent()

  function renderContent() {
    if (userStatus === 'campaign_owner') {
      return getCampaignOwnerTransactionButtons()
    }

    return getCampaignClientTransactionButtons()
  }

  function getCampaignOwnerTransactionButtons() {
    let content = <Fragment />

    if (campaignPeriod === 'ended' && campaignGoalStatus === 'incomplete') {
      content = <CampaignWithdrawIdoAsa buttonClass="" buttonNode={'withdraw ido asa'} typedClient={campaignClient} idoAsa={idoAsaId} />
    } else if (campaignPeriod === 'ended' && campaignGoalStatus === 'softcap') {
      content = (
        <>
          <CampaignWithdrawSales buttonClass="" buttonNode={'claim sales'} typedClient={campaignClient} investmentAsa={USDC_ASSET.id} />

          <CampaignWithdrawIdoAsa buttonClass="" buttonNode={'withdraw ido asa'} typedClient={campaignClient} idoAsa={idoAsaId} />
        </>
      )
    } else if (campaignPeriod !== 'ended' && campaignGoalStatus === 'softcap') {
      content = (
        <CampaignWithdrawSales buttonClass="" buttonNode={'claim sales'} typedClient={campaignClient} investmentAsa={USDC_ASSET.id} />
      )
    }

    return content
  }

  function getCampaignClientTransactionButtons() {
    let content = <Fragment />

    if (campaignPeriod === 'voting' && userStatus === 'not_interacted') {
      content = <VoteModal hasVotedAlready={false} />
    } else if (
      campaignPeriod === 'voting' &&
      (userStatus === 'voted' || userStatus === 'voted_and_invested') &&
      campaignGoalStatus !== 'hardcap'
    ) {
      content = (
        <>
          <VoteModal hasVotedAlready={true} />

          <InvestModal campaignStatus={'hypelist'} campaignId={campaignId} />
        </>
      )
    } else if (campaignPeriod === 'investing' && campaignGoalStatus !== 'hardcap') {
      content = <InvestModal campaignStatus={'whitelist'} campaignId={campaignId} />
    } else if (campaignGoalStatus === 'incomplete' && (userStatus === 'invested' || userStatus === 'voted_and_invested')) {
      content = (
        <>
          {!hasUserOptedInToInvestAsa && (
            <>
              <p className={'text-gray-100 text-center'}>{'You need to opt-in to the asset, in order to withdraw your USDC investment'}</p>

              <OptInButton assetId={USDC_ASSET.id} activeAddress={activeAccount?.address ?? ''} />
            </>
          )}

          <CampaignWithdrawInvestment
            buttonClass=""
            buttonNode={'withdraw investment'}
            typedClient={campaignClient}
            investmentAsa={USDC_ASSET.id}
            isDisabled={!hasUserOptedInToInvestAsa}
          />
        </>
      )
    } else if (
      campaignGoalStatus !== 'incomplete' &&
      campaignPeriod === 'ended' &&
      (userStatus === 'invested' || userStatus === 'voted_and_invested')
    ) {
      content = (
        <>
          {!hasUserOptedInToIdoAsa && (
            <>
              <p className={'text-gray-100 text-center'}>{'You need to opt-in to the asset, in order to claim your IDO tokens'}</p>

              <OptInButton assetId={idoAsaId} activeAddress={activeAccount?.address ?? ''} />
            </>
          )}
          <CampaignClaim campaignId={campaignId} idoAsa={idoAsaId} isDisabled={!hasUserOptedInToIdoAsa}>
            {'claim'}
          </CampaignClaim>
        </>
      )
    }

    return content
  }
}

export default CampaignTransactionsButtonGroup
