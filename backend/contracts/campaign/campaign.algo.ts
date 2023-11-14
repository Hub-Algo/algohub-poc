import { Contract } from '@algorandfoundation/tealscript';

type VestingDetails = {
  vestingPeriods: number;
  percentages: number[]; // percentage of tokens to be available
  durations: number[]; // seconds after end timestamp
};

type CampaignObj = {
  price: number;
  maxBuyCap: number;
  softCap: number;
  hardCap: number;
  purchasedAmount: number;
  withdrawnAmount: number;
  startTime: number;
  endTime: number;
  metadataUrl: string;
};

type AlgohubVotes = {
  algoToVoteRation: number;
  vipVoteWeight: number;
  totalVotes: number;
};

// eslint-disable-next-line no-unused-vars
export default class Campaign extends Contract {
  algohub = GlobalStateKey<Application>();

  admin = GlobalStateKey<Account>();

  idoAsaId = GlobalStateKey<Asset>();

  buyAsaId = GlobalStateKey<Asset>();

  votersAsaId = GlobalStateKey<Asset>();

  campaign = GlobalStateKey<CampaignObj>();

  vestingSchedule = GlobalStateKey<VestingDetails>();

  isApprovedCampaign = GlobalStateKey<boolean>();

  votesTotal = GlobalStateKey<number>();

  votesInFavor = GlobalStateKey<number>();

  inFavor = BoxMap<Address, boolean>({ prefix: 'v' });

  purchases = BoxMap<Address, number>({ prefix: 'p' });

  claimedAmount = BoxMap<Address, number>({ prefix: 'c' });

  // eslint-disable-next-line no-unused-vars
  createApplication(algohubApp: Application): void {
    this.algohub.value = algohubApp;
    this.votersAsaId.value = Asset.zeroIndex;
    this.idoAsaId.value = Asset.zeroIndex;
    this.buyAsaId.value = Asset.zeroIndex;
    this.isApprovedCampaign.value = false;
  }

  /// ========================
  /// ==== Private Methods ===
  /// ========================
  private expandOpcodeBugdet(): void {
    sendMethodCall<[], void>({
      applicationID: this.algohub.value,
      name: 'expandOpcodeBudget',
    });
  }

  private isApproved(): boolean {
    if (!this.isApprovedCampaign.value) {
      // TODO: Check quorum + voting logic
      return true;
    }
    return this.isApprovedCampaign.value;
  }

  // eslint-disable-next-line no-unused-vars
  private isHypelisted(account: Account): boolean {
    // Check if caller is hypelisted
    return true;
  }

  private optInToAsa(asaToOptIn: Asset): void {
    sendAssetTransfer({
      assetReceiver: this.app.address,
      xferAsset: asaToOptIn,
      assetAmount: 0,
    });
  }

  private convertToAsaAmount(purchaseAmount: number, asaToCovertTo: Asset): number {
    if (asaToCovertTo === this.buyAsaId.value) return purchaseAmount / this.campaign.value.price;
    if (asaToCovertTo === this.idoAsaId.value) return purchaseAmount * this.campaign.value.price;
    return 0;
  }

  createCampaign(
    adminAccount: Account,
    votersAsa: Asset,
    idoAsa: Asset,
    buyAsa: Asset,
    price: number,
    maxBuyCap: number,
    softCap: number,
    hardCap: number,
    votingPeriod: number,
    duration: number,
    metadataUrl: string
  ): void {
    assert(!this.campaign.exists);
    this.admin.value = adminAccount;

    this.votersAsaId.value = votersAsa;
    this.idoAsaId.value = idoAsa;
    this.buyAsaId.value = buyAsa;
    this.optInToAsa(idoAsa);
    this.optInToAsa(buyAsa);

    this.campaign.value = {
      price: price,
      maxBuyCap: maxBuyCap,
      softCap: softCap,
      hardCap: hardCap,
      purchasedAmount: 0,
      withdrawnAmount: 0,
      startTime: globals.latestTimestamp + votingPeriod,
      endTime: globals.latestTimestamp + votingPeriod + duration,
      metadataUrl: metadataUrl,
    };
  }

