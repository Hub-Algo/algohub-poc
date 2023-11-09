import * as algokit from '@algorandfoundation/algokit-utils';
import { AlgohubCampaignFactoryClient } from '../clients/AlgohubCampaignFactory';

// Below is a showcase of various deployment options you can use in TypeScript Client
export async function deploy() {
  console.log('=== Deploying Algohub Factory Contract ===');

  const algod = algokit.getAlgoClient();
  const indexer = algokit.getAlgoIndexerClient();
  const deployer = await algokit.mnemonicAccountFromEnvironment(
    { name: 'DEPLOYER', fundWith: algokit.algos(5) },
    algod
  );

  await algokit.ensureFunded(
    {
      accountToFund: deployer,
      minSpendingBalance: algokit.algos(4),
      minFundingIncrement: algokit.algos(4),
    },
    algod
  );
  const campaignFactory = new AlgohubCampaignFactoryClient(
    {
      resolveBy: 'creatorAndName',
      findExistingUsing: indexer,
      sender: deployer,
      creatorAddress: deployer.addr,
    },
    algod
  );

  const factory = await campaignFactory.deploy({
    onUpdate: 'append',
    createCall: (calls) => calls.createApplication({}),
  });
  // If app was just created fund the app account
  if (['create', 'replace'].includes(factory.operationPerformed)) {
    algokit.transferAlgos(
      {
        amount: algokit.algos(1),
        from: deployer,
        to: factory.appAddress,
      },
      algod
    );
  }

  const method = 'getAllCampaignApps';
  const response = await campaignFactory.getAllCampaignApps({});
  console.log(`Called ${method} on ${factory.name} (${factory.appId}), received: ${response.return}`);
}