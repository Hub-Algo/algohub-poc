/* eslint-disable no-restricted-syntax */
import * as fs from 'fs';
import * as path from 'path';
import { consoleLogger } from '@algorandfoundation/algokit-utils/types/logging';
import * as algokit from '@algorandfoundation/algokit-utils';

algokit.Config.configure({
  logger: consoleLogger,
});

// base directory
const baseDir = path.resolve(__dirname);

// function to validate and dynamically import a module
// eslint-disable-next-line consistent-return
async function importDeployerIfExists(dir: string) {
  const deployerPath = path.resolve(dir, 'deploy-config');
  if (fs.existsSync(`${deployerPath}.ts`) || fs.existsSync(`${deployerPath}.js`)) {
    const deployer = await import(deployerPath);
    return deployer.deploy;
  }
}

// get a list of all deployers from the subdirectories
async function getDeployers() {
  const directories = fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => path.resolve(baseDir, dirent.name));

  return Promise.all(directories.map(importDeployerIfExists));
}

// execute all the deployers
(async () => {
  const contractDeployers = (await getDeployers()).filter(Boolean);

  for (const deployer of contractDeployers) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await deployer();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }
})();
