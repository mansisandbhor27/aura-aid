import { BadgeCheck, MapPin } from 'lucide-react';
import type { Ngo } from '../../types/index.ts';
import { formatUSD } from '../../utils/format.ts';
import { Badge, Card, SectionHeading } from '../common/ui.tsx';

export function NgoCards({ ngos }: { ngos: Ngo[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHeading eyebrow="For NGOs" title="Verification before fundraising" description="NGOs publish milestones and proofs. Donors see verification, scores and full proof history." />
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {ngos.map((n) => (
          <Card key={n.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 text-base font-extrabold text-white">
                  {n.verified ? <BadgeCheck className="h-5 w-5 text-teal-300" /> : null} {n.name}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-400"><MapPin className="h-3.5 w-3.5" /> {n.location}</p>
              </div>
              {n.verified ? <Badge tone="emerald">Verified</Badge> : <Badge tone="amber">In review</Badge>}
            </div>
            <p className="mt-3 text-sm text-slate-300">{n.mission}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-white/[0.04] p-3">
                <p className="text-sm font-extrabold text-white">{formatUSD(n.totalRaised)}</p>
                <p className="text-[11px] text-slate-500">Raised</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] p-3">
                <p className="text-sm font-extrabold text-white">{n.transparencyScore}%</p>
                <p className="text-[11px] text-slate-500">Transparency</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] p-3">
                <p className="text-sm font-extrabold text-white">{n.proofCount}</p>
                <p className="text-[11px] text-slate-500">Proofs</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>{n.activeCampaigns} active campaigns</span>
              <button type="button" className="font-bold text-teal-300 hover:text-teal-200">View proof history</button>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-5 rounded-3xl border border-white/10 bg-gradient-to-r from-teal-400/10 via-emerald-400/[0.07] to-cyan-400/10 p-5 sm:p-6">
        <h3 className="text-lg font-extrabold text-white">Are you an NGO? Join the verified cohort.</h3>
        <p className="mt-1 max-w-2xl text-sm text-slate-300">Submit registration, milestone plan and auditor. Fundraising limits lift automatically after verification proofs are accepted.</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button type="button" className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-slate-200">Start NGO application (demo)</button>
          <button type="button" className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10">Read verification policy</button>
        </div>
      </div>
    </section>
  );
}
