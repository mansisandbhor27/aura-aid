import { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff, Lock, ShieldCheck, Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import type { Campaign, DonationFormValues, DonationPrivacyMode, MidnightConnectionState } from '../../types/index.ts';
import { formatUSD, parseAmountInput, validateDonation } from '../../utils/format.ts';
import { Button, FieldError } from '../common/ui.tsx';
import { Modal, ModalHeader } from '../common/Modal.tsx';
import { donateToCampaign, type DonateParams, type DonateResult, type DonationProgress } from '../../services/midnight/donate.ts';
import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';

const QUICK = [25, 50, 100, 250];
const FRESH: DonationFormValues = { amount: 50, privacyMode: 'shielded', shieldIdentity: true, shieldAmount: true, donorLabel: '', note: '' };

export type DonationStatus = 'idle' | 'preparing' | 'wallet-approval' | 'submitting' | 'success' | 'error';

export interface DonateModalProps {
  campaign: Campaign;
  connection: MidnightConnectionState;
  api: ConnectedAPI | null;
  contractAddress: string | null;
  onClose: () => void;
}

function getRealPrivacyInfo(values: DonationFormValues) {
  const shielded = values.privacyMode === 'shielded';
  const shieldIdentity = shielded && values.shieldIdentity;
  const shieldAmount = shielded && values.shieldAmount;

  return {
    visibleToPublic: [
      'Campaign ID',
      shieldAmount ? 'Pooled donation total (no link to donor)' : 'Donation amount',
      'Transaction hash',
    ],
    hiddenByShielding: [
      ...(shieldIdentity ? ['Donor wallet address', 'Donor identity'] : []),
      ...(shieldAmount ? ['Exact donation amount'] : []),
    ],
  };
}

export function DonateModal(p: DonateModalProps) {
  const [v, setV] = useState<DonationFormValues>(FRESH);
  const [text, setText] = useState('50');
  const [status, setStatus] = useState<DonationStatus>('idle');
  const [progressMsg, setProgressMsg] = useState('');
  const [result, setResult] = useState<DonateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const check = useMemo(() => validateDonation(v), [v]);
  const privacy = useMemo(() => getRealPrivacyInfo(v), [v]);
  useEffect(() => { setV(FRESH); setText('50'); setStatus('idle'); setResult(null); setError(null); }, [p.campaign.id]);
  const shielded = v.privacyMode === 'shielded';
  const upd = (patch: Partial<DonationFormValues>) => setV((s) => ({ ...s, ...patch }));
  const setMode = (privacyMode: DonationPrivacyMode) => setV((s) => {
    if (privacyMode === 'shielded') return { ...s, privacyMode };
    return { ...s, privacyMode, shieldAmount: false };
  });
  const amtLabel = Number.isFinite(v.amount) ? formatUSD(v.amount) : '—';
  const canSubmit = p.api && p.contractAddress && p.campaign.ledgerId && !check.errors.amount && !check.errors.donorLabel && status === 'idle';

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
      <ModalHeader eyebrow="Donate" title={p.campaign.title} subtitle={p.campaign.ngoName} onClose={handleClose} />
      <div className="mt-4 space-y-4">
        {status === 'idle' && (
          <>
            <div role="radiogroup" aria-label="Privacy mode" className="grid gap-2 sm:grid-cols-2">
              <button type="button" role="radio" aria-checked={shielded} onClick={() => setMode('shielded')} className={`rounded-2xl border p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 ${shielded ? 'border-teal-300/60 bg-teal-400/10' : 'border-white/10 bg-white/[0.03]'}`}>
                <span className="flex items-center gap-2 text-sm font-extrabold text-white"><EyeOff className="h-4 w-4 text-indigo-300" /> Shielded</span>
                <span className="mt-1 block text-xs text-slate-400">Hide identity and optionally amount on-chain.</span>
              </button>
              <button type="button" role="radio" aria-checked={!shielded} onClick={() => setMode('public')} className={`rounded-2xl border p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 ${!shielded ? 'border-teal-300/60 bg-teal-400/10' : 'border-white/10 bg-white/[0.03]'}`}>
                <span className="flex items-center gap-2 text-sm font-extrabold text-white"><Eye className="h-4 w-4 text-emerald-300" /> Public</span>
                <span className="mt-1 block text-xs text-slate-400">Show name and amount on-chain.</span>
              </button>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-200" htmlFor="donation-amount">Amount (USD)</label>
              <div className="mt-2 flex flex-wrap items-center gap-2" role="group" aria-label="Quick amounts">
                {QUICK.map((amt) => (
                  <button key={amt} type="button" aria-pressed={v.amount === amt} onClick={() => { upd({ amount: amt }); setText(String(amt)); }} className={`rounded-xl px-3 py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 ${v.amount === amt ? 'bg-teal-400 text-slate-950' : 'border border-white/10 text-slate-300'}`}>${amt}</button>
                ))}
                <input id="donation-amount" inputMode="decimal" autoComplete="off" value={text} onChange={(e) => { setText(e.target.value); upd({ amount: parseAmountInput(e.target.value) }); }} placeholder="Custom amount" className="min-w-[8rem] flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white outline-none focus:border-teal-300/60" aria-invalid={!!check.errors.amount} aria-describedby="donation-amount-error" />
              </div>
              <FieldError id="donation-amount-error" message={check.errors.amount} />
            </div>
            {!shielded ? (
              <div>
                <label className="block text-sm font-bold text-slate-200" htmlFor="donor-label">Display name (public)</label>
                <input id="donor-label" value={v.donorLabel} onChange={(e) => upd({ donorLabel: e.target.value })} placeholder="e.g. Priya S." maxLength={40} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-white outline-none focus:border-teal-300/60" aria-invalid={!!check.errors.donorLabel} aria-describedby="donor-label-error" />
                <FieldError id="donor-label-error" message={check.errors.donorLabel} />
              </div>
            ) : (
              <div className="grid gap-2">
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm"><span className="flex items-center gap-2 font-semibold text-slate-200"><EyeOff className="h-4 w-4 text-indigo-300" /> Shield my identity</span><input type="checkbox" checked={v.shieldIdentity} onChange={(e) => upd({ shieldIdentity: e.target.checked })} className="h-4 w-4 accent-teal-400" /></label>
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm"><span className="flex items-center gap-2 font-semibold text-slate-200"><Lock className="h-4 w-4 text-amber-300" /> Shield exact amount</span><input type="checkbox" checked={v.shieldAmount} onChange={(e) => upd({ shieldAmount: e.target.checked })} className="h-4 w-4 accent-teal-400" /></label>
              </div>
            )}
            <div className="rounded-2xl border border-teal-300/20 bg-teal-400/[0.06] p-3 text-xs leading-relaxed text-slate-300">
              <p className="flex items-center gap-1.5 font-bold text-teal-200"><ShieldCheck className="h-4 w-4" /> Real shielded donation via Midnight Zswap</p>
              <p className="mt-1">You are donating <span className="font-extrabold text-white">{amtLabel}</span> to <span className="font-bold text-white">{p.campaign.title}</span>.</p>
              <p className="mt-2 font-bold text-slate-200">Visible on-chain:</p>
              <ul className="list-disc pl-5">{privacy.visibleToPublic.map((x) => <li key={x}>{x}</li>)}</ul>
              <p className="mt-2 font-bold text-slate-200">Hidden by shielding:</p>
              <ul className="list-disc pl-5">{privacy.hiddenByShielding.length ? privacy.hiddenByShielding.map((x) => <li key={x}>{x}</li>) : <li>Nothing extra hidden</li>}</ul>
            </div>
            {(!p.api || !p.contractAddress || !p.campaign.ledgerId) && (
              <p className="rounded-xl border border-red-300/20 bg-red-400/10 p-3 text-xs leading-relaxed text-red-200">
                Cannot donate: {(!p.api && 'Wallet not connected') || (!p.contractAddress && 'Contract not deployed') || (!p.campaign.ledgerId && 'Campaign not linked to on-chain ID')}.
              </p>
            )}
            <div className="grid gap-2 sm:grid-cols-2">
              <Button disabled={!canSubmit} onClick={handleDonate} className="group">
                <Lock className="h-4 w-4 mr-2" />
                Donate {amtLabel}
              </Button>
              <Button variant="secondary" onClick={p.onClose}>Close</Button>
            </div>
          </>
        )}

        {status === 'preparing' && (
          <div className="space-y-3 text-center py-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-teal-400" />
            <p className="font-bold text-white">Preparing donation...</p>
            <p className="text-sm text-slate-400">{progressMsg || 'Reading shielded balance and building coin...'}</p>
          </div>
        )}

        {status === 'wallet-approval' && (
          <div className="space-y-3 text-center py-4">
            <Lock className="h-8 w-8 mx-auto text-amber-400" />
            <p className="font-bold text-white">Waiting for wallet authorization...</p>
            <p className="text-sm text-slate-400">{progressMsg || 'Approve the transaction in your Midnight wallet.'}</p>
          </div>
        )}

        {status === 'submitting' && (
          <div className="space-y-3 text-center py-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-teal-400" />
            <p className="font-bold text-white">Submitting transaction...</p>
            <p className="text-sm text-slate-400">{progressMsg || 'Waiting for network finalization...'}</p>
          </div>
        )}

        {status === 'success' && result && (
          <div className="space-y-3 text-center py-4">
            <CheckCircle className="h-10 w-10 mx-auto text-emerald-400" />
            <p className="font-bold text-white">Donation confirmed!</p>
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-left text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Transaction ID</span>
                <a href={`https://preprod.midnightexplorer.com/tx/${result.txId}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-teal-300 hover:text-teal-200">
                  <span className="font-mono">{result.txId.slice(0, 16)}…</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-slate-400">Block height</span>
                <span className="font-mono text-white">{result.blockHeight.toString()}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-slate-400">Contract</span>
                <a href={`https://preprod.midnightexplorer.com/contract/${result.contractAddress}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-teal-300 hover:text-teal-200">
                  <span className="font-mono">{result.contractAddress.slice(0, 16)}…</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-slate-400">Campaign ID</span>
                <span className="font-mono text-white">#{result.ledgerCampaignId.toString()}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-slate-400">Amount (base units)</span>
                <span className="font-mono text-white">{result.baseUnits.toString()}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-slate-400">Token type</span>
                <span className="font-mono text-white">{result.tokenType.slice(0, 16)}…</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-slate-400">Status</span>
                <span className="font-mono text-emerald-300">{result.status}</span>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && error && (
          <div className="space-y-3 text-center py-4">
            <XCircle className="h-10 w-10 mx-auto text-red-400" />
            <p className="font-bold text-white">Donation failed</p>
            <p className="text-sm text-red-300 bg-red-400/10 rounded-xl p-3">{error}</p>
          </div>
        )}

        {(status === 'success' || status === 'error') && (
          <div className="grid gap-2 sm:grid-cols-2 pt-2">
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            {status === 'error' && (
              <Button onClick={() => setStatus('idle')}>Try Again</Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}