import { Contract } from '@algorandfoundation/tealscript';

type VestingDetails = {
  vestingPeriods: number;
  percentages: number[]; // percentage of tokens to be available
  durations: number[]; // seconds after end timestamp
};

type CampaignObj = {
  conversionRate: number;
  maxInvestmentPerAccount: number;
  minTotalInvestment: number;
  maxTotalInvestment: number;
  investedAmount: number;
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

  investmentAsaId = GlobalStateKey<Asset>();

  votersAsaId = GlobalStateKey<Asset>();

  campaign = GlobalStateKey<CampaignObj>();

  vestingSchedule = GlobalStateKey<VestingDetails>();

  isApprovedCampaign = GlobalStateKey<boolean>();

  votesTotal = GlobalStateKey<number>();

  votesInFavor = GlobalStateKey<number>();

  inFavor = BoxMap<Address, boolean>({ prefix: 'v' });

  investments = BoxMap<Address, number>({ prefix: 'i' });

  claimedAmount = BoxMap<Address, number>({ prefix: 'c' });

  hypelist = BoxMap<Address, boolean>({ prefix: 'h' });

  // eslint-disable-next-line no-unused-vars
  createApplication(algohubApp: Application): void {
    this.algohub.value = algohubApp;
    this.votersAsaId.value = Asset.zeroIndex;
    this.idoAsaId.value = Asset.zeroIndex;
    this.investmentAsaId.value = Asset.zeroIndex;
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

  private optInToAsa(asaToOptIn: Asset): void {
    sendAssetTransfer({
      assetReceiver: this.app.address,
      xferAsset: asaToOptIn,
      assetAmount: 0,
    });
  }

  private convertToAsaAmount(purchaseAmount: number, asaToCovertTo: Asset): number {
    if (asaToCovertTo === this.investmentAsaId.value) return purchaseAmount / this.campaign.value.conversionRate;
    if (asaToCovertTo === this.idoAsaId.value) return purchaseAmount * this.campaign.value.conversionRate;
    return 0;
  }

  createCampaign(
    adminAccount: Account,
    votersAsa: Asset,
    idoAsa: Asset,
    investmentAsa: Asset,
    conversionRate: number,
    maxInvestmentPerAccount: number,
    minTotalInvestment: number,
    maxTotalInvestment: number,
    votingPeriod: number,
    duration: number,
    metadataUrl: string
  ): void {
    assert(!this.campaign.exists);
    this.admin.value = adminAccount;

    this.votersAsaId.value = votersAsa;
    this.idoAsaId.value = idoAsa;
    this.investmentAsaId.value = investmentAsa;
    this.optInToAsa(idoAsa);
    this.optInToAsa(investmentAsa);

    this.campaign.value = {
      conversionRate: conversionRate,
      maxInvestmentPerAccount: maxInvestmentPerAccount * 10 ** investmentAsa.decimals,
      minTotalInvestment: minTotalInvestment * 10 ** investmentAsa.decimals,
      maxTotalInvestment: maxTotalInvestment * 10 ** investmentAsa.decimals,
      investedAmount: 0,
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

  setHypelistedAccount(account: Account, isHypelisted: boolean): void {
    this.hypelist(account).value = isHypelisted;
  }

  isHypelisted(account: Account): boolean {
    return this.hypelist(account).value;
  }

  // eslint-disable-next-line no-unused-vars
  depositIdoAsa(idoXfer: AssetTransferTxn, idoAsa: Asset): void {
    // TODO: Safeguard the allowance of deposit IDO Assets only once
    assert(this.campaign.exists);
    verifyTxn(this.txn, { sender: this.admin.value });
    const idoAsaToTransfer = (this.campaign.value.maxTotalInvestment * 100) / this.campaign.value.conversionRate;
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
  invest(investmentAsaXfer: AssetTransferTxn, investmentAsa: Asset, investmentAmount: number): void {
    assert(this.campaign.exists);
    assert(this.isApproved());
    // check campaing is not finished
    assert(this.campaign.value.endTime > globals.latestTimestamp);
    // Check amount to invest is not more than max invest cap
    const investmentAsaToTransfer = investmentAmount * 10 ** investmentAsa.decimals;
    assert(this.campaign.value.maxInvestmentPerAccount >= investmentAsaToTransfer);
    // Allow hypelisted addresses to invest before start time
    if (!this.isHypelisted(this.txn.sender)) {
      assert(this.campaign.value.startTime < globals.latestTimestamp);
    }
    // check that hardcap is not reached
    assert(this.campaign.value.maxTotalInvestment >= this.campaign.value.investedAmount + investmentAsaToTransfer);
    // TODO: allow set approve campaign in case invest cannot be called due to hardcap reached
    if (!this.isApprovedCampaign.value) {
      this.isApprovedCampaign.value = true;
    }
    verifyTxn(investmentAsaXfer, {
      assetAmount: investmentAsaToTransfer,
      assetReceiver: this.app.address,
      sender: this.txn.sender,
      xferAsset: this.investmentAsaId.value,
    });
    this.campaign.value.investedAmount = this.campaign.value.investedAmount + investmentAsaToTransfer;

    if (this.investments(this.txn.sender).exists) {
      this.investments(this.txn.sender).value = this.investments(this.txn.sender).value + investmentAsaToTransfer;
    } else {
      this.investments(this.txn.sender).value = investmentAsaToTransfer;
    }
  }

  // TODO: Revisit the logic for vesting tokens on claim
  // private calculateAllowedClaimAmountBasedOnVestingSchedule(totalAmount: number): number {
  //   const durationAfterEndTime = globals.latestTimestamp - this.campaign.value.endTime;
  //   let durationInVestingPeriod = 0;
  //   let totalPercentageEligibleForClaim = 0;
  //   for (let i = 0; i < this.vestingSchedule.value.vestingPeriods; i + 1) {
  //     if (durationAfterEndTime > durationInVestingPeriod) {
  //       durationInVestingPeriod = durationInVestingPeriod + this.vestingSchedule.value.durations[i];
  //       totalPercentageEligibleForClaim = totalPercentageEligibleForClaim + this.vestingSchedule.value.percentages[i];
  //     }
  //   }
  //   const eligibleAmountToClaim = (totalAmount * totalPercentageEligibleForClaim) / 100;

  //   return eligibleAmountToClaim;
  // }

  // eslint-disable-next-line no-unused-vars
  claim(idoAsa: Asset): void {
    // this.expandOpcodeBugdet();
    // can claim after the campaign is over and according to the vesting schedule
    assert(this.campaign.exists);
    // assert(this.vestingSchedule.exists);
    assert(this.isApproved());
    assert(this.campaign.value.endTime < globals.latestTimestamp);
    assert(this.investments(this.txn.sender).exists);

    const totalClaimableAmount = (this.investments(this.txn.sender).value * 100) / this.campaign.value.conversionRate;
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
  withdrawInvestment(investmentAsa: Asset): void {
    // if a wallet bought tokens during the voting period due to hypelisting
    // they can withdraw their tokens if the campaign did not collected required votes
    assert(this.campaign.exists);
    assert(!this.isApproved());
    assert(this.campaign.value.startTime > globals.latestTimestamp);
    assert(this.investments(this.txn.sender).exists);

    sendAssetTransfer({
      sender: this.app.address,
      assetReceiver: this.txn.sender,
      xferAsset: this.investmentAsaId.value,
      assetAmount: this.investments(this.txn.sender).value,
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
    assert(this.campaign.value.endTime > globals.latestTimestamp);
    if (this.isApproved()) {
      const totalUnsoldAmount = this.campaign.value.maxTotalInvestment - this.campaign.value.investedAmount;
      assert(totalUnsoldAmount > 0);
      sendAssetTransfer({
        sender: this.app.address,
        assetReceiver: this.txn.sender,
        xferAsset: idoAsa,
        assetAmount: (totalUnsoldAmount * 100) / this.campaign.value.conversionRate,
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

  withdrawSales(investmentAsa: Asset): void {
    // to be called only by the contract creator after the campaign is over
    // to allow them to withdaw all or part of the sale/invest tokens.
    assert(this.campaign.exists);
    verifyTxn(this.txn, { sender: this.admin.value });
    assert(this.campaign.value.endTime > globals.latestTimestamp);
    // TODO: We might want to introduce some vesting schedule for admin as well
    sendAssetTransfer({
      sender: this.app.address,
      assetReceiver: this.txn.sender,
      xferAsset: investmentAsa,
      assetAmount: this.app.address.assetBalance(investmentAsa),
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

  getAccountTotalInvestment(account: Account): number {
    return this.investments(account).value;
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

  getInvestmentAsa(): Asset {
    return this.investmentAsaId.value;
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
    investmentAsa: Asset,
    conversionRate: number,
    maxInvestmentPerAccount: number,
    minTotalInvestment: number,
    maxTotalInvestment: number,
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
        investmentAsa,
        conversionRate,
        maxInvestmentPerAccount,
        minTotalInvestment,
        maxTotalInvestment,
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
