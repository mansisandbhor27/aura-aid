import { Award, CircleAlert, EyeOff, ShieldCheck, Wallet } from 'lucide-react';
import { useState } from 'react';
import type { MidnightConnectionState } from '../../types/index.ts';
import { truncateAddress } from '../../utils/format.ts';
import { Badge, Button } from '../common/ui.tsx';
import { Modal, ModalHeader } from '../common/Modal.tsx';

const labels: Record<MidnightConnectionState['status'], { label: string; tone: 'slate' | 'amber' | 'emerald' | 'rose' | 'sky' }> = {
  disconnected: { label: 'Disconnected', tone: 'slate' },
  connecting: { label: 'Connecting...', tone: 'amber' },
  connected: { label: 'Connected', tone: 'emerald' },
  'proof-ready': { label: 'Proof-ready (demo)', tone: 'sky' },
  error: { label: 'Error', tone: 'rose' },
};

export function MidnightStatusBar(p: {
  connection: MidnightConnectionState;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const [open, setOpen] = useState(false);
  const meta = labels[p.connection.status];
  const dot = p.connection.status === 'proof-ready' || p.connection.status === 'connected'
    ? 'bg-emerald-400'
    : p.connection.status === 'connecting' ? 'bg-amber-400 animate-pulse'
      : p.connection.status === 'error' ? 'bg-rose-400' : 'bg-slate-500';
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Midnight status: ${meta.label}. Open connection details.`}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-teal-300/40 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
      >
        <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden="true" />
        <ShieldCheck className="h-3.5 w-3.5 text-teal-300" aria-hidden="true" />
        <span className="hidden sm:inline">Midnight</span>
        <span className="text-slate-400" aria-hidden="true">•</span>
        <span>{meta.label}</span>
      </button>
      {open ? (
        <Modal label="Midnight connection details" onClose={() => setOpen(false)}>
          <ModalHeader eyebrow="Midnight connection • demo" title={p.connection.network} onClose={() => setOpen(false)} />
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-2"><span className="text-slate-400">Status</span><Badge tone={meta.tone}>{meta.label}</Badge></div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-2"><span className="text-slate-400">Block height</span><span className="font-mono text-slate-200">{p.connection.blockHeight ?? '—'}</span></div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] px-3 py-2"><span className="text-slate-400">Wallet</span><span className="truncate font-mono text-xs text-slate-200">{p.connection.walletAddress ? truncateAddress(p.connection.walletAddress, 10) : 'Not connected'}</span></div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] px-3 py-2"><span className="text-slate-400">Last demo proof</span><span className="font-mono text-xs text-teal-200">{p.connection.lastProofHash ?? '—'}</span></div>
          </div>
          <p className="mt-3 flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs leading-relaxed text-amber-200"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />{p.connection.message} Demo mode never submits a real on-chain transaction.</p>
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-relaxed text-slate-400">
            <p className="flex items-center gap-1.5 font-bold text-white"><Award className="h-4 w-4 text-teal-300" /> What demo connect does</p>
            <p className="mt-1">Simulates wallet approval locally so you can preview shielded UX. Replace with dapp-connector before mainnet.</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button onClick={p.onConnect} disabled={p.connection.status === 'connecting' || p.connection.status === 'proof-ready'}><Wallet className="h-4 w-4" /> Demo connect</Button>
            <Button variant="secondary" onClick={p.onDisconnect}><EyeOff className="h-4 w-4" /> Disconnect</Button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
