import { Contract } from '@algorandfoundation/tealscript';

type AlgohubVotes = {
  algoToVoteRation: number;
  vipVoteWeight: number;
  totalVotes: number;
};

// eslint-disable-next-line no-unused-vars
export default class Voters extends Contract {
  votersAsaId = GlobalStateKey<Asset>();

  algoToVoteRation = GlobalStateKey<number>();

  vipVoteWeight = GlobalStateKey<number>();

  totalVotes = GlobalStateKey<number>();

  vipVoters = GlobalStateMap<Address, boolean>({ maxKeys: 50 });
  // vipVoters = BoxMap<Address, boolean>();

  // eslint-disable-next-line no-unused-vars
  createApplication(algoToVoteRatio: number, vipVoteWeight: number): void {
    this.algoToVoteRation.value = algoToVoteRatio;
    this.vipVoteWeight.value = vipVoteWeight;
  }

  private doAxfer(receiver: Account, asset: Asset, amount: uint64): void {
    sendAssetTransfer({
      assetReceiver: receiver,
      xferAsset: asset,
      assetAmount: amount,
    });
  }

  private doOptIn(asset: Asset): void {
    this.doAxfer(this.app.address, asset, 0);
  }

  bootstrap(voteAsaTotal: number): Asset {
    verifyTxn(this.txn, { sender: this.app.creator });
    assert(!this.votersAsaId.exists);
    const votersAsa = sendAssetCreation({
      configAssetName: 'AlgoHub Vote',
      configAssetUnitName: 'AHV',
      configAssetDecimals: 18,
      configAssetTotal: voteAsaTotal,
      configAssetFreeze: this.app.address,
    });
    this.votersAsaId.value = votersAsa;
    this.doOptIn(votersAsa);
    return votersAsa;
  }

  // eslint-disable-next-line no-unused-vars
  // optInToApplication(votersAsa: Asset): void {
  // eslint-disable-next-line no-unused-vars
  register(votersAsa: Asset): void {
    /// Verify a ASA hasn't already been opted into
    assert(this.txn.sender.assetBalance(this.votersAsaId.value) === 0);
    /// Verify that the balance is higher than the minimum algo to vote ratio
    assert(this.txn.sender.balance >= this.algoToVoteRation.value);
    sendAssetTransfer({
      xferAsset: this.votersAsaId.value,
      assetReceiver: this.txn.sender,
      assetAmount: 1,
    });
    sendAssetFreeze({
      freezeAsset: this.votersAsaId.value,
      freezeAssetAccount: this.txn.sender,
      freezeAssetFrozen: true,
    });
    // const votes = Math.floor(this.txn.sender.balance / this.algoToVoteRation.value);
    this.totalVotes.value = this.totalVotes.value + 1;
  }

  // eslint-disable-next-line no-unused-vars
  unregister(votersAsa: Asset): void {
    /// Verify a ASA has already been opted into
    assert(this.txn.sender.assetBalance(this.votersAsaId.value) === 1);
    // unfreeze the asset for the sender
    sendAssetFreeze({
      freezeAsset: this.votersAsaId.value,
      freezeAssetAccount: this.txn.sender,
      freezeAssetFrozen: false,
    });
    // and transfer it back to the app
    sendAssetTransfer({
      xferAsset: this.votersAsaId.value,
      assetReceiver: this.app.address,
      assetAmount: 1,
    });
    // better handling here???
    this.totalVotes.value = this.totalVotes.value - 1;
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
    // TODO: something seems off with getting the asset balance on-chain ....
    // if (account.hasAsset(this.votersAsaId.value) === 0) return 0;
    // if (account.assetBalance(this.votersAsaId.value) === 0) return 0;
    if (this.vipVoters(account).value) return 125;
    return 100;
  }

  getTotalVoters(): number {
    return this.totalVotes.value;
  }

  getVIPStatus(account: Account): boolean {
    return this.vipVoters(account).value;
  }

  // eslint-disable-next-line no-unused-vars
  setVIPStatus(account: Account, isVIP: boolean, votersAsa: Asset): void {
    /// Only allow app creator to set VIP status
    verifyTxn(this.txn, { sender: globals.creatorAddress });
    // TODO: Add check to make sure that account is already opted-in
    // assert(account.assetBalance(this.votersAsaId.value) === 1);
    this.vipVoters(account).value = isVIP;
    // if (isVIP) {
    //   this.vipVoters(account).value = isVIP;
    // }
  }
}
