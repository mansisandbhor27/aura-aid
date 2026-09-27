import { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff, Lock, ShieldCheck, Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import type { Campaign, DonationFormValues, DonationPrivacyMode, MidnightConnectionState } from '../../types/index.ts';
import { formatUSD, parseAmountInput, validateDonation } from '../../utils/format.ts';
import { Button, FieldError } from '../common/ui.tsx';
import { Modal, ModalHeader } from '../common/Modal.tsx';
import { donateToCampaign, type DonateParams, type DonateResult, type DonationProgress } from '../../services/midnight/donate.ts';
import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';

const DONATION_STORAGE_KEY = 'auraaid_campaign_donations';

interface SavedDonation {
  campaignId: number;
  amount: number;
  txId: string;
  createdAt: string;
}

function saveDonation(
  campaignId: number,
  amount: number,
  txId: string,
) {
  try {
    const raw = localStorage.getItem(DONATION_STORAGE_KEY);
    let donations: SavedDonation[] = [];

    if (raw) {
      try {
        donations = JSON.parse(raw);
      } catch {
        donations = [];
      }
    }

    const donation: SavedDonation = {
      campaignId,
      amount,
      txId,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      DONATION_STORAGE_KEY,
      JSON.stringify([...donations, donation]),
    );

    window.dispatchEvent(
      new CustomEvent('auraaid-donation-completed', {
        detail: {
          campaignId,
          amount,
          txId,
        },
      }),
    );
  } catch (error) {
    console.error('[AURA DONATION] Failed to save local donation:', error);
  }
}

const QUICK = [25, 50, 100, 250];
const FRESH: DonationFormValues = {
  amount: 50,
  privacyMode: 'shielded',
  shieldIdentity: true,
  shieldAmount: true,
  donorLabel: '',
  note: '',
};

export type DonationStatus =
  | 'idle'
  | 'preparing'
  | 'wallet-approval'
  | 'submitting'
  | 'success'
  | 'error';

export interface DonateModalProps {
  campaign: Campaign;
  connection: MidnightConnectionState;
  api: ConnectedAPI | null;
  contractAddress: string | null;
  onClose: () => void;
}

export function DonateModal(p: DonateModalProps) {
  const [v, setV] = useState<DonationFormValues>(FRESH);
  const [text, setText] = useState('50');
  const [status, setStatus] = useState<DonationStatus>('idle');
  const [progressMsg, setProgressMsg] = useState('');
  const [result, setResult] = useState<DonateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const check = useMemo(() => validateDonation(v), [v]);

  useEffect(() => {
    setV(FRESH);
    setText('50');
    setStatus('idle');
    setResult(null);
    setError(null);
  }, [p.campaign.id]);

  const shielded = v.privacyMode === 'shielded';

  const upd = (patch: Partial<DonationFormValues>) =>
    setV((s) => ({ ...s, ...patch }));

  const setMode = (privacyMode: DonationPrivacyMode) =>
    setV((s) => {
      if (privacyMode === 'shielded') return { ...s, privacyMode };
      return { ...s, privacyMode, shieldAmount: false };
    });

  const amtLabel = Number.isFinite(v.amount) ? formatUSD(v.amount) : '—';
  const canSubmit =
    p.api &&
    p.contractAddress &&
    p.campaign.ledgerId &&
    !check.errors.amount &&
    !check.errors.donorLabel &&
    status === 'idle';

  const handleDonate = async () => {
    if (!p.api || !p.contractAddress || !p.campaign.ledgerId) return;

    setStatus('preparing');
    setError(null);
    setResult(null);

    const params: DonateParams = {
      contractAddress: p.contractAddress,
      ledgerCampaignId: p.campaign.ledgerId,
      amount: v.amount,
      onProgress: (prog: DonationProgress) => {
        setProgressMsg(prog.message);
        if (prog.stage === 'proving') {
          setStatus('wallet-approval');
        } else if (prog.stage === 'finalizing') {
          setStatus('submitting');
        }
      },
    };

    try {
      const res = await donateToCampaign(p.api, params);

      saveDonation(p.campaign.ledgerId, v.amount, res.txId);

      setResult(res);
      setStatus('success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Donation failed.';
      setError(msg);
      setStatus('error');
    }
  };

  const handleClose = () => {
    if (status === 'success' || status === 'error' || status === 'idle') {
      p.onClose();
    }
  };

  return (
    <Modal label="Donate dialog" onClose={handleClose}>
      <ModalHeader
        eyebrow="Midnight Preprod Donation"
        title={p.campaign.title}
        subtitle={p.campaign.ngoName}
        onClose={handleClose}
      />

      <div className="mt-4 space-y-4">
        {status === 'idle' && (
          <>
            <div role="radiogroup" aria-label="Privacy mode" className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                role="radio"
                aria-checked={shielded}
                onClick={() => setMode('shielded')}
                className={`rounded-2xl border p-3.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 ${
                  shielded
                    ? 'border-teal-300/60 bg-teal-400/10 shadow-sm'
                    : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-extrabold text-white">
                  <EyeOff className="h-4 w-4 text-teal-300" /> Anonymous Giving
                </span>
                <span className="mt-1 block text-xs text-slate-400">
                  Zero personal information or off-chain PII attached.
                </span>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={!shielded}
                onClick={() => setMode('public')}
                className={`rounded-2xl border p-3.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 ${
                  !shielded
                    ? 'border-teal-300/60 bg-teal-400/10 shadow-sm'
                    : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-extrabold text-white">
                  <Eye className="h-4 w-4 text-emerald-300" /> Named Supporter
                </span>
                <span className="mt-1 block text-xs text-slate-400">
                  Attach an optional display badge to the contribution.
                </span>
              </button>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-200" htmlFor="donation-amount">
                Donation Amount (NIGHT / USD equivalent)
              </label>
              <div className="mt-2 flex flex-wrap items-center gap-2" role="group" aria-label="Quick amounts">
                {QUICK.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    aria-pressed={v.amount === amt}
                    onClick={() => {
                      upd({ amount: amt });
                      setText(String(amt));
                    }}
                    className={`rounded-xl px-3.5 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 ${
                      v.amount === amt
                        ? 'bg-teal-400 text-slate-950 shadow-sm'
                        : 'border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
                <input
                  id="donation-amount"
                  inputMode="decimal"
                  autoComplete="off"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    upd({ amount: parseAmountInput(e.target.value) });
                  }}
                  placeholder="Custom amount"
                  className="min-w-[8rem] flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-sm text-white outline-none focus:border-teal-300/60"
                  aria-invalid={!!check.errors.amount}
                  aria-describedby="donation-amount-error"
                />
              </div>
              <FieldError id="donation-amount-error" message={check.errors.amount} />
            </div>

            {!shielded ? (
              <div>
                <label className="block text-sm font-bold text-slate-200" htmlFor="donor-label">
                  Display name (public tag)
                </label>
                <input
                  id="donor-label"
                  value={v.donorLabel}
                  onChange={(e) => upd({ donorLabel: e.target.value })}
                  placeholder="e.g. Priya S."
                  maxLength={40}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white outline-none focus:border-teal-300/60"
                  aria-invalid={!!check.errors.donorLabel}
                  aria-describedby="donor-label-error"
                />
                <FieldError id="donor-label-error" message={check.errors.donorLabel} />
              </div>
            ) : null}

            <div className="rounded-2xl border border-teal-300/20 bg-teal-400/[0.05] p-3.5 text-xs leading-relaxed text-slate-300">
              <p className="flex items-center gap-1.5 font-bold text-teal-200">
                <ShieldCheck className="h-4 w-4 text-teal-300" />
                Midnight Preprod Contract Verification
              </p>
              <p className="mt-1 text-slate-300">
                You are contributing <span className="font-extrabold text-white">{amtLabel}</span> to{' '}
                <span className="font-bold text-white">{p.campaign.title}</span> (Ledger Campaign #{p.campaign.ledgerId}).
              </p>
              <div className="mt-2.5 grid gap-2 sm:grid-cols-2 pt-1 border-t border-white/10">
                <div>
                  <span className="font-bold text-slate-200 block">Public on-chain:</span>
                  <span className="text-slate-400 text-[11px]">
                    Campaign ID, NIGHT token amount, updated campaign total & txId.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-teal-200 block">Protected by Midnight:</span>
                  <span className="text-slate-400 text-[11px]">
                    Client-side ZK proof, wallet keys, and zero personal PII on ledger.
                  </span>
                </div>
              </div>
            </div>

            {(!p.api || !p.contractAddress || !p.campaign.ledgerId) && (
              <p className="rounded-xl border border-red-300/20 bg-red-400/10 p-3 text-xs leading-relaxed text-red-200">
                Cannot submit transaction:{' '}
                {(!p.api && 'Midnight Lace wallet not connected.') ||
                  (!p.contractAddress && 'No deployed contract address found.') ||
                  (!p.campaign.ledgerId && 'Campaign is not registered on-chain.')}
              </p>
            )}

            <div className="grid gap-2 sm:grid-cols-2 pt-1">
              <Button disabled={!canSubmit} onClick={handleDonate} className="justify-center">
                <Lock className="h-4 w-4 mr-2" />
                Confirm Donation ({amtLabel})
              </Button>
              <Button variant="secondary" onClick={p.onClose} className="justify-center">
                Cancel
              </Button>
            </div>
          </>
        )}

        {status === 'preparing' && (
          <div className="space-y-3.5 text-center py-6">
            <Loader2 className="h-9 w-9 animate-spin mx-auto text-teal-400" />
            <p className="font-bold text-white text-base">Preparing Midnight Transaction...</p>
            <p className="text-sm text-slate-400">
              {progressMsg || 'Connecting to Midnight indexer and contract...'}
            </p>
          </div>
        )}

        {status === 'wallet-approval' && (
          <div className="space-y-3.5 text-center py-6">
            <Lock className="h-9 w-9 mx-auto text-amber-400 animate-pulse" />
            <p className="font-bold text-white text-base">Awaiting Lace Wallet Authorization</p>
            <p className="text-sm text-slate-400">
              {progressMsg || 'Please sign and authorize the zero-knowledge proof transaction in your Midnight Lace wallet.'}
            </p>
          </div>
        )}

        {status === 'submitting' && (
          <div className="space-y-3.5 text-center py-6">
            <Loader2 className="h-9 w-9 animate-spin mx-auto text-teal-400" />
            <p className="font-bold text-white text-base">Submitting to Midnight Preprod...</p>
            <p className="text-sm text-slate-400">
              {progressMsg || 'Waiting for block inclusion and ledger finalization...'}
            </p>
          </div>
        )}

        {status === 'success' && result && (
          <div className="space-y-4 text-center py-4">
            <CheckCircle className="h-11 w-11 mx-auto text-emerald-400" />
            <div>
              <p className="font-bold text-white text-lg">Donation Confirmed on Midnight!</p>
              <p className="text-xs text-slate-400 mt-1">
                Your transaction has been finalized on Preprod block #{result.blockHeight.toString()}.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-3.5 text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Transaction ID</span>
                <a
                  href={`https://preprod.midnightexplorer.com/tx/${result.txId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-mono text-teal-300 hover:text-teal-200"
                >
                  <span>{result.txId.slice(0, 16)}…</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Block Height</span>
                <span className="font-mono text-white">{result.blockHeight.toString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Contract</span>
                <a
                  href={`https://preprod.midnightexplorer.com/contract/${result.contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-mono text-teal-300 hover:text-teal-200"
                >
                  <span>{result.contractAddress.slice(0, 16)}…</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Campaign ID</span>
                <span className="font-mono text-white">#{result.ledgerCampaignId.toString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Amount (base units)</span>
                <span className="font-mono text-white">{result.baseUnits.toString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status</span>
                <span className="font-mono font-bold text-emerald-300">{result.status}</span>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && error && (
          <div className="space-y-3 text-center py-4">
            <XCircle className="h-10 w-10 mx-auto text-red-400" />
            <p className="font-bold text-white text-base">Transaction Failed</p>
            <p className="text-xs text-red-300 bg-red-400/10 rounded-xl p-3 text-left font-mono">
              {error}
            </p>
          </div>
        )}

        {(status === 'success' || status === 'error') && (
          <div className="grid gap-2 sm:grid-cols-2 pt-2">
            <Button variant="secondary" onClick={handleClose} className="justify-center">
              Close
            </Button>
            {status === 'error' && (
              <Button onClick={() => setStatus('idle')} className="justify-center">
                Try Again
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}