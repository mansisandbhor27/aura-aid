import { useState } from 'react';
import { BadgeCheck, Building, MapPin, Search } from 'lucide-react';
import type { Ngo } from '../../types/index.ts';
import { formatUSD } from '../../utils/format.ts';
import { Badge, Button, Card, EmptyState, SectionHeading } from '../common/ui.tsx';

export function NgoCards({ ngos, onApply }: { ngos: Ngo[]; onApply?: () => void }) {
  const [q, setQ] = useState('');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [applied, setApplied] = useState(false);
  const list = ngos.filter((n) => {
    const hitQ = !q.trim() || `${n.name} ${n.location} ${n.mission}`.toLowerCase().includes(q.trim().toLowerCase());
    return hitQ && (!onlyVerified || n.verified);
  });
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6" aria-labelledby="ngos-heading">
      <div id="ngos-heading">
        <SectionHeading eyebrow="For NGOs" title="Verification before fundraising" description="NGOs publish milestones and proofs. Donors see verification, scores and full proof history." />
      </div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-slate-300 focus-within:border-teal-300/60">
          <Search className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
          <span className="sr-only">Search NGOs</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search NGOs, missions, places..." type="search" className="w-full bg-transparent outline-none placeholder:text-slate-500" />
        </label>
        <button type="button" aria-pressed={onlyVerified} onClick={() => setOnlyVerified((s) => !s)} className={`inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 ${onlyVerified ? 'bg-teal-400 text-slate-950' : 'border border-white/10 text-slate-300 hover:bg-white/10'}`}>
          <BadgeCheck className="h-4 w-4" /> Verified only
        </button>
      </div>
      {list.length === 0 ? (
        <div className="mt-5"><EmptyState title="No NGOs match" description="Clear the search or verified-only filter to see all demo partners." action={<Button variant="secondary" onClick={() => { setQ(''); setOnlyVerified(false); }}>Reset NGO filters</Button>} /></div>
      ) : (
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {list.map((n) => (
            <Card key={n.id} className="p-5 transition hover:border-teal-300/25">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal-400/30 to-cyan-500/20 text-teal-200"><Building className="h-5 w-5" /></span>
                  <div>
                    <p className="flex items-center gap-1.5 text-base font-extrabold text-white">{n.verified ? <BadgeCheck className="h-5 w-5 shrink-0 text-teal-300" /> : null} {n.name}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-400"><MapPin className="h-3.5 w-3.5" /> {n.location}</p>
                  </div>
                </div>
                {n.verified ? <Badge tone="emerald">Verified</Badge> : <Badge tone="amber">In review</Badge>}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{n.mission}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center" role="list" aria-label={`${n.name} stats`}>
                <div className="rounded-xl bg-white/[0.04] p-3" role="listitem"><p className="text-sm font-extrabold text-white">{formatUSD(n.totalRaised)}</p><p className="text-[11px] text-slate-500">Raised</p></div>
                <div className="rounded-xl bg-white/[0.04] p-3" role="listitem"><p className="text-sm font-extrabold text-white">{n.transparencyScore}%</p><p className="text-[11px] text-slate-500">Transparency</p></div>
                <div className="rounded-xl bg-white/[0.04] p-3" role="listitem"><p className="text-sm font-extrabold text-white">{n.proofCount}</p><p className="text-[11px] text-slate-500">Proofs</p></div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400"><span>{n.activeCampaigns} active campaigns</span><span className="font-mono text-[11px] text-slate-500">demo proofs • {n.proofCount} entries</span></div>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-5 rounded-3xl border border-white/10 bg-gradient-to-r from-teal-400/10 via-emerald-400/[0.07] to-cyan-400/10 p-5 sm:p-6">
        <h3 className="text-lg font-extrabold text-white">Are you an NGO? Join the verified cohort.</h3>
        <p className="mt-1 max-w-2xl text-sm text-slate-300">Submit registration, milestone plan and auditor. Fundraising limits lift automatically after verification proofs are accepted.</p>
        {applied ? (
          <p role="status" className="mt-4 rounded-xl border border-emerald-300/25 bg-emerald-400/10 p-3 text-sm font-semibold text-emerald-200">Demo application noted for this session. A real flow will collect documents and milestone plans — nothing was submitted.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button variant="secondary" className="bg-white text-slate-950 hover:bg-slate-200" onClick={() => { setApplied(true); onApply?.(); }}>Start NGO application (demo)</Button>
            <Button variant="secondary">Read verification policy</Button>
          </div>
        )}
      </div>
    </section>
  );
}

