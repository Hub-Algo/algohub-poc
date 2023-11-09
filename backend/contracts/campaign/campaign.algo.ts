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

// eslint-disable-next-line no-unused-vars
export default class Campaign extends Contract {
  idoAsaId = GlobalStateKey<Asset>();

  buyAsaId = GlobalStateKey<Asset>();

  votersAsaId = GlobalStateKey<Asset>();

  votesTotal = GlobalStateKey<number>();

  votesInFavor = GlobalStateKey<number>();

  campaign = GlobalStateKey<CampaignObj>();

  vestingSchedule = GlobalStateKey<VestingSchedule>();

  @allow.bareCreate()
  createApplication(): void {}

  // eslint-disable-next-line no-unused-vars
  // createApplication() // votersAsa: Asset,
  // // idoAsa: Asset,
  // // buyAsa: Asset,
  // // price: number,
  // // maxBuyCap: number,
  // // softCap: number,
  // // hardCap: number,
  // // startTime: number,
  // // endTime: number,
  // // vestingSchedule: number,
  // // metadataUrl: string
  // : void {
  //   // this.votersAsaId.value = votersAsa;
  //   // this.idoAsaId.value = idoAsa;
  //   // this.buyAsaId.value = buyAsa;
  //   // this.campaign.value = {
  //   //   price: price,
  //   //   maxBuyCap: maxBuyCap,
  //   //   softCap: softCap,
  //   //   hardCap: hardCap,
  //   //   startTime: startTime,
  //   //   endTime: endTime,
  //   //   metadataUrl: metadataUrl,
  //   // };
  //   // this.vestingSchedule.value = {
  //   //   x: vestingSchedule,
  //   // };
  // }

  createCampaign(
    // votersAsa: Asset,
    // idoAsa: Asset,
    // buyAsa: Asset,
    price: number,
    maxBuyCap: number,
    softCap: number,
    hardCap: number,
    startTime: number,
    endTime: number,
    // vestingSchedule: number,
    metadataUrl: string
  ): void {
    // this.votersAsaId.value = votersAsa;
    // this.idoAsaId.value = idoAsa;
    // this.buyAsaId.value = buyAsa;
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

// eslint-disable-next-line no-unused-vars
export class AlgohubCampaignFactory extends Contract {
  algohubCampaigns = GlobalStateKey<Application[]>();

  @allow.bareCreate('OptIn')
  createApplication(): void {}

  createCampaign(
    price: number,
    maxBuyCap: number,
    softCap: number,
    hardCap: number,
    startTime: number,
    endTime: number,
    metadataUrl: string
  ): Application {
    sendMethodCall<[], void>({
      name: 'createApplication',
      clearStateProgram: Campaign.clearProgram(),
      approvalProgram: Campaign.approvalProgram(),
      globalNumByteSlice: 5,
      globalNumUint: 2,
    });

    const factoryApp = this.itxn.createdApplicationID;

    sendPayment({
      amount: 200_000,
      receiver: factoryApp.address,
    });
    if (this.algohubCampaigns.exists) {
      this.algohubCampaigns.value.push(factoryApp);
    } else {
      const newApp: Application[] = [factoryApp];
      this.algohubCampaigns.value = newApp;
    }

    sendMethodCall<[number, number, number, number, number, number, string], void>({
      applicationID: factoryApp,
      name: 'createCampaign',
      methodArgs: [price, maxBuyCap, softCap, hardCap, startTime, endTime, metadataUrl],
    });

    return factoryApp;
  }

  getAllCampaignApps(): Application[] {
    return this.algohubCampaigns.value;
  }
}
