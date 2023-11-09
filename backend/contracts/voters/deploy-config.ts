import * as algokit from '@algorandfoundation/algokit-utils';
import { VotersClient } from '../clients/VotersClient';

// Below is a showcase of various deployment options you can use in TypeScript Client
export async function deploy() {
  console.log('=== Deploying Voters Contract ===');

  const algod = algokit.getAlgoClient();
  const indexer = algokit.getAlgoIndexerClient();
  const deployer = await algokit.mnemonicAccountFromEnvironment(
    { name: 'DEPLOYER', fundWith: algokit.algos(5) },
    algod
  );

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

  const algoToVoteRatio: number = 10;
  const vipVoteWeight: number = 125;

  // const isMainNet = await algokit.isMainNet(algod);
  const app = await appClient.deploy({
    createCall: (calls) => calls.createApplication({ algoToVoteRatio, vipVoteWeight }),
    deployTimeParams: {
      algoToVoteRatio,
      vipVoteWeight,
    },
  });
  // const app = await appClient.deploy({
  // allowDelete: !isMainNet,
  // allowUpdate: !isMainNet,
  // onSchemaBreak: isMainNet ? 'append' : 'replace',
  // onUpdate: isMainNet ? 'append' : 'update',
  //   deployTimeParams: {
  //     algoToVoteRatio,
  //     vipVoteWeight,
  //   },
  // });

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

  const method = 'getVotersDetails';
  const response = await appClient.getVotersDetails({});
  console.log(`Called ${method} on ${app.name} (${app.appId}), received: ${response.return}`);
}
