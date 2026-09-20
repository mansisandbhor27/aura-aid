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

  console.log('[AURA DEPLOY] calling deployContract...');

  try {
    const deployed = await deployContract(providers, {
      compiledContract: auraAidContract,
    });

    console.log('[AURA DEPLOY] deployContract returned');
    console.log('[AURA DEPLOY] deployTxData:', deployed.deployTxData);
    console.log(
      '[AURA DEPLOY] public deployment data:',
      deployed.deployTxData.public,
    );

    const contractAddress = deployed.deployTxData.public.contractAddress;
    const transactionId = deployed.deployTxData.public.txId;

    console.log('[AURA DEPLOY] contract address:', contractAddress);
    console.log('[AURA DEPLOY] deployment tx id:', transactionId);

    return {
      contractAddress,
      transactionId,
    };
  } catch (error) {
    console.error('[AURA DEPLOY] deployContract FAILED:', error);
    throw error;
  }
}
