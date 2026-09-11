import { getNetworkId, setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

/**
 * Canonical Midnight network configuration for AuraAid.
 * Verified against `@midnight-ntwrk/midnight-js-network-id@4.1.1`
 * (only exports: setNetworkId / getNetworkId).
 *
 * The dApp-connector `connect(networkId)` call takes the same
 * network id string; Preprod uses 'preprod'.
 */

export const MIDNIGHT_NETWORK_ID = 'preprod';

export const MIDNIGHT_ENDPOINTS = {
  nodeRpc: 'https://rpc.preprod.midnight.network',
  nodeWs: 'wss://rpc.preprod.midnight.network',
  indexerHttp: 'https://indexer.preprod.midnight.network/api/v4/graphql',
  indexerWs: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
  proofServer: 'http://localhost:6300',
  explorer: 'https://preprod.midnightexplorer.com',
  faucet: 'https://midnight-tmnight-preprod.nethermind.dev',
} as const;

let configured = false;

/** Idempotently set the global Midnight network id to Preprod. */
export function ensurePreprodNetwork(): string {
  try {
    if (getNetworkId() === MIDNIGHT_NETWORK_ID) {
      configured = true;
      return MIDNIGHT_NETWORK_ID;
    }
  } catch {
    // Not configured yet — fall through to set it.
  }
  setNetworkId(MIDNIGHT_NETWORK_ID);
  configured = true;
  return MIDNIGHT_NETWORK_ID;
}

export function isNetworkConfigured(): boolean {
  return configured;
}

/** Read VITE_ env overrides only; never secrets. No private keys here. */
export function readPublicEnv() {
  const env = import.meta.env;
  return {
    networkId: (env.VITE_MIDNIGHT_NETWORK_ID as string | undefined) ?? MIDNIGHT_NETWORK_ID,
    contractAddress: (env.VITE_AURA_AID_CONTRACT_ADDRESS as string | undefined) ?? '',
    nodeRpc: (env.VITE_MIDNIGHT_NODE_RPC as string | undefined) ?? MIDNIGHT_ENDPOINTS.nodeRpc,
    indexerHttp: (env.VITE_MIDNIGHT_INDEXER_URL as string | undefined) ?? MIDNIGHT_ENDPOINTS.indexerHttp,
  };
}
