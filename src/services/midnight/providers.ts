import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import type { ContractProviders } from '@midnight-ntwrk/midnight-js-contracts';

import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';

import { auraAidContract } from './auraAidContract.ts';
import { createAuraAidProofProvider } from './proofProvider.ts';

import {
  DappConnectorMidnightProvider,
  DappConnectorWalletProvider,
  getWalletKeys,
} from './dappWalletProvider.ts';

import { auraAidZkConfig } from './zkConfig.ts';
import { MIDNIGHT_ENDPOINTS } from './network.ts';

import type { Contract as AuraAidGeneratedContract } from '../../../contract/managed/contract/index.js';

export type AuraAidProviders =
  ContractProviders<AuraAidGeneratedContract>;

export async function createAuraAidProviders(
  api: ConnectedAPI,
): Promise<AuraAidProviders> {

  const keys = await getWalletKeys(api);

  const walletProvider =
    new DappConnectorWalletProvider(api, keys);

  const proofProvider =
    await createAuraAidProofProvider(api);

  const publicDataProvider =
    indexerPublicDataProvider(
      MIDNIGHT_ENDPOINTS.indexerHttp,
      MIDNIGHT_ENDPOINTS.indexerWs,
    );

  const midnightProvider =
    new DappConnectorMidnightProvider(api);

  /*
   * AuraAid contract has no witnesses/private state.
   *
   * Midnight JS 4.x still expects the Level private-state
   * provider configuration to contain an accountId and
   * encryption password provider.
   */
  const privateStateProvider =
    levelPrivateStateProvider({
      privateStateStoreName: 'aura-aid-state',

      accountId: keys.shieldedAddress,

      privateStoragePasswordProvider: () =>
        'aura-aid-local-development-password-2026',
    });

  const providers: AuraAidProviders = {
    privateStateProvider,
    publicDataProvider,
    zkConfigProvider: auraAidZkConfig,
    proofProvider,
    walletProvider,
    midnightProvider,
  };

  return providers;
}

export { auraAidContract };