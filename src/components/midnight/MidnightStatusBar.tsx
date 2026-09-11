import { ShieldCheck, Wallet, X } from 'lucide-react';
import { useState } from 'react';
import type { MidnightConnectionState } from '../../types/index.ts';
import { truncateAddress } from '../../utils/format.ts';
import { Badge } from '../common/ui.tsx';

const statusMeta: Record<MidnightConnectionState['status'], { label: string; tone: 'slate' | 'amber' | 'emerald' | 'rose' | 'sky' }> = {
  disconnected: { label: 'Disconnected', tone: 'slate' },
  connecting: { label: 'Connecting...', tone: 'amber' },
  connected: { label: 'Connected', tone: 'emerald' },
  'proof-ready': { label: 'Proof-ready (demo)', tone: 'sky' },
  error: { label: 'Error', tone: 'rose' },
};

export function MidnightStatusBar({
  connection,
  onConnect,
  onDisconnect,
}: {
  connection: MidnightConnectionState;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const [open, setOpen] = useState(false);
  const meta = statusMeta[connection.status];
  const dot =
    connection.status === 'proof-ready' || connection.status === 'connected'
      ? 'bg-emerald-400'
      : connection.status === 'connecting'
        ? 'bg-amber-400 animate-pulse'
        : connection.status === 'error'
          ? 'bg-rose-400'
          : 'bg-slate-500';

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-teal-300/40 hover:bg-white/[0.09]"
      >
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        <ShieldCheck className="h-3.5 w-3.5 text-teal-300" />
        <span className="hidden sm:inline">Midnight</span>
        <span className="text-slate-400">•</span>
        <span>{meta.label}</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-300">Midnight connection</p>
                <h3 className="mt-1 text-lg font-extrabold text-white">{connection.network}</h3>
              </div>
              <button
                type="button"
                aria-label="Close Midnight panel"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-white/10 p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-2">
                <span className="text-slate-400">Status</span>
                <Badge tone={meta.tone}>{meta.label}</Badge>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-2">
                <span className="text-slate-400">Block height</span>
                <span className="font-mono text-slate-200">{connection.blockHeight ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] px-3 py-2">
                <span className="text-slate-400">Wallet</span>
                <span className="truncate font-mono text-xs text-slate-200">
                  {connection.walletAddress ? truncateAddress(connection.walletAddress, 10) : 'Not connected'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] px-3 py-2">
                <span className="text-slate-400">Last proof</span>
                <span className="font-mono text-xs text-teal-200">{connection.lastProofHash ?? '—'}</span>
              </div>
            </div>

            <p className="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs leading-relaxed text-amber-200">
              {connection.message} Demo mode never submits a real on-chain transaction.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onConnect}
                disabled={connection.status === 'connecting' || connection.status === 'proof-ready'}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-3 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Wallet className="h-4 w-4" />
                Demo connect
              </button>
              <button
                type="button"
                onClick={onDisconnect}
                className="rounded-xl border border-white/10 px-3 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-white/10"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
