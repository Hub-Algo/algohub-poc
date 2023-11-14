import * as algokit from '@algorandfoundation/algokit-utils';
import { microAlgos } from '@algorandfoundation/algokit-utils';
import { AlgohubClient } from '../clients/AlgohubClient';

const ALGO_TO_VOTE_RATIO: number = 10;
const VIP_VOTE_WEIGHT: number = 125;
const TOTAL_VOTERS: number = 1_000_000;
// TODO: Make sure to change it for mainnet deployment
const VOTING_PERIOD: number = 60 * 60; // 1h for testing purposes

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
  const campaignFactory = new AlgohubClient(
    {
      resolveBy: 'creatorAndName',
      findExistingUsing: indexer,
      sender: deployer,
      creatorAddress: deployer.addr,
    },
    algod
  );

  const factory = await campaignFactory.deploy({
    // allowDelete: true,
    onUpdate: 'append',
    onSchemaBreak: 'replace',
    version: '0.0.2',
    createCall: (calls) =>
      calls.createApplication({
        algoToVoteRatio: ALGO_TO_VOTE_RATIO,
        vipVoteWeight: VIP_VOTE_WEIGHT,
        votingPeriod: VOTING_PERIOD,
      }),
  });
  // If app was just created fund the app account
  if (['create', 'replace'].includes(factory.operationPerformed)) {
    await algokit.transferAlgos(
      {
        amount: algokit.algos(0.5),
        from: deployer,
        to: factory.appAddress,
      },
      algod
    );
  }
  if (['create'].includes(factory.operationPerformed)) {
    const bootsrapResult = await campaignFactory.bootstrap(
      { voteAsaTotal: TOTAL_VOTERS },
      {
        sendParams: {
          fee: microAlgos(3_000),
        },
      }
    );
    console.log('VoteASA -->', bootsrapResult.return);
  }

  const method = 'getAllCampaignApps';
  const response = await campaignFactory.getAllCampaignApps({});
  console.log(`Called ${method} on ${factory.name} (${factory.appId}), received: ${response.return}`);
}
