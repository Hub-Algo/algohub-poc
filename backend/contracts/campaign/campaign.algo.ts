import { Contract } from '@algorandfoundation/tealscript';

type VestingSchedule = {
  x: number;
};

type CampaignObj = {
  price: number;
  maxBuyCap: number;
  softCap: number;
  hardCap: number;
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
  idoAsaId = GlobalStateKey<Asset>();

  buyAsaId = GlobalStateKey<Asset>();

  votersAsaId = GlobalStateKey<Asset>();

  votesTotal = GlobalStateKey<number>();

  votesInFavor = GlobalStateKey<number>();

  inFavor = BoxMap<Address, boolean>();

  campaign = GlobalStateKey<CampaignObj>();

  isApprovedCampaign = GlobalStateKey<boolean>();

  vestingSchedule = GlobalStateKey<VestingSchedule>();

  // eslint-disable-next-line no-unused-vars
  createApplication(): void {
    this.votersAsaId.value = Asset.zeroIndex;
    this.idoAsaId.value = Asset.zeroIndex;
    this.buyAsaId.value = Asset.zeroIndex;
    this.isApprovedCampaign.value = false;
  }

  /// ========================
  /// ==== Private Methods ===
  /// ========================
  private isApproved(): boolean {
    if (!this.isApprovedCampaign.value) {
      // TODO: Check quorum + voting logic
      return true;
    }
    return this.isApprovedCampaign.value;
  }

  private isHypelisted(): boolean {
    // Check if caller is hypelisted
    return true;
  }

  createCampaign(
    votersAsa: Asset,
    price: number,
    maxBuyCap: number,
    softCap: number,
    hardCap: number,
    startTime: number,
    endTime: number,
    // vestingSchedule: number,
    metadataUrl: string
  ): void {
    this.votersAsaId.value = votersAsa;
    this.campaign.value = {
      price: price,
      maxBuyCap: maxBuyCap,
      softCap: softCap,
      hardCap: hardCap,
      startTime: startTime,
      endTime: endTime,
      metadataUrl: metadataUrl,
    };
    // this.vestingSchedule.value = {
    //   x: vestingSchedule,
    // };
  }

  buy(): void {
    assert(this.isApproved());
    if (!this.isApprovedCampaign.value) {
      this.isApprovedCampaign.value = true;
    }

    // anyone can buy IDO tokens after the campaign is approved and 'on_going'
    // addresses in hypelist can buy tokens even during the voting period
  }

  claim(): void {
    // can claim after the campaign is over and according to the vesting schedule
    assert(this.isApproved());
    assert(this.campaign.value.endTime > globals.latestTimestamp);
  }

  withdrawPurchase(): void {
    // if a wallet bought tokens during the voting period due to hypelisting
    // they can withdraw their tokens if the campaign did not collected required votes
  }

  withdrawIdoAsa(): void {
    // to be called only by contract cretator
    // when the campaign reached their softcap but not the hardcap
    // in this case, the contract holds IDO tokens which the creator
    // should be able to withdraw from the contract as they were not sold
  }

  withdrawSales(): void {
    // to be called only by the contract creator after the campaign is over
    // to allow them to withdaw all or part of the sale/buy tokens.
  }

  // eslint-disable-next-line no-unused-vars
  vote(boxMBRPayment: PayTxn, inFavor: boolean, votersAsa: Asset): void {
    assert(this.campaign.value.startTime > globals.latestTimestamp);
    assert(this.txn.sender.assetBalance(this.votersAsaId.value) > 1);
    assert(!this.inFavor(this.txn.sender).exists);

    const preBoxMBR = this.app.address.minBalance;
    this.inFavor(this.txn.sender).value = inFavor;

    verifyTxn(boxMBRPayment, {
      receiver: this.app.address,
      amount: this.app.address.minBalance - preBoxMBR,
    });

    this.votesTotal.value = this.votesTotal.value + 1;
    if (inFavor) {
      this.votesInFavor.value = this.votesInFavor.value + 1;
    }
  }

  getVotes(): [number, number] {
    return [this.votesInFavor.value, this.votesTotal.value];
  }

  getVotersASA(): Asset {
    return this.votersAsaId.value;
  }

  getCampaign(): CampaignObj {
    return this.campaign.value;
  }

  getVestingSchedule(): VestingSchedule {
    return this.vestingSchedule.value;
  }
}

// eslint-disable-next-line no-unused-vars
export class AlgohubMaster extends Contract {
  algohubCampaigns = GlobalStateKey<Application[]>();

  votersAsaId = GlobalStateKey<Asset>();

  algoToVoteRation = GlobalStateKey<number>();

  vipVoteWeight = GlobalStateKey<number>();

  totalVotes = GlobalStateKey<number>();

  vipVoters = GlobalStateMap<Address, boolean>({ maxKeys: 50 });
  // TODO: Switch to BoxMap
  // vipVoters = BoxMap<Account, boolean>();

  // eslint-disable-next-line no-unused-vars
  createApplication(algoToVoteRatio: number, vipVoteWeight: number): void {
    this.algoToVoteRation.value = algoToVoteRatio;
    this.vipVoteWeight.value = vipVoteWeight;
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
      configAssetName: 'AlgoHub Vote',
      configAssetUnitName: 'AHV',
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
    // TODO: Add check to make sure that account is already opted-in
    assert(account.assetBalance(this.votersAsaId.value) === 1);
    this.vipVoters(account).value = isVip;
  }

  /// ========================
  /// ==== Public Methods ====
  /// ========================
  // eslint-disable-next-line no-unused-vars
  createCampaign(
    votersAsa: Asset,
    price: number,
    maxBuyCap: number,
    softCap: number,
    hardCap: number,
    startTime: number,
    endTime: number,
    metadataUrl: string
  ): Application {
    assert(this.votersAsaId.exists);
    sendMethodCall<[], void>({
      name: 'createApplication',
      clearStateProgram: Campaign.clearProgram(),
      approvalProgram: Campaign.approvalProgram(),
      globalNumByteSlice: 6,
      globalNumUint: 3,
    });

    const factoryApp = this.itxn.createdApplicationID;

    sendPayment({
      amount: 300_000,
      receiver: factoryApp.address,
    });
    if (this.algohubCampaigns.exists) {
      this.algohubCampaigns.value.push(factoryApp);
    } else {
      const newApp: Application[] = [factoryApp];
      this.algohubCampaigns.value = newApp;
    }

    sendMethodCall<[Asset, number, number, number, number, number, number, string], void>({
      applicationID: factoryApp,
      name: 'createCampaign',
      methodArgs: [this.votersAsaId.value, price, maxBuyCap, softCap, hardCap, startTime, endTime, metadataUrl],
    });

    return factoryApp;
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
    if (this.vipVoters(account).value) return 125;
    return 100;
  }

  getTotalVoters(): number {
    return this.totalVotes.value;
  }

  getVipStatus(account: Account): boolean {
    return this.vipVoters(account).value;
  }
}
