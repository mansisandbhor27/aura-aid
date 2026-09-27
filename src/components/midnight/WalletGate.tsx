import { AlertTriangle, Download, RefreshCw, Wallet } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import type { MidnightConnectionState } from '../../types/index.ts';
import { GUIDE, hasWallet } from '../../services/midnight/wallet.ts';
import { Button } from '../common/ui.tsx';
import { AuraAidLogo } from '../common/AuraAidLogo.tsx';

export function WalletGate(p: {
  connection: MidnightConnectionState;
  onConnect: () => void;
  children: ReactNode;
}) {
  const [walletDetected, setWalletDetected] = useState(() => hasWallet());

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
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 left-1/2 h-80 w-[46rem] -translate-x-1/2 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="absolute -bottom-24 left-1/2 h-80 w-[46rem] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center text-center">
          <AuraAidLogo size="lg" />

          <p className="mt-5 text-sm leading-relaxed text-slate-300">
            Connect your Midnight Lace wallet to interact with AuraAid on Midnight Preprod. Access verified campaigns, donate with zero-knowledge proofs, and track on-chain NGO activity.
          </p>

          {!walletDetected ? (
            <div
              className="mt-6 w-full rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-left"
              role="alert"
            >
              <p className="flex items-center gap-2 text-xs font-bold text-amber-200 uppercase tracking-wider">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-300" />
                No Midnight Wallet Detected
              </p>
              <ol className="mt-3 space-y-2 text-xs leading-relaxed text-amber-100/90">
                {GUIDE.map((step, i) => (
                  <li key={step} className="flex gap-2">
                    <span className="font-mono font-bold text-amber-300">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" className="flex-1 text-xs" onClick={recheck}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Retry
                </Button>
                <a
                  href="https://midnight.network"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-teal-300/40 bg-teal-400/10 px-3 py-2 text-xs font-bold text-teal-100 transition hover:bg-teal-400/20"
                >
                  <Download className="h-3.5 w-3.5" />
                  Install Wallet
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-6 w-full space-y-3">
              <Button
                onClick={p.onConnect}
                disabled={isConnecting}
                className="w-full py-3.5 text-sm font-bold shadow-lg shadow-teal-500/20"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {isConnecting ? 'Connecting to Lace...' : 'Connect Midnight Wallet'}
              </Button>

              {isError ? (
                <div
                  className="flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-left text-xs leading-relaxed text-rose-200"
                  role="alert"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{p.connection.message || 'Connection was rejected or failed. Please check Lace wallet settings.'}</span>
                </div>
              ) : null}

              {p.connection.message && !isError ? (
                <p className="text-xs text-slate-400">{p.connection.message}</p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
