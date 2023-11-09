import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { microAlgos } from '@algorandfoundation/algokit-utils/.';
import { CampaignClient } from '../contracts/clients/CampaignClient';
import { campaign } from './campaignFactory.test';

const fixture = algorandFixture();

let appClient: CampaignClient;

describe.skip('Campaign', () => {
  beforeEach(fixture.beforeEach);

  beforeAll(async () => {
    await fixture.beforeEach();
    const { algod, testAccount } = fixture.context;

    appClient = new CampaignClient(
      {
        sender: testAccount,
        resolveBy: 'id',
        id: 0,
      },
      algod
    );

    await appClient.create.createApplication({});
    await appClient.appClient.fundAppAccount(microAlgos(200_000));
  });
  test('app creation', async () => {
    await appClient.createCampaign({
      price: campaign.price,
      maxBuyCap: campaign.maxBuyCap,
      softCap: campaign.softCap,
      hardCap: campaign.hardCap,
      startTime: campaign.startTime,
      endTime: campaign.endTime,
      metadataUrl: campaign.metadataUrl,
    });
    const campaignDetails = await appClient.getCampaign({});
    console.log(campaignDetails.return);
  });
});
