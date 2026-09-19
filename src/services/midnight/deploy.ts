import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';

import { auraAidContract } from './auraAidContract.ts';
import { createAuraAidProviders } from './providers.ts';

export interface AuraAidDeploymentResult {
  contractAddress: string;
  transactionId: string;
}

export async function deployAuraAidContract(
  api: ConnectedAPI,
): Promise<AuraAidDeploymentResult> {
  const providers = await createAuraAidProviders(api);

  const deployed = await deployContract(providers, {
    compiledContract: auraAidContract,
  });

  const contractAddress = deployed.deployTxData.public.contractAddress;

  const transactionId = deployed.deployTxData.public.txId;

  return {
    contractAddress,
    transactionId,
  };
}