  setVestingSchedule(vestingPercentages: number[], vestingDurations: number[]): void {
    assert(!this.campaign.exists);
    assert(vestingDurations.length === vestingPercentages.length);
    this.vestingSchedule.value = {
      vestingPeriods: vestingDurations.length,
      percentages: vestingPercentages,
      durations: vestingDurations,
    };
  }

  // eslint-disable-next-line no-unused-vars
  depositIdoAsa(idoXfer: AssetTransferTxn, idoAsa: Asset): void {
    // TODO: Allow deposit only once
    assert(this.campaign.exists);
    verifyTxn(this.txn, { sender: this.admin.value });
    const idoAsaToTransfer = this.campaign.value.hardCap / this.campaign.value.price;
    verifyTxn(idoXfer, {
      assetAmount: idoAsaToTransfer,
      assetReceiver: this.app.address,
      sender: this.txn.sender,
      xferAsset: this.idoAsaId.value,
    });
  }

  lockApprovedStatus(): void {
    assert(this.campaign.exists);
    assert(this.isApproved());
    assert(!this.isApprovedCampaign.value);
    this.isApprovedCampaign.value = true;
  }

  // eslint-disable-next-line no-unused-vars
  buy(buyAsaXfer: AssetTransferTxn, buyAsa: Asset, buyAmount: number): void {
    assert(this.campaign.exists);
    assert(this.isApproved());
    // check campaing is not finished
    assert(this.campaign.value.endTime > globals.latestTimestamp);
    // Check amount to buy is not more than max buy cap
    assert(this.campaign.value.maxBuyCap >= buyAmount);
    // Allow hypelisted addresses to buy before start time
    if (!this.isHypelisted(this.txn.sender)) {
      assert(this.campaign.value.startTime < globals.latestTimestamp);
    }
    // check that hardcap is not reached
    assert(this.campaign.value.hardCap >= this.campaign.value.purchasedAmount + buyAmount);
    // TODO: allow set approve campaign in case buy cannot be called due to hardcap reached
    if (!this.isApprovedCampaign.value) {
      this.isApprovedCampaign.value = true;
    }

    const buyAsaToTransfer = buyAmount * this.campaign.value.price;
    verifyTxn(buyAsaXfer, {
      assetAmount: buyAsaToTransfer,
      assetReceiver: this.app.address,
      sender: this.txn.sender,
      xferAsset: this.buyAsaId.value,
    });
    this.campaign.value.purchasedAmount = this.campaign.value.purchasedAmount + buyAmount;

    if (this.purchases(this.txn.sender).exists) {
      this.purchases(this.txn.sender).value = this.purchases(this.txn.sender).value + buyAmount;
    } else {
      this.purchases(this.txn.sender).value = buyAmount;
    }
  }

  private calculateAllowedClaimAmountBasedOnVestingSchedule(totalAmount: number): number {
    const durationAfterEndTime = globals.latestTimestamp - this.campaign.value.endTime;
    let durationInVestingPeriod = 0;
    let totalPercentageEligibleForClaim = 0;
    for (let i = 0; i < this.vestingSchedule.value.vestingPeriods; i + 1) {
      if (durationAfterEndTime > durationInVestingPeriod) {
        durationInVestingPeriod = durationInVestingPeriod + this.vestingSchedule.value.durations[i];
        totalPercentageEligibleForClaim = totalPercentageEligibleForClaim + this.vestingSchedule.value.percentages[i];
      }
    }
    const eligibleAmountToClaim = (totalAmount * totalPercentageEligibleForClaim) / 100;

    return eligibleAmountToClaim;
  }

