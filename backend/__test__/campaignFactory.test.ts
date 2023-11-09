import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { algos, getOrCreateKmdWalletAccount, microAlgos } from '@algorandfoundation/algokit-utils/.';
// import { VotersClient } from '../contracts/clients/VotersClient';
import algosdk from 'algosdk';
import { AlgohubCampaignFactoryClient } from '../contracts/clients/AlgohubCampaignFactory';
import { CampaignClient } from '../contracts/clients/CampaignClient';

const fixture = algorandFixture();

let appClient: AlgohubCampaignFactoryClient;
// let votersClient: VotersClient;

export const campaign = {
  price: 10,
  maxBuyCap: 5,
  softCap: 100,
  hardCap: 120,
  startTime: 0,
  endTime: 0,
  metadataUrl: 'https://google.com',
};
describe('Campaign Factory', () => {
  let sender1: algosdk.Account;
  let algod: algosdk.Algodv2;

  // const algoToVoteRatio: number = 10;
  // const vipVoteWeight: number = 10;

  beforeEach(fixture.beforeEach);

  beforeAll(async () => {
    await fixture.beforeEach();
    const { testAccount, kmd } = fixture.context;
    algod = fixture.context.algod;

    sender1 = await getOrCreateKmdWalletAccount(
      {
        name: 'sender-1',
        fundWith: algos(10000),
      },
      algod,
      kmd
    );

    appClient = new AlgohubCampaignFactoryClient(
      {
        sender: testAccount,
        resolveBy: 'id',
        id: 0,
      },
      algod
    );

    await appClient.create.createApplication({});

    await appClient.appClient.fundAppAccount(microAlgos(1_000_000));

    // votersClient = new VotersClient(
    //   {
    //     sender: testAccount,
    //     resolveBy: 'id',
    //     id: 0,
    //   },
    //   algod
    // );

    // await votersClient.create.createApplication({
    //   algoToVoteRatio,
    //   vipVoteWeight,
    // });
  });
  test('app creation', async () => {
    campaign.startTime = Math.floor(Date.now() / 1000);
    campaign.endTime = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // One day later
    const createCampaignTx = await appClient.createCampaign(
      {
        price: campaign.price,
        maxBuyCap: campaign.maxBuyCap,
        softCap: campaign.softCap,
        hardCap: campaign.hardCap,
        startTime: campaign.startTime,
        endTime: campaign.endTime,
        metadataUrl: campaign.metadataUrl,
      },
      {
        sender: sender1,
        sendParams: {
          fee: microAlgos(4_000),
        },
      }
    );
    const campaignAppId = createCampaignTx.return;
    const allCampaigns = await appClient.getAllCampaignApps({});
    expect(campaignAppId).toBe(allCampaigns.return?.at(0));

    const campaignContract = new CampaignClient(
      {
        sender: sender1,
        resolveBy: 'id',
        id: campaignAppId!,
      },
      algod
    );
    const campaignDetails = await campaignContract.getCampaign({});

    expect(campaignDetails.return?.at(0)).toBe(BigInt(campaign.price));
    expect(campaignDetails.return?.at(1)).toBe(BigInt(campaign.maxBuyCap));
    expect(campaignDetails.return?.at(2)).toBe(BigInt(campaign.softCap));
    expect(campaignDetails.return?.at(3)).toBe(BigInt(campaign.hardCap));
    expect(campaignDetails.return?.at(4)).toBe(BigInt(campaign.startTime));
    expect(campaignDetails.return?.at(5)).toBe(BigInt(campaign.endTime));
    expect(campaignDetails.return?.at(6)).toBe(campaign.metadataUrl);
  });
});
