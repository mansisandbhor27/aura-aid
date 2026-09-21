import type {
  ConnectedAPI,
  InitialAPI,
} from '@midnight-ntwrk/dapp-connector-api';

import {
  ensurePreprodNetwork,
} from './network.ts';

export type ProviderInfo = Pick<
  InitialAPI,
  'rdns' | 'name' | 'icon' | 'apiVersion'
>;

export interface RealState {
  provider: ProviderInfo | null;
  api: ConnectedAPI | null;
  networkId: string | null;
  unshieldedAddress: string | null;
  shieldedAddress: string | null;
  indexerUri: string | null;
  substrateNodeUri: string | null;
  indexerWsUri: string | null;
provingProvider: unknown | null;
}

export type FailReason =
  | 'wallet-unavailable'
  | 'user-rejected'
  | 'network-mismatch'
  | 'internal-error';

export interface WalletResult {
  ok: boolean;
  reason?: FailReason;
  message: string;
  state: RealState;
}

export const GUIDE: string[] = [
  'Install a Midnight-compatible wallet browser extension.',
  'Create or restore a wallet and switch it to Preprod.',
  'Fund the wallet with tNIGHT from the Preprod faucet.',
  'Reload AuraAid in the same browser and connect again.',
];

const EMPTY: RealState = {
  provider: null,
  api: null,
  networkId: null,
  unshieldedAddress: null,
  shieldedAddress: null,
  indexerUri: null,
  indexerWsUri: null,
  substrateNodeUri: null,
  provingProvider: null,
};

export function emptyRealState(): RealState {
  return { ...EMPTY };
}

export function listProviders(): ProviderInfo[] {
  if (typeof window === 'undefined' || !window.midnight) {
    return [];
  }

  return Object.values(window.midnight).map((wallet) => ({
    rdns: wallet.rdns,
    name: wallet.name,
    icon: wallet.icon,
    apiVersion: wallet.apiVersion,
  }));
}

export function hasWallet(): boolean {
  return listProviders().length > 0;
}

function getProvider(rdns?: string): InitialAPI | null {
  if (typeof window === 'undefined' || !window.midnight) {
    return null;
  }

  const wallets = Object.values(window.midnight);

  if (wallets.length === 0) {
    return null;
  }

  // Explicitly prefer Lace Wallet
  const laceWallet = wallets.find(
    (wallet) => wallet.rdns === 'io.lace.wallet'
  );

  if (rdns) {
    return wallets.find((wallet) => wallet.rdns === rdns) ?? null;
  }

  return laceWallet ?? wallets[0] ?? null;
}

function normalizeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Unknown wallet error.';
}

function isUserRejected(error: unknown): boolean {
  const message = normalizeError(error).toLowerCase();

  return (
    message.includes('reject') ||
    message.includes('denied') ||
    message.includes('cancel')
  );
}

/**
 * Connect AuraAid to a Midnight-compatible browser wallet.
 *
 * The wallet connector is network-aware, so we explicitly connect to
 * Midnight Preprod instead of relying on the wallet's current network.
 */
export async function connectWallet(
  rdns?: string,
): Promise<WalletResult> {
  const networkId = ensurePreprodNetwork();
  const provider = getProvider(rdns);

    console.log('[AuraAid] Midnight providers:', listProviders());
  console.log('[AuraAid] Selected provider:', provider);
  console.log('[AuraAid] Network:', networkId);

  if (!provider) {
    return {
      ok: false,
      reason: 'wallet-unavailable',
      message:
        'No Midnight-compatible wallet was detected. Install a compatible wallet extension and reload AuraAid.',
      state: emptyRealState(),
    };
  }

  try {
    const api = await provider.connect(networkId);

    const addressResult = await api.getUnshieldedAddress();

    const configuration = await api.getConfiguration();

    const state: RealState = {
      provider: {
        rdns: provider.rdns,
        name: provider.name,
        icon: provider.icon,
        apiVersion: provider.apiVersion,
      },
      api,
      networkId: configuration.networkId,
      unshieldedAddress: addressResult.unshieldedAddress,
      shieldedAddress: null,
      indexerUri: configuration.indexerUri,
indexerWsUri: configuration.indexerWsUri,
substrateNodeUri: configuration.substrateNodeUri,
provingProvider: null,
    };

    return {
      ok: true,
      message: `Connected to ${provider.name} on Midnight Preprod.`,
      state,
    };
  } catch (error) {
    const message = normalizeError(error);

    return {
      ok: false,
      reason: isUserRejected(error)
        ? 'user-rejected'
        : 'internal-error',
      message,
      state: {
        ...emptyRealState(),
        provider: {
          rdns: provider.rdns,
          name: provider.name,
          icon: provider.icon,
          apiVersion: provider.apiVersion,
        },
        networkId,
      },
    };
  }
}

/**
 * Disconnect the local AuraAid wallet session.
 *
 * The connector API does not require AuraAid to destroy the wallet itself.
 * We simply clear the application's connected state.
 */
export function disconnectWallet(): RealState {
  return emptyRealState();
}
