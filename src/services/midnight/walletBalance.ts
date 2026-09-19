import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';

export interface WalletBalances {
  shielded: Record<string, bigint>;
  unshielded: Record<string, bigint>;
  dust: {
    cap: bigint;
    balance: bigint;
  };
}

export async function readWalletBalances(
  api: ConnectedAPI,
): Promise<WalletBalances> {
  const [shielded, unshielded, dust] = await Promise.all([
    api.getShieldedBalances(),
    api.getUnshieldedBalances(),
    api.getDustBalance(),
  ]);

  return {
    shielded,
    unshielded,
    dust,
  };
}