  // eslint-disable-next-line no-unused-vars
  claim(idoAsa: Asset): void {
    // this.expandOpcodeBugdet();
    // can claim after the campaign is over and according to the vesting schedule
    assert(this.campaign.exists);
    assert(this.vestingSchedule.exists);
    assert(this.isApproved());
    // assert(this.campaign.value.endTime < globals.latestTimestamp);
    assert(this.purchases(this.txn.sender).exists);
    const totalClaimableAmount = this.purchases(this.txn.sender).value / this.campaign.value.price;
    const alreadyClaimedAmount = this.claimedAmount(this.txn.sender).exists
      ? this.claimedAmount(this.txn.sender).value
      : 0;
    assert(totalClaimableAmount > alreadyClaimedAmount);
    const totalAmountToClaim = totalClaimableAmount - alreadyClaimedAmount;
    // const eligibleAmountToClaim = this.calculateAllowedClaimAmountBasedOnVestingSchedule(totalAmountToClaim);
    const eligibleAmountToClaim = totalAmountToClaim;
    sendAssetTransfer({
      sender: this.app.address,
      assetReceiver: this.txn.sender,
      xferAsset: this.idoAsaId.value,
      assetAmount: eligibleAmountToClaim,
    });

    if (this.claimedAmount(this.txn.sender).exists) {
      this.claimedAmount(this.txn.sender).value = this.claimedAmount(this.txn.sender).value + eligibleAmountToClaim;
    } else {
      this.claimedAmount(this.txn.sender).value = eligibleAmountToClaim;
    }
  }

  // eslint-disable-next-line no-unused-vars
  withdrawInvestment(buyAsa: Asset): void {
    // if a wallet bought tokens during the voting period due to hypelisting
    // they can withdraw their tokens if the campaign did not collected required votes
    assert(this.campaign.exists);
    // TODO: Add the checks below
    // assert(!this.isApproved());
    // assert(this.campaign.value.startTime > globals.latestTimestamp);
    assert(this.purchases(this.txn.sender).exists);

    sendAssetTransfer({
      sender: this.app.address,
      assetReceiver: this.txn.sender,
      xferAsset: this.buyAsaId.value,
      assetAmount: this.convertToAsaAmount(this.purchases(this.txn.sender).value, this.buyAsaId.value),
    });
  }

  withdrawIdoAsa(idoAsa: Asset): void {
    // to be called only by contract cretator
    // when the campaign reached their softcap but not the hardcap
    // OR in case the campaign was not approved
    // in both cases the contract holds IDO tokens which the creator
    // should be able to withdraw
    // in former case, can withdraw whatever Ido tokens were not sold
    // in latter case, can withdraw all the Ido tokens
    assert(this.campaign.exists);
    verifyTxn(this.txn, { sender: this.admin.value });
    // TODO: Add check for end time
    // assert(this.campaign.value.endTime > globals.latestTimestamp);
    if (this.isApproved()) {
      const totalUnsoldAmount = this.campaign.value.hardCap - this.campaign.value.purchasedAmount;
      assert(totalUnsoldAmount > 0);
      sendAssetTransfer({
        sender: this.app.address,
        assetReceiver: this.txn.sender,
        xferAsset: idoAsa,
        assetAmount: totalUnsoldAmount / this.campaign.value.price, // this.convertToAsaAmount(totalUnsoldAmount, this.idoAsaId.value),
      });
    } else {
      sendAssetTransfer({
        sender: this.app.address,
        assetReceiver: this.txn.sender,
        xferAsset: idoAsa,
        assetAmount: this.app.address.assetBalance(idoAsa),
      });
    }
  }

  withdrawSales(buyAsa: Asset): void {
    // to be called only by the contract creator after the campaign is over
    // to allow them to withdaw all or part of the sale/buy tokens.
    assert(this.campaign.exists);
    verifyTxn(this.txn, { sender: this.admin.value });
    // TODO: Add check for end time
    // assert(this.campaign.value.endTime > globals.latestTimestamp);
    // TODO: We might want to add vesting period here as well
    sendAssetTransfer({
      sender: this.app.address,
      assetReceiver: this.txn.sender,
      xferAsset: buyAsa,
      assetAmount: this.app.address.assetBalance(buyAsa),
    });
  }

