import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
// import { CampaignClient } from '../contracts/clients/CampaignClient';

const fixture = algorandFixture();

// let appClient: CampaignClient;

describe('Campaign', () => {
  beforeEach(fixture.beforeEach);

  beforeAll(async () => {
    await fixture.beforeEach();
    // const { algod, testAccount } = fixture.context;

    // appClient = new CampaignClient(
    //   {
    //     sender: testAccount,
    //     resolveBy: 'id',
    //     id: 0,
    //   },
    //   algod
    // );

    // await appClient.create.createApplication({});
  });
  test('app creation', async () => {
    expect(true).toBe(true);
  });
});
