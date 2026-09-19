import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';

const NIGHT_DECIMALS = 1_000_000n;

export async function shieldOneNight(api: ConnectedAPI) {
  const [balances, addresses] = await Promise.all([
    api.getUnshieldedBalances(),
    api.getShieldedAddresses(),
  ]);

  const tokenTypes = Object.entries(balances);

  if (tokenTypes.length === 0) {
    throw new Error('No unshielded token balance was found.');
  }

  const [tokenType, balance] = tokenTypes[0];

  if (balance < NIGHT_DECIMALS) {
    throw new Error('Insufficient unshielded NIGHT balance.');
  }

  const transaction = await api.makeTransfer(
    [
      {
        kind: 'shielded',
        type: tokenType,
        value: NIGHT_DECIMALS,
        recipient: addresses.shieldedAddress,
      },
    ],
    {
      payFees: true,
    },
  );

  await api.submitTransaction(transaction.tx);

  return {
    amount: 1n,
    tokenType,
    shieldedAddress: addresses.shieldedAddress,
  };
}
