import {
  CircleAlert,
  EyeOff,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';
import type { MidnightConnectionState } from '../../types/index.ts';
import { truncateAddress } from '../../utils/format.ts';
import { Badge, Button } from '../common/ui.tsx';
import { Modal, ModalHeader } from '../common/Modal.tsx';

const labels: Record<
  MidnightConnectionState['status'],
  {
    label: string;
    tone: 'slate' | 'amber' | 'emerald' | 'rose' | 'sky';
  }
> = {
  disconnected: {
    label: 'Connect Wallet',
    tone: 'slate',
  },
  connecting: {
    label: 'Connecting...',
    tone: 'amber',
  },
  connected: {
    label: 'Wallet Connected',
    tone: 'emerald',
  },
  'proof-ready': {
    label: 'Wallet Connected',
    tone: 'emerald',
  },
  error: {
    label: 'Try Again',
    tone: 'rose',
  },
};

export function MidnightStatusBar(p: {
  connection: MidnightConnectionState;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const [open, setOpen] = useState(false);
  const meta = labels[p.connection.status];

  const isConnected =
    p.connection.status === 'connected' ||
    p.connection.status === 'proof-ready';

  const isConnecting =
    p.connection.status === 'connecting';

  const isError =
    p.connection.status === 'error';

  const handleClick = () => {
    if (isConnected) {
      setOpen(true);
      return;
    }

    if (!isConnecting) {
      p.onConnect();
    }
  };

  const buttonClass = isConnected
    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/15'
    : isConnecting
      ? 'cursor-wait border-amber-400/30 bg-amber-400/10 text-amber-200'
      : isError
        ? 'border-rose-400/30 bg-rose-400/10 text-rose-200 hover:bg-rose-400/15'
        : 'border-teal-300/40 bg-teal-400/10 text-teal-100 hover:border-teal-300/70 hover:bg-teal-400/15';

  const dot =
    isConnected
      ? 'bg-emerald-400'
      : isConnecting
        ? 'bg-amber-400 animate-pulse'
        : isError
          ? 'bg-rose-400'
          : 'bg-teal-300';

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isConnecting}
        aria-label={
          isConnected
            ? 'Wallet connected. Open wallet details.'
            : meta.label
        }
        className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 ${buttonClass}`}
      >
        <span
          className={`h-2.5 w-2.5 rounded-full ${dot}`}
          aria-hidden="true"
        />

        <ShieldCheck
          className="h-4 w-4"
          aria-hidden="true"
        />

        <span>
          {isConnected && p.connection.walletAddress
            ? `Connected · ${truncateAddress(
                p.connection.walletAddress,
                6,
              )}`
            : meta.label}
        </span>
      </button>

      {open ? (
        <Modal
          label="Midnight wallet connection"
          onClose={() => setOpen(false)}
        >
          <ModalHeader
            eyebrow="Midnight wallet"
            title={p.connection.network}
            onClose={() => setOpen(false)}
          />

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-2">
              <span className="text-slate-400">Status</span>
              <Badge tone={meta.tone}>{meta.label}</Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-2">
              <span className="text-slate-400">Network</span>
              <span className="font-mono text-xs text-slate-200">
                {p.connection.network}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] px-3 py-2">
              <span className="text-slate-400">Wallet</span>
              <span className="truncate font-mono text-xs text-slate-200">
                {p.connection.walletAddress
                  ? truncateAddress(
                      p.connection.walletAddress,
                      10,
                    )
                  : 'Not connected'}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-2">
              <span className="text-slate-400">Block height</span>
              <span className="font-mono text-slate-200">
                {p.connection.blockHeight ?? '—'}
              </span>
            </div>
          </div>

          {p.connection.message ? (
            <p className="mt-3 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs leading-relaxed text-slate-300">
              {p.connection.status === 'error' ? (
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
              ) : (
                <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
              )}

              {p.connection.message}
            </p>
          ) : null}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button
              onClick={p.onConnect}
              disabled={isConnecting || isConnected}
            >
              <Wallet className="h-4 w-4" />
              {isConnecting
                ? 'Connecting...'
                : 'Connect Wallet'}
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                p.onDisconnect();
                setOpen(false);
              }}
            >
              <EyeOff className="h-4 w-4" />
              Disconnect
            </Button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
