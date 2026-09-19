import { AlertTriangle, Download, RefreshCw, ShieldCheck, Wallet } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import type { MidnightConnectionState } from '../../types/index.ts';
import { GUIDE, hasWallet } from '../../services/midnight/wallet.ts';
import { Button } from '../common/ui.tsx';

export function WalletGate(p: {
  connection: MidnightConnectionState;
  onConnect: () => void;
  children: ReactNode;
}) {
  const [walletDetected, setWalletDetected] = useState(() => hasWallet());

  // Wallet browser extensions can inject `window.midnight` slightly after
  // first paint, so give detection one more pass shortly after mount.
  useEffect(() => {
    if (walletDetected) return;
    const t = window.setTimeout(() => setWalletDetected(hasWallet()), 600);
    return () => window.clearTimeout(t);
  }, [walletDetected]);

  const isConnected =
    p.connection.status === 'connected' || p.connection.status === 'proof-ready';

  if (isConnected) {
    return <>{p.children}</>;
  }

  const isConnecting = p.connection.status === 'connecting';
  const isError = p.connection.status === 'error';

  const recheck = () => setWalletDetected(hasWallet());

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-teal-500/20 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur-sm">
        <div className="flex flex-col items-center text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-teal-300 via-emerald-400 to-cyan-500 text-slate-950">
            <ShieldCheck className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-xl font-extrabold tracking-tight text-white">AuraAid</h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">
            Shielded Giving
          </p>

          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Connect a Midnight-compatible wallet to enter AuraAid. Your wallet
            connection unlocks campaign discovery, transparency proofs and
            NGO records.
          </p>

          {!walletDetected ? (
            <div
              className="mt-6 w-full rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-left"
              role="alert"
            >
              <p className="flex items-center gap-2 text-sm font-bold text-amber-200">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                No Midnight wallet detected
              </p>
              <ol className="mt-3 space-y-1.5 text-xs leading-relaxed text-amber-100/80">
                {GUIDE.map((step, i) => (
                  <li key={step} className="flex gap-2">
                    <span className="font-mono text-amber-300/70">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={recheck}>
                  <RefreshCw className="h-4 w-4" />
                  Retry detection
                </Button>
                <a
                  href="https://midnight.network"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-teal-300/40 bg-teal-400/10 px-4 py-2.5 text-sm font-bold text-teal-100 transition hover:border-teal-300/70 hover:bg-teal-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
                >
                  <Download className="h-4 w-4" />
                  Install wallet
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-6 w-full">
              <Button
                onClick={p.onConnect}
                disabled={isConnecting}
                className="w-full py-3"
              >
                <Wallet className="h-4 w-4" />
                {isConnecting ? 'Connecting...' : 'Connect Midnight Wallet'}
              </Button>

              {isError ? (
                <div
                  className="mt-4 flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2.5 text-left text-xs leading-relaxed text-rose-200"
                  role="alert"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{p.connection.message || 'Wallet connection was rejected or failed. Please try again.'}</span>
                </div>
              ) : null}

              {p.connection.message && !isError ? (
                <p className="mt-4 text-xs text-slate-500">{p.connection.message}</p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
