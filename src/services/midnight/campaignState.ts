import { getPublicStates } from '@midnight-ntwrk/midnight-js-contracts';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';

import { ledger } from '../../../contract/managed/contract/index.js';
import { MIDNIGHT_ENDPOINTS } from './network.ts';

const publicDataProvider = indexerPublicDataProvider(
  MIDNIGHT_ENDPOINTS.indexerHttp,
  MIDNIGHT_ENDPOINTS.indexerWs,
);

export const TOKEN_DECIMALS = 1_000_000n;

export async function readCampaignBalances(
  contractAddress: string,
): Promise<Map<number, number>> {
  const balances = new Map<number, number>();

  const states = await getPublicStates(
    publicDataProvider,
    contractAddress,
  );

  if (!states?.contractState?.data) {
    return balances;
  }

  const state = ledger(
    states.contractState.data as never,
  );

  for (const [campaignId, balance] of state.campaignBalances) {
    const id = Number(campaignId);

    const amount =
      Number(balance) /
      Number(TOKEN_DECIMALS);

    balances.set(id, amount);
  }

  console.log(
    '[AURA CAMPAIGN] On-chain balances:',
    Object.fromEntries(balances),
  );

  return balances;
}
