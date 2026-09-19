import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import type { ContractProviders } from '@midnight-ntwrk/midnight-js-contracts';

import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';

import { auraAidContract } from './auraAidContract.ts';
import { auraAidPrivateStateProvider } from './privateStateProvider.ts';
import { createAuraAidProofProvider } from './proofProvider.ts';
import {
  DappConnectorMidnightProvider,
  DappConnectorWalletProvider,
  getWalletKeys,
} from './dappWalletProvider.ts';
import { auraAidZkConfig } from './zkConfig.ts';
import { MIDNIGHT_ENDPOINTS } from './network.ts';

import type { Contract as AuraAidGeneratedContract } from '../../../contract/managed/contract/index.js';

/**
 * Provider bundle for the AuraAid contract.
 *
 * ContractProviders derives the actual provable circuit IDs from the
 * generated contract, including createCampaign and donate.
 */
export type AuraAidProviders =
  ContractProviders<AuraAidGeneratedContract>;

export async function createAuraAidProviders(
  api: ConnectedAPI,
): Promise<AuraAidProviders> {
  const keys = await getWalletKeys(api);

  const walletProvider = new DappConnectorWalletProvider(api, keys);

  const proofProvider = await createAuraAidProofProvider(api);

  const publicDataProvider = indexerPublicDataProvider(
    MIDNIGHT_ENDPOINTS.indexerHttp,
    MIDNIGHT_ENDPOINTS.indexerWs,
  );

  const midnightProvider = new DappConnectorMidnightProvider(api);

  const providers: AuraAidProviders = {
    privateStateProvider: auraAidPrivateStateProvider,
    publicDataProvider,
    zkConfigProvider: auraAidZkConfig,
    proofProvider,
    walletProvider,
    midnightProvider,
  };

  return providers;
}

export { auraAidContract };