  // eslint-disable-next-line no-unused-vars
  vote(inFavor: boolean, votersAsa: Asset): void {
    assert(this.campaign.exists);
    assert(this.campaign.value.startTime > globals.latestTimestamp);
    assert(this.txn.sender.assetBalance(this.votersAsaId.value) === 1);

    this.votesTotal.value = this.votesTotal.value + 1;
    if (inFavor) {
      this.votesInFavor.value = this.votesInFavor.value + 1;
    }
  }

  getAccountTotalPurchases(account: Account): number {
    return this.purchases(account).value;
  }

  getVotes(): [number, number] {
    return [this.votesInFavor.value, this.votesTotal.value];
  }

  getVotersAsa(): Asset {
    return this.votersAsaId.value;
  }

  getIdoAsa(): Asset {
    return this.idoAsaId.value;
  }

  getBuyAsa(): Asset {
    return this.buyAsaId.value;
  }

  getCampaign(): CampaignObj {
    return this.campaign.value;
  }

  getVestingSchedule(): VestingDetails {
    return this.vestingSchedule.value;
  }
}

// eslint-disable-next-line no-unused-vars
export class Algohub extends Contract {
  algohubCampaigns = GlobalStateKey<Application[]>();

  votersAsaId = GlobalStateKey<Asset>();

  algoToVoteRation = GlobalStateKey<number>();

  votingPeriod = GlobalStateKey<number>();

  vipVoteWeight = GlobalStateKey<number>();

  totalVotes = GlobalStateKey<number>();

  vipVoters = BoxMap<Account, boolean>();

  // eslint-disable-next-line no-unused-vars
  createApplication(algoToVoteRatio: number, vipVoteWeight: number, votingPeriod: number): void {
    this.algoToVoteRation.value = algoToVoteRatio;
    this.vipVoteWeight.value = vipVoteWeight;
    this.votingPeriod.value = votingPeriod;
  }

  /// ========================
  /// ==== Private Methods ===
  /// ========================
  private doAxfer(receiver: Account, asset: Asset, amount: uint64): void {
    sendAssetTransfer({
      assetReceiver: receiver,
      xferAsset: asset,
      assetAmount: amount,
    });
  }

  private doOptIn(account: Account, asset: Asset): void {
    this.doAxfer(account, asset, 0);
  }

  /// ========================
  /// ==== Admin Methods ====
  /// ========================
  bootstrap(voteAsaTotal: number): Asset {
    verifyTxn(this.txn, { sender: this.app.creator });
    assert(!this.votersAsaId.exists);
    const votersAsa = sendAssetCreation({
      configAssetName: 'AlgoHubVote2',
      configAssetUnitName: 'AHV2',
      configAssetDecimals: 18,
      configAssetTotal: voteAsaTotal,
      configAssetFreeze: this.app.address,
      configAssetClawback: this.app.address,
      configAssetReserve: this.app.address,
    });
    this.votersAsaId.value = votersAsa;
    this.doOptIn(this.app.address, votersAsa);
    return votersAsa;
  }

  // eslint-disable-next-line no-unused-vars
  setVipStatus(account: Account, isVip: boolean, votersAsa: Asset): void {
    assert(this.votersAsaId.exists);
    /// Only allow app creator to set Vip status
    verifyTxn(this.txn, { sender: globals.creatorAddress });
    assert(account.assetBalance(this.votersAsaId.value) === 1);
    this.vipVoters(account).value = isVip;
  }

