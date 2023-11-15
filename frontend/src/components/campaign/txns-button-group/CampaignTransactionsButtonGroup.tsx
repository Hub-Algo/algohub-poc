import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { AppDetails } from '@algorandfoundation/algokit-utils/types/app-client'
import { useWallet } from '@txnlab/use-wallet'
import { Fragment } from 'react'
import { CampaignClient } from '../../../contracts/CampaignClient'
import algod from '../../../core/algosdk/AlgodManager'
import { USDC_ASSET } from '../../../core/util/asset/assetConstants'
import useAppContext from '../../../core/util/useAppContext'
import { CampaignObj } from '../../../services/campaignServices'
import VoteModal from '../../VoteModal'
import CampaignClaim from '../../campaign-pre-generated/CampaignClaim'
import CampaignWithdrawIdoAsa from '../../campaign-pre-generated/CampaignWithdrawIdoAsa'
import CampaignWithdrawInvestment from '../../campaign-pre-generated/CampaignWithdrawInvestment'
import CampaignWithdrawSales from '../../campaign-pre-generated/CampaignWithdrawSales'
import WalletConnectModal from '../../common/wallet-connect-modal/WalletConnectModal'
import InvestModal from '../../invest-modal/InvestModal'
import OptInButton from '../../opt-in/OptInButton'

function CampaignTransactionsButtonGroup({
  campaign,
  campaignPeriod,
  campaignGoalStatus,
  userStatus,
  idoAsaId,
  isDemonstrating,
  idoAssetUnitName,
}: {
  campaign: CampaignObj
  campaignPeriod: 'voting' | 'investing' | 'ended'
  campaignGoalStatus: 'incomplete' | 'softcap_reached' | 'hardcap_reached'
  userStatus: 'voted' | 'voted_and_invested' | 'invested' | 'not_interacted' | 'campaign_owner'
  idoAsaId: number
  isDemonstrating: boolean
  idoAssetUnitName?: string
}) {
  const { activeAccount, userData } = useAppContext()
  const { signer } = useWallet()

  const appDetails = {
    resolveBy: 'id',
    id: Number(campaign.appId),
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

    // TODO: Remove this
    if (isDemonstrating) {
      content = (
        <>
          {!hasUserOptedInToInvestAsa && (
            <>
              <p className={'text-gray-100 text-center'}>{'You need to opt-in to the asset, in order to claim your USDC sales'}</p>

              <OptInButton assetId={USDC_ASSET.id} activeAddress={activeAccount?.address ?? ''} />
            </>
          )}
          <CampaignWithdrawSales typedClient={campaignClient} investmentAsa={USDC_ASSET.id}>
            {'claim sales'}
          </CampaignWithdrawSales>
        </>
      )
    } else if (campaignPeriod === 'ended' && campaignGoalStatus === 'incomplete') {
      content = <CampaignWithdrawIdoAsa buttonClass="" buttonNode={'withdraw ido asa'} typedClient={campaignClient} idoAsa={idoAsaId} />
    } else if (campaignPeriod === 'ended' && campaignGoalStatus !== 'incomplete') {
      content = (
        <>
          {!hasUserOptedInToInvestAsa && (
            <>
              <p className={'text-gray-100 text-center'}>{'You need to opt-in to the asset, in order to claim your USDC sales'}</p>

              <OptInButton assetId={USDC_ASSET.id} activeAddress={activeAccount?.address ?? ''} />
            </>
          )}

          <CampaignWithdrawSales typedClient={campaignClient} investmentAsa={USDC_ASSET.id}>
            {'claim sales'}
          </CampaignWithdrawSales>

          {campaignGoalStatus === 'softcap_reached' && (
            <CampaignWithdrawIdoAsa buttonClass="" buttonNode={'withdraw ido asa'} typedClient={campaignClient} idoAsa={idoAsaId} />
          )}
        </>
      )
    } else if (campaignPeriod !== 'ended' && campaignGoalStatus === 'softcap_reached') {
      content = (
        <>
          {!hasUserOptedInToInvestAsa && (
            <>
              <p className={'text-gray-100 text-center'}>{'You need to opt-in to the asset, in order to claim your USDC sales'}</p>

              <OptInButton assetId={USDC_ASSET.id} activeAddress={activeAccount?.address ?? ''} />
            </>
          )}

          <CampaignWithdrawSales typedClient={campaignClient} investmentAsa={USDC_ASSET.id}>
            {'claim sales'}
          </CampaignWithdrawSales>
        </>
      )
    }

    return content
  }

  function getCampaignClientTransactionButtons() {
    let content = <Fragment />

    // TODO: Remove this
    if (isDemonstrating) {
      content = (
        <>
          <InvestModal campaignStatus={'whitelist'} campaign={campaign} />

          <CampaignClaim campaignId={Number(campaign.appId)} idoAsa={idoAsaId} isDisabled={!hasUserOptedInToIdoAsa}>
            {`claim ${idoAssetUnitName}`}
          </CampaignClaim>
        </>
      )
    } else if (campaignPeriod === 'voting' && userStatus === 'not_interacted') {
      content = <VoteModal hasVotedAlready={false} />
    } else if (
      campaignPeriod === 'voting' &&
      (userStatus === 'voted' || userStatus === 'voted_and_invested') &&
      campaignGoalStatus !== 'hardcap_reached'
    ) {
      content = (
        <>
          <VoteModal hasVotedAlready={true} />

          <InvestModal campaignStatus={'hypelist'} campaign={campaign} />
        </>
      )
    } else if (campaignPeriod === 'investing' && campaignGoalStatus !== 'hardcap_reached') {
      content = <InvestModal campaignStatus={'whitelist'} campaign={campaign} />
    } else if (campaignGoalStatus === 'incomplete' && (userStatus === 'invested' || userStatus === 'voted_and_invested')) {
      content = (
        <>
          {!hasUserOptedInToInvestAsa && (
            <>
              <p className={'text-gray-100 text-center'}>{'You need to opt-in to the asset, in order to withdraw your USDC investment'}</p>

              <OptInButton assetId={USDC_ASSET.id} activeAddress={activeAccount?.address ?? ''} />
            </>
          )}

          <CampaignWithdrawInvestment typedClient={campaignClient} investmentAsa={USDC_ASSET.id} isDisabled={!hasUserOptedInToInvestAsa}>
            {'withdraw investment'}
          </CampaignWithdrawInvestment>
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

          <CampaignClaim campaignId={Number(campaign.appId)} idoAsa={idoAsaId} isDisabled={!hasUserOptedInToIdoAsa}>
            {`claim ${idoAssetUnitName}`}
          </CampaignClaim>
        </>
      )
    }

    return content
  }
}

export default CampaignTransactionsButtonGroup
