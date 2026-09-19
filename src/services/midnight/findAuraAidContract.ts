import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';

import { auraAidContract } from './auraAidContract.ts';
import { createAuraAidProviders } from './providers.ts';

/**
 * Locate an already-deployed AuraAid contract.
 *
 * This function only performs the deployed-contract lookup.
 * It does not call any circuit or submit any transaction.
 */
export async function findAuraAidContract(
  api: ConnectedAPI,
  contractAddress: string,
) {
  const trimmedAddress = contractAddress.trim();

  if (!trimmedAddress) {
    throw new Error('No AuraAid contract address configured.');
  }

  try {
    const providers = await createAuraAidProviders(api);

    return await findDeployedContract(providers, {
      compiledContract: auraAidContract,
      contractAddress: trimmedAddress,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to locate the AuraAid contract on Midnight.';

    throw new Error(message);
  }
}
