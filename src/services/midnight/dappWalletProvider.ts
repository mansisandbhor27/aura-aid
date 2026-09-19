import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import {
  Transaction,
  type CoinPublicKey,
  type EncPublicKey,
  type FinalizedTransaction,
  type TransactionId,
} from '@midnight-ntwrk/midnight-js-protocol/ledger';
import type {
  MidnightProvider,
  UnboundTransaction,
  WalletProvider,
} from '@midnight-ntwrk/midnight-js-types';

function toHex(bytes: Uint8Array): string {
  let result = '';

  for (const byte of bytes) {
    result += byte.toString(16).padStart(2, '0');
  }

  return result;
}

function fromHex(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;

  if (clean.length % 2 !== 0) {
    throw new Error('Invalid hexadecimal transaction data.');
  }

  const bytes = new Uint8Array(clean.length / 2);

  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }

  return bytes;
}

function deserializeFinalizedTransaction(
  serialized: string,
): FinalizedTransaction {
  return Transaction.deserialize(
    'signature',
    'proof',
    'binding',
    fromHex(serialized),
  ) as FinalizedTransaction;
}

export interface WalletKeys {
  shieldedAddress: string;
  shieldedCoinPublicKey: CoinPublicKey;
  shieldedEncryptionPublicKey: EncPublicKey;
}

export class DappConnectorWalletProvider implements WalletProvider {
  constructor(
    private readonly api: ConnectedAPI,
    private readonly keys: WalletKeys,
  ) {}

  getCoinPublicKey(): CoinPublicKey {
    return this.keys.shieldedCoinPublicKey;
  }

  getEncryptionPublicKey(): EncPublicKey {
    return this.keys.shieldedEncryptionPublicKey;
  }

  async balanceTx(
    tx: UnboundTransaction,
    ttl?: Date,
  ): Promise<FinalizedTransaction> {
    void ttl;

    const serialized = toHex(tx.serialize());

    const balanced = await this.api.balanceUnsealedTransaction(serialized, {
      payFees: true,
    });

    return deserializeFinalizedTransaction(balanced.tx);
  }
}

export class DappConnectorMidnightProvider implements MidnightProvider {
  constructor(private readonly api: ConnectedAPI) {}

  async submitTx(tx: FinalizedTransaction): Promise<TransactionId> {
    const identifiers = tx.identifiers();
    const transactionId = identifiers[0];

    if (!transactionId) {
      throw new Error('No transaction identifier was produced.');
    }

    await this.api.submitTransaction(toHex(tx.serialize()));

    return transactionId;
  }
}

export async function getWalletKeys(
  api: ConnectedAPI,
): Promise<WalletKeys> {
  const addresses = await api.getShieldedAddresses();

  return {
    shieldedAddress: addresses.shieldedAddress,
    shieldedCoinPublicKey:
      addresses.shieldedCoinPublicKey as CoinPublicKey,
    shieldedEncryptionPublicKey:
      addresses.shieldedEncryptionPublicKey as EncPublicKey,
  };
}