  /// ========================
  /// ==== Public Methods ====
  /// ========================
  // eslint-disable-next-line no-unused-vars
  createCampaign(
    votersAsa: Asset,
    idoAsa: Asset,
    buyAsa: Asset,
    price: number,
    maxBuyCap: number,
    softCap: number,
    hardCap: number,
    duration: number,
    metadataUrl: string,
    vestingPercentages: number[],
    vestingDurations: number[]
  ): Application {
    assert(this.votersAsaId.exists);
    sendMethodCall<[Application], void>({
      name: 'createApplication',
      methodArgs: [this.app],
      clearStateProgram: Campaign.clearProgram(),
      approvalProgram: Campaign.approvalProgram(),
      globalNumByteSlice: 8,
      globalNumUint: 4,
    });

    const campaignApp = this.itxn.createdApplicationID;

    sendPayment({
      amount: 300_000,
      receiver: campaignApp.address,
    });
    if (this.algohubCampaigns.exists) {
      this.algohubCampaigns.value.push(campaignApp);
    } else {
      const newApp: Application[] = [campaignApp];
      this.algohubCampaigns.value = newApp;
    }

    sendMethodCall<[number[], number[]], void>({
      applicationID: campaignApp,
      name: 'setVestingSchedule',
      methodArgs: [vestingPercentages, vestingDurations],
    });

    sendMethodCall<[Account, Asset, Asset, Asset, number, number, number, number, number, number, string], void>({
      applicationID: campaignApp,
      name: 'createCampaign',
      methodArgs: [
        this.txn.sender,
        this.votersAsaId.value,
        idoAsa,
        buyAsa,
        price,
        maxBuyCap,
        softCap,
        hardCap,
        this.votingPeriod.value,
        duration,
        metadataUrl,
      ],
    });

    return campaignApp;
  }

  // eslint-disable-next-line no-unused-vars
  registerAsVoter(votersAsa: Asset): void {
    assert(this.votersAsaId.exists);
    assert(this.txn.sender.assetBalance(this.votersAsaId.value) === 0);
    assert(this.txn.sender.balance >= this.algoToVoteRation.value);
    // transfer token to sender
    sendAssetTransfer({
      xferAsset: this.votersAsaId.value,
      assetReceiver: this.txn.sender,
      assetAmount: 1,
    });
    // and then freeze it
    sendAssetFreeze({
      freezeAsset: this.votersAsaId.value,
      freezeAssetAccount: this.txn.sender,
      freezeAssetFrozen: true,
    });
    // const votes = Math.floor(this.txn.sender.balance / this.algoToVoteRation.value);
    this.totalVotes.value = this.totalVotes.value + 1;
  }

  // eslint-disable-next-line no-unused-vars
  unregisterAsVoter(votersAsa: Asset): void {
    assert(this.votersAsaId.exists);
    assert(this.txn.sender.hasAsset(this.votersAsaId.value) === 1);
    // unfreeze the asset for the sender
    sendAssetFreeze({
      freezeAsset: this.votersAsaId.value,
      freezeAssetAccount: this.txn.sender,
      freezeAssetFrozen: false,
    });
    // and transfer it back to the app
    sendAssetTransfer({
      assetSender: this.txn.sender,
      xferAsset: this.votersAsaId.value,
      assetReceiver: this.app.address,
      assetAmount: 1,
    });
    // better handling here???
    this.totalVotes.value = this.totalVotes.value - 1;
    this.vipVoters(this.txn.sender).value = false;
  }

  expandOpcodeBudget(): void {}

  /// ========================
  /// ==== Getter Methods ====
  /// ========================
  getAllCampaignApps(): Application[] {
    return this.algohubCampaigns.exists ? this.algohubCampaigns.value : [];
  }

  getVotersDetails(): AlgohubVotes {
    return {
      algoToVoteRation: this.algoToVoteRation.value,
      vipVoteWeight: this.vipVoteWeight.value,
      totalVotes: this.totalVotes.value,
    };
  }

  // eslint-disable-next-line no-unused-vars
  getVotePower(account: Account, votersAsa: Asset): number {
    if (account.hasAsset(this.votersAsaId.value) === 0) return 0;
    if (this.vipVoters(account).exists) {
      if (this.vipVoters(account).value) return this.vipVoteWeight.value;
    }
    return 100;
  }

  getVotingPeriod(): number {
    return this.votingPeriod.value;
  }

  getTotalVoters(): number {
    return this.totalVotes.value;
  }

  getVipStatus(account: Account): boolean {
    if (this.vipVoters(account).exists) {
      return this.vipVoters(account).value;
    }
    return false;
  }

  // eslint-disable-next-line no-unused-vars
  getVoteAsa(voteAsa: Asset): Asset {
    return this.votersAsaId.value;
  }
}
