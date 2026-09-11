import { useMemo, useState } from 'react';
import { EyeOff, Lock, ShieldCheck, X } from 'lucide-react';
import type { Campaign, MidnightConnectionState } from '../../types/index.ts';
import { buildDonationPreview } from '../../services/midnight/midnightService.ts';

export function DonateModal({ campaign, connection, onClose }: {
  campaign: Campaign; connection: MidnightConnectionState; onClose: () => void;
}) {
  const [amount, setAmount] = useState(50);
  const [shieldIdentity, setShieldIdentity] = useState(true);
  const [shieldAmount, setShieldAmount] = useState(true);
  const preview = useMemo(() => buildDonationPreview({
    campaignId: campaign.id, amount, shieldIdentity, shieldAmount,
  }, connection), [campaign.id, amount, shieldIdentity, shieldAmount, connection]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:items-center" onClick={onClose} role="presentation">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-5 sm:p-6" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Donate to ${campaign.title}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-300">Shielded donation • demo</p>
            <h3 className="mt-1 text-lg font-extrabold text-white">{campaign.title}</h3>
            <p className="text-sm text-slate-400">{campaign.ngoName}</p>
          </div>
          <button type="button" aria-label="Close donate dialog" onClick={onClose} className="rounded-lg border border-white/10 p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
        </div>

        <label className="mt-4 block text-sm font-bold text-slate-200" htmlFor="donation-amount">Amount (USD)</label>
        <div className="mt-2 flex items-center gap-2">
          {[25, 50, 100, 250].map((v) => (
            <button key={v} type="button" onClick={() => setAmount(v)} className={`rounded-xl px-3 py-2 text-sm font-bold ${amount === v ? 'bg-teal-400 text-slate-950' : 'border border-white/10 text-slate-300 hover:bg-white/10'}`}>${v}</button>
          ))}
          <input id="donation-amount" type="number" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white outline-none focus:border-teal-300/60" />
        </div>

        <div className="mt-4 grid gap-2">
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm">
            <span className="flex items-center gap-2 font-semibold text-slate-200"><EyeOff className="h-4 w-4 text-indigo-300" /> Shield my identity</span>
            <input type="checkbox" checked={shieldIdentity} onChange={(e) => setShieldIdentity(e.target.checked)} className="h-4 w-4 accent-teal-400" />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm">
            <span className="flex items-center gap-2 font-semibold text-slate-200"><Lock className="h-4 w-4 text-amber-300" /> Shield exact amount</span>
            <input type="checkbox" checked={shieldAmount} onChange={(e) => setShieldAmount(e.target.checked)} className="h-4 w-4 accent-teal-400" />
          </label>
        </div>

        <div className="mt-4 rounded-2xl border border-teal-300/20 bg-teal-400/[0.06] p-3 text-xs leading-relaxed text-slate-300">
          <p className="flex items-center gap-1.5 font-bold text-teal-200"><ShieldCheck className="h-4 w-4" /> {preview.summary}</p>
          <p className="mt-2 font-bold text-slate-200">Public:</p>
          <ul className="list-disc pl-5">{preview.privacy.visibleToPublic.map((x) => <li key={x}>{x}</li>)}</ul>
          <p className="mt-2 font-bold text-slate-200">Hidden:</p>
          <ul className="list-disc pl-5">{preview.privacy.hiddenByShielding.length ? preview.privacy.hiddenByShielding.map((x) => <li key={x}>{x}</li>) : <li>Nothing extra hidden</li>}</ul>
        </div>
        <p className="mt-3 rounded-xl border border-amber-300/20 bg-amber-400/10 p-3 text-xs text-amber-200">{preview.warning}</p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button type="button" disabled className="cursor-not-allowed rounded-xl bg-white/10 px-4 py-3 text-sm font-bold text-slate-400" title="Disabled until real Midnight integration ships">Submit on-chain (disabled)</button>
          <button type="button" onClick={onClose} className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/10">Done</button>
        </div>
      </div>
    </div>
  );
}
