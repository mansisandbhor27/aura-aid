import { dappConnectorProofProvider } from '@midnight-ntwrk/midnight-js-dapp-connector-proof-provider';
import { CostModel } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import type { ProofProvider } from '@midnight-ntwrk/midnight-js-types';
import { auraAidZkConfig } from './zkConfig.ts';

export async function createAuraAidProofProvider(
  api: ConnectedAPI,
): Promise<ProofProvider> {
  const costModel = CostModel.initialCostModel();

  return dappConnectorProofProvider(
    api,
    auraAidZkConfig,
    costModel,
  );
}
