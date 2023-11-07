import * as algokit from '@algorandfoundation/algokit-utils';
import { VotersClient } from '../clients/VotersClient';

// Below is a showcase of various deployment options you can use in TypeScript Client
export async function deploy() {
  console.log('=== Deploying Voters Contract ===');

  const algod = algokit.getAlgoClient();
  const indexer = algokit.getAlgoIndexerClient();
  const deployer = algokit.mnemonicAccount(process.env.DEPLOYER_MNEMONIC || '');

  await algokit.ensureFunded(
    {
      accountToFund: deployer,
      minSpendingBalance: algokit.algos(2),
      minFundingIncrement: algokit.algos(2),
    },
    algod
  );
  const appClient = new VotersClient(
    {
      resolveBy: 'creatorAndName',
      findExistingUsing: indexer,
      sender: deployer,
      creatorAddress: deployer.addr,
    },
    algod
  );
  const isMainNet = await algokit.isMainNet(algod);
  const app = await appClient.deploy({
    allowDelete: !isMainNet,
    allowUpdate: !isMainNet,
    onSchemaBreak: isMainNet ? 'append' : 'replace',
    onUpdate: isMainNet ? 'append' : 'update',
  });

  // If app was just created fund the app account
  if (['create', 'replace'].includes(app.operationPerformed)) {
    algokit.transferAlgos(
      {
        amount: algokit.algos(1),
        from: deployer,
        to: app.appAddress,
      },
      algod
    );
  }

  const method = 'hello';
  const response = await appClient.getVoterssDetails({});
  console.log(`Called ${method} on ${app.name} (${app.appId}) with name = world, received: ${response.return}`);
}
