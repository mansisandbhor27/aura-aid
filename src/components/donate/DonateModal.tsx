import { useEffect, useMemo, useState } from 'react';
import { Check, CircleAlert, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import type { Campaign, DemoDonationReceipt, DonationFormValues, DonationPrivacyMode, MidnightConnectionState } from '../../types/index.ts';
import { buildDonationPreview, createDemoReceipt } from '../../services/midnight/midnightService.ts';
import { formatUSD, parseAmountInput, validateDonation } from '../../utils/format.ts';
import { Button, FieldError } from '../common/ui.tsx';
import { Modal, ModalHeader } from '../common/Modal.tsx';

const QUICK = [25, 50, 100, 250];
type Step = 'form' | 'confirming' | 'success';
const FRESH: DonationFormValues = { amount: 50, privacyMode: 'shielded', shieldIdentity: true, shieldAmount: true, donorLabel: '', note: '' };
export function DonateModal(p: { campaign: Campaign; connection: MidnightConnectionState; onClose: () => void; onDemoDonation?: (r: DemoDonationReceipt) => void }) {
  const [v, setV] = useState<DonationFormValues>(FRESH);
  const [text, setText] = useState('50');
  const [step, setStep] = useState<Step>('form');
  const [touched, setTouched] = useState(false);
  const [receipt, setReceipt] = useState<DemoDonationReceipt | null>(null);
  const check = useMemo(() => validateDonation(v), [v]);
  const preview = useMemo(() => buildDonationPreview({ campaignId: p.campaign.id, ...v }, p.connection), [p.campaign.id, v, p.connection]);
  useEffect(() => { setV(FRESH); setText('50'); setStep('form'); setTouched(false); setReceipt(null); }, [p.campaign.id]);
  const shielded = v.privacyMode === 'shielded';
  const upd = (patch: Partial<DonationFormValues>) => setV((s) => ({ ...s, ...patch }));
  const setMode = (privacyMode: DonationPrivacyMode) => setV((s) => {
    if (privacyMode === 'shielded') return { ...s, privacyMode };
    return { ...s, privacyMode, shieldAmount: false };
  });
  const confirm = () => {
    setTouched(true);
    if (!validateDonation(v).ok) return;
    setStep('confirming');
    window.setTimeout(() => { const r = createDemoReceipt(p.campaign, v); setReceipt(r); setStep('success'); p.onDemoDonation?.(r); }, 900);
  };
  const amtLabel = Number.isFinite(v.amount) ? formatUSD(v.amount) : '—';


  if (step === 'success' && receipt) {
    return (
      <Modal label="Donate dialog" onClose={p.onClose}>
        <ModalHeader eyebrow="Donation demo" title={p.campaign.title} subtitle={p.campaign.ngoName} onClose={p.onClose} />
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-300/25 bg-emerald-400/10 p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-400 text-slate-950"><Check className="h-5 w-5" /></span>
            <div><p className="font-extrabold text-white">Demo donation recorded locally</p><p className="mt-1 text-sm text-slate-300">Receipt {receipt.receiptId} for {formatUSD(receipt.amount)}. Frontend-only.</p></div>
          </div>
          <p className="rounded-xl border border-amber-300/20 bg-amber-400/10 p-3 text-xs text-amber-200">No tokens moved. Nothing submitted to Midnight.</p>
          <div className="grid gap-2 sm:grid-cols-2"><Button variant="secondary" onClick={() => { setStep('form'); setReceipt(null); }}>Donate again</Button><Button onClick={p.onClose}>Done</Button></div>
        </div>
      </Modal>
    );
  }
  return (
    <Modal label="Donate dialog" onClose={p.onClose}>
      <ModalHeader eyebrow="Donation demo" title={p.campaign.title} subtitle={p.campaign.ngoName} onClose={p.onClose} />
      <div className="mt-4 space-y-4">
        <div role="radiogroup" aria-label="Privacy mode" className="grid gap-2 sm:grid-cols-2">
          <button type="button" role="radio" aria-checked={shielded} onClick={() => setMode('shielded')} className={`rounded-2xl border p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 ${shielded ? 'border-teal-300/60 bg-teal-400/10' : 'border-white/10 bg-white/[0.03]'}`}>
            <span className="flex items-center gap-2 text-sm font-extrabold text-white"><EyeOff className="h-4 w-4 text-indigo-300" /> Shielded</span>
            <span className="mt-1 block text-xs text-slate-400">Hide identity behind a demo receipt.</span>
          </button>
          <button type="button" role="radio" aria-checked={!shielded} onClick={() => setMode('public')} className={`rounded-2xl border p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 ${!shielded ? 'border-teal-300/60 bg-teal-400/10' : 'border-white/10 bg-white/[0.03]'}`}>
            <span className="flex items-center gap-2 text-sm font-extrabold text-white"><Eye className="h-4 w-4 text-emerald-300" /> Public</span>
            <span className="mt-1 block text-xs text-slate-400">Show name and amount in demo feed.</span>
          </button>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-200" htmlFor="donation-amount">Amount (USD)</label>
          <div className="mt-2 flex flex-wrap items-center gap-2" role="group" aria-label="Quick amounts">
            {QUICK.map((amt) => (
              <button key={amt} type="button" aria-pressed={v.amount === amt} onClick={() => { upd({ amount: amt }); setText(String(amt)); }} className={`rounded-xl px-3 py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 ${v.amount === amt ? 'bg-teal-400 text-slate-950' : 'border border-white/10 text-slate-300'}`}>${amt}</button>
            ))}
            <input id="donation-amount" inputMode="decimal" autoComplete="off" value={text} onChange={(e) => { setText(e.target.value); upd({ amount: parseAmountInput(e.target.value) }); }} placeholder="Custom amount" className="min-w-[8rem] flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white outline-none focus:border-teal-300/60" aria-invalid={touched && !!check.errors.amount} aria-describedby="donation-amount-error" />
          </div>
          <FieldError id="donation-amount-error" message={touched ? check.errors.amount : undefined} />
        </div>
        {!shielded ? (
          <div>
            <label className="block text-sm font-bold text-slate-200" htmlFor="donor-label">Display name (public demo)</label>
            <input id="donor-label" value={v.donorLabel} onChange={(e) => upd({ donorLabel: e.target.value })} placeholder="e.g. Priya S." maxLength={40} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-white outline-none focus:border-teal-300/60" aria-invalid={touched && !!check.errors.donorLabel} aria-describedby="donor-label-error" />
            <FieldError id="donor-label-error" message={touched ? check.errors.donorLabel : undefined} />
          </div>
        ) : (
          <div className="grid gap-2">
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm"><span className="flex items-center gap-2 font-semibold text-slate-200"><EyeOff className="h-4 w-4 text-indigo-300" /> Shield my identity</span><input type="checkbox" checked={v.shieldIdentity} onChange={(e) => upd({ shieldIdentity: e.target.checked })} className="h-4 w-4 accent-teal-400" /></label>
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm"><span className="flex items-center gap-2 font-semibold text-slate-200"><Lock className="h-4 w-4 text-amber-300" /> Shield exact amount</span><input type="checkbox" checked={v.shieldAmount} onChange={(e) => upd({ shieldAmount: e.target.checked })} className="h-4 w-4 accent-teal-400" /></label>
          </div>
        )}
        <div className="rounded-2xl border border-teal-300/20 bg-teal-400/[0.06] p-3 text-xs leading-relaxed text-slate-300">
          <p className="flex items-center gap-1.5 font-bold text-teal-200"><ShieldCheck className="h-4 w-4" /> Donation preview (demo)</p>
          <p className="mt-1">Giving <span className="font-extrabold text-white">{amtLabel}</span> to <span className="font-bold text-white">{p.campaign.title}</span>.</p>
          <p className="mt-2 font-bold text-slate-200">Public in demo:</p>
          <ul className="list-disc pl-5">{preview.privacy.visibleToPublic.map((x) => <li key={x}>{x}</li>)}</ul>
          <p className="mt-2 font-bold text-slate-200">Hidden in demo:</p>
          <ul className="list-disc pl-5">{preview.privacy.hiddenByShielding.length ? preview.privacy.hiddenByShielding.map((x) => <li key={x}>{x}</li>) : <li>Nothing extra hidden</li>}</ul>
        </div>
        <p className="rounded-xl border border-amber-300/20 bg-amber-400/10 p-3 text-xs leading-relaxed text-amber-200">{preview.warning}</p>
        {touched && !check.ok ? (<p role="alert" className="flex items-start gap-2 rounded-xl border border-rose-400/25 bg-rose-500/10 p-3 text-xs font-semibold text-rose-200"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /> Please fix the highlighted fields before continuing.</p>) : null}
        <div className="grid gap-2 sm:grid-cols-2"><Button onClick={confirm} disabled={step === 'confirming'}>{step === 'confirming' ? 'Recording demo…' : shielded ? 'Confirm shielded demo donation' : 'Confirm public demo donation'}</Button><Button variant="secondary" onClick={p.onClose}>Cancel</Button></div>
      </div>
    </Modal>
  );
}
