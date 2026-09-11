import type { ConnectedAPI, InitialAPI } from '@midnight-ntwrk/dapp-connector-api';

export type ProviderInfo = Pick<InitialAPI, 'rdns' | 'name' | 'icon' | 'apiVersion'>;

export interface RealState {
  provider: ProviderInfo | null;
  api: ConnectedAPI | null;
  networkId: string | null;
  unshieldedAddress: string | null;
  shieldedAddress: string | null;
  indexerUri: string | null;
  substrateNodeUri: string | null;
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
  'Install the Midnight Lace wallet browser extension.',
  'Create or restore a wallet and switch it to Preprod.',
  'Fund the wallet with tNIGHT from the Preprod faucet.',
  'Reload AuraAid in the same browser and Connect again.',
];

const EMPTY: RealState = {
  provider: null,
  api: null,
  networkId: null,
  unshieldedAddress: null,
  shieldedAddress: null,
  indexerUri: null,
  substrateNodeUri: null,
};

export function emptyRealState(): RealState {
  return { ...EMPTY };
}

export function listProviders(): ProviderInfo[] {
  if (typeof window === 'undefined' || !window.midnight) return [];

  return Object.values(window.midnight).map((w) => ({
    rdns: w.rdns,
    name: w.name,
    icon: w.icon,
    apiVersion: w.apiVersion,
  }));
}

export function hasWallet(): boolean {
  return listProviders().length > 0;
}
