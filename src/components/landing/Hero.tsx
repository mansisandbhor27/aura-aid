import { Award, Eye, EyeOff, LockKeyhole, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import type { PlatformStats } from '../../types/index.ts';
import { Button } from '../common/ui.tsx';
import { formatCompact, formatUSD } from '../../utils/format.ts';

export function Hero({ stats, onExplore, onHowItWorks }: {
  stats: PlatformStats; onExplore: () => void; onHowItWorks: () => void;
}) {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute -left-24 top-40 hidden h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl md:block" />
        <div className="absolute -right-24 top-24 hidden h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl md:block" />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-14">
        <div className="space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full border border-teal-300/25 bg-teal-400/10 px-3 py-1.5 text-xs font-bold text-teal-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
            Midnight Preprod preview • Demo frontend
          </p>
          <h1 id="hero-heading" className="text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Give privately.
            <span className="block bg-gradient-to-r from-teal-200 to-cyan-300 bg-clip-text text-transparent">Prove impact publicly.</span>
          </h1>
          <p className="max-w-xl text-base text-slate-300 sm:text-lg">AuraAid lets donors support verified NGOs with shielded identities, while milestone releases stay publicly verifiable via zero-knowledge proofs.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={onExplore} className="px-5 py-3">Explore campaigns</Button>
            <Button variant="secondary" onClick={onHowItWorks} className="px-5 py-3"><ShieldCheck className="h-4 w-4 text-teal-300" /> How shielding works</Button>
          </div>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"><dt className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400"><TrendingUp className="h-3.5 w-3.5" /> Donated</dt><dd className="mt-1 text-lg font-extrabold text-white">{formatCompact(stats.totalDonated)}</dd><dd className="text-xs text-slate-500">{formatUSD(stats.totalDonated)}</dd></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"><dt className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400"><Users className="h-3.5 w-3.5" /> Donors</dt><dd className="mt-1 text-lg font-extrabold text-white">{stats.totalDonors.toLocaleString()}</dd><dd className="text-xs text-slate-500">{stats.shieldedRatePercent}% shielded</dd></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"><dt className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400"><Award className="h-3.5 w-3.5" /> NGOs</dt><dd className="mt-1 text-lg font-extrabold text-white">{stats.activeNgos}</dd><dd className="text-xs text-slate-500">Verified partners</dd></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"><dt className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400"><ShieldCheck className="h-3.5 w-3.5" /> Proofs</dt><dd className="mt-1 text-lg font-extrabold text-white">{stats.proofsPublished.toLocaleString()}</dd><dd className="text-xs text-slate-500">Published</dd></div>
          </dl>
        </div>
        <aside className="h-fit space-y-3 rounded-3xl border border-white/10 bg-white/[0.04] p-5" aria-label="Privacy model">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-200">Privacy model</p>
          <div className="flex gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-400/[0.07] p-3 text-sm"><Eye className="h-5 w-5 shrink-0 text-emerald-300" /><p className="text-slate-300"><span className="font-bold text-emerald-200">Public:</span> pooled totals, milestones, proof hashes.</p></div>
          <div className="flex gap-3 rounded-2xl border border-indigo-300/20 bg-indigo-400/[0.07] p-3 text-sm"><EyeOff className="h-5 w-5 shrink-0 text-indigo-300" /><p className="text-slate-300"><span className="font-bold text-indigo-200">Shielded:</span> donor identity, exact amount, wallet links.</p></div>
          <div className="flex gap-3 rounded-2xl border border-amber-300/20 bg-amber-400/[0.07] p-3 text-sm"><LockKeyhole className="h-5 w-5 shrink-0 text-amber-300" /><p className="text-slate-300"><span className="font-bold text-amber-200">Auditors:</span> selective disclosure only, never public exposure.</p></div>
          <p className="rounded-xl border border-amber-300/20 bg-amber-400/10 p-3 text-xs leading-relaxed text-amber-200">Demo mode: UI uses mock data. No real on-chain transaction is submitted.</p>
        </aside>
      </div>
    </section>
  );
}
