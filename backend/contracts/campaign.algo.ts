import { Contract } from '@algorandfoundation/tealscript';

type VestingSchedule = {
  x: number;
};

// 2850

type CampaignObj = {
  price: number;
  maxBuyCap: number;
  softCap: number;
  hardCap: number;
  startTime: number;
  endTime: number;
  metadataUrl: string;
};

// eslint-disable-next-line no-unused-vars
class Campaign extends Contract {
  idoAsaId = GlobalStateKey<Asset>();

  buyAsaId = GlobalStateKey<Asset>();

  votersAsaId = GlobalStateKey<Asset>();

  votesTotal = GlobalStateKey<number>();

  votesInFavor = GlobalStateKey<number>();

  campaign = GlobalStateKey<CampaignObj>();

  vestingSchedule = GlobalStateKey<VestingSchedule>();

  // eslint-disable-next-line no-unused-vars
  createApplication(
    votersAsa: Asset,
    idoAsa: Asset,
    buyAsa: Asset,
    price: number,
    maxBuyCap: number,
    softCap: number,
    hardCap: number,
    startTime: number,
    endTime: number,
    vestingSchedule: number,
    metadataUrl: string
  ): void {
    this.votersAsaId.value = votersAsa;
    this.idoAsaId.value = idoAsa;
    this.buyAsaId.value = buyAsa;
    this.campaign.value = {
      price: price,
      maxBuyCap: maxBuyCap,
      softCap: softCap,
      hardCap: hardCap,
      startTime: startTime,
      endTime: endTime,
      metadataUrl: metadataUrl,
    };

    this.vestingSchedule.value = {
      x: vestingSchedule,
    };
  }

  buy(): void {
    // anyone can buy IDO tokens after the campaign is approved and 'on_going'
    // addresses in hypelist can buy tokens even during the voting period
  }

  claim(): void {
    // can claim after the campaign is over and according to the vesting schedule
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
  vote(inFavor: boolean, votersAsa: Asset): void {
    assert(this.txn.sender.assetBalance(this.votersAsaId.value) > 1);
    this.votesTotal.value = this.votesTotal.value + 1;
    if (inFavor) {
      this.votesInFavor.value = this.votesInFavor.value + 1;
    }
  }

  getCampaign(): CampaignObj {
    return this.campaign.value;
  }

  getVestingSchedule(): VestingSchedule {
    return this.vestingSchedule.value;
  }

  private canVote(): boolean {
    // Who and when can the caller vote?
    return true;
  }

  private isApproved(): boolean {
    // add quorum and approve % logic
    return true;
  }

  private isHypelisted(): boolean {
    // Check if caller is hypelisted
    return true;
  }
}
