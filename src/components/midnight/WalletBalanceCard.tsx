import { useEffect, useState } from 'react';
import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import { readWalletBalances } from '../../services/midnight/walletBalance.ts';
import { Coins, Flame, Shield, Wallet } from 'lucide-react';

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
    <section className="mx-auto mt-6 w-full max-w-7xl px-4 sm:px-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-7 backdrop-blur-md shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-teal-400/10 text-teal-300 ring-1 ring-teal-400/20">
              <Wallet className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-300">
                Connected Lace Wallet
              </p>
              <h2 className="text-lg font-extrabold text-white">
                Live Midnight Preprod Balances
              </h2>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {loading ? 'Refreshing…' : 'Live State'}
          </span>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
            {error}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>Unshielded NIGHT</span>
                <Coins className="h-4 w-4 text-teal-300" />
              </div>

              {unshieldedEntries.length === 0 ? (
                <p className="mt-3 text-2xl font-extrabold text-white">0 NIGHT</p>
              ) : (
                <div className="mt-3">
                  <p className="text-2xl font-extrabold text-white">
                    {formatTokenAmount(unshieldedEntries[0][1])}
                  </p>
                  <p className="text-xs font-semibold text-teal-300 mt-0.5">tNIGHT (Preprod)</p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>Shielded Balance</span>
                <Shield className="h-4 w-4 text-indigo-300" />
              </div>

              {shieldedEntries.length === 0 ? (
                <p className="mt-3 text-2xl font-extrabold text-white">0 tokens</p>
              ) : (
                shieldedEntries.map(([token, value]) => (
                  <div key={token} className="mt-3">
                    <p className="text-2xl font-extrabold text-white">
                      {formatTokenAmount(value)}
                    </p>
                    <p className="text-xs font-semibold text-indigo-300 mt-0.5">Shielded coins</p>
                  </div>
                ))
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>Midnight DUST</span>
                <Flame className="h-4 w-4 text-amber-300" />
              </div>

              <p className="mt-3 text-2xl font-extrabold text-white">
                {formatTokenAmount(dustBalance)}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Cap: {formatTokenAmount(dustCap)} DUST
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
