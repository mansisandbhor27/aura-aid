import { useEffect, useState } from 'react';
import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import { readWalletBalances } from '../../services/midnight/walletBalance.ts';
import { shieldOneNight } from '../../services/midnight/shielding.ts';

interface WalletBalanceCardProps {
  api: ConnectedAPI | null;
}

function formatTokenAmount(value: bigint): string {
  const whole = value / 1_000_000n;
  const fraction = value % 1_000_000n;

  if (fraction === 0n) {
    return whole.toLocaleString();
  }

  return `${whole.toLocaleString()}.${fraction
    .toString()
    .padStart(6, '0')
    .replace(/0+$/, '')}`;
}

export function WalletBalanceCard({ api }: WalletBalanceCardProps) {
  const [unshielded, setUnshielded] = useState<Record<string, bigint>>({});
  const [shielded, setShielded] = useState<Record<string, bigint>>({});
  const [dustBalance, setDustBalance] = useState<bigint>(0n);
  const [dustCap, setDustCap] = useState<bigint>(0n);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shielding, setShielding] = useState(false);
  const [shieldMessage, setShieldMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!api) {
      setUnshielded({});
      setShielded({});
      setDustBalance(0n);
      setDustCap(0n);
      return;
    }

    let cancelled = false;

    const refresh = async () => {
      try {
        setLoading(true);
        setError(null);

        const balances = await readWalletBalances(api);

        if (cancelled) return;

        setUnshielded(balances.unshielded);
        setShielded(balances.shielded);
        setDustBalance(balances.dust.balance);
        setDustCap(balances.dust.cap);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to read wallet balance.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void refresh();

    const interval = window.setInterval(() => {
      void refresh();
    }, 10_000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [api]);

  const unshieldedEntries = Object.entries(unshielded);
  const shieldedEntries = Object.entries(shielded);

  return (
    <section className="mx-auto mt-8 w-[calc(100%-3rem)] max-w-7xl">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Connected Wallet
            </p>
            <h2 className="mt-1 text-xl font-bold text-white">
              Real Midnight Balance
            </h2>
          </div>

          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
            {loading ? 'Refreshing…' : 'Live'}
          </span>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
              <p className="text-sm text-slate-400">Unshielded NIGHT</p>

              {unshieldedEntries.length === 0 ? (
                <p className="mt-2 text-2xl font-bold text-white">0 NIGHT</p>
              ) : (
                <div className="mt-2">
                  <p className="text-2xl font-bold text-white">
                    {formatTokenAmount(unshieldedEntries[0][1])}
                  </p>
                  <p className="text-xs text-cyan-300">NIGHT</p>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
              <p className="text-sm text-slate-400">Shielded</p>

              {shieldedEntries.length === 0 ? (
                <p className="mt-2 text-2xl font-bold text-white">0</p>
              ) : (
                shieldedEntries.map(([token, value]) => (
                  <div key={token} className="mt-2">
                    <p className="text-2xl font-bold text-white">
                      {formatTokenAmount(value)}
                    </p>
                    <p className="text-xs text-cyan-300">Shielded token</p>
                  </div>
                ))
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
              <p className="text-sm text-slate-400">DUST</p>

              <p className="mt-2 text-2xl font-bold text-white">
                {formatTokenAmount(dustBalance)}
              </p>

              <p className="text-xs text-cyan-300">
                Current balance
              </p>

              <div className="mt-3 border-t border-slate-800 pt-3">
                <p className="text-xs text-slate-500">Generation cap</p>
                <p className="mt-1 text-sm font-semibold text-slate-300">
                  {formatTokenAmount(dustCap)} DUST
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-6 shadow-xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Shielded Wallet
          </p>
          <h3 className="mt-1 text-lg font-bold text-white">
            Move NIGHT to Shielded Balance
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Test the real Midnight wallet flow by sending 1 NIGHT to your own shielded address.
          </p>
        </div>

        <button
          type="button"
          disabled={!api || shielding}
          onClick={async () => {
            if (!api) return;

            try {
              setShielding(true);
              setShieldMessage(null);

              const result = await shieldOneNight(api);

              setShieldMessage(
                `1 NIGHT submitted to your shielded address. The balance will update after the wallet/indexer processes it.`,
              );

              console.log('Shield transaction submitted:', result);
            } catch (err) {
              setShieldMessage(
                err instanceof Error
                  ? err.message
                  : 'Shield transaction failed.',
              );
            } finally {
              setShielding(false);
            }
          }}
          className="mt-4 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {shielding ? 'Waiting for wallet…' : 'Shield 1 NIGHT'}
        </button>

        {shieldMessage ? (
          <p className="mt-3 text-sm text-slate-300">
            {shieldMessage}
          </p>
        ) : null}
      </div>
    </section>
  );
}
