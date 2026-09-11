import { ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import type { PlatformStats } from '../../types/index.ts';
import { formatCompact, formatUSD } from '../../utils/format.ts';

export function Hero({ stats, onExplore, onHowItWorks }: {
  stats: PlatformStats; onExplore: () => void; onHowItWorks: () => void;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-teal-500/20 blur-3xl" />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-14">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/25 bg-teal-400/10 px-3 py-1.5 text-xs font-bold text-teal-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Midnight Preprod preview
          </div>
          <h1 className="text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Give privately.
            <span className="block bg-gradient-to-r from-teal-200 to-cyan-300 bg-clip-text text-transparent">
              Prove impact publicly.
            </span>
          </h1>
          <p className="max-w-xl text-base text-slate-300 sm:text-lg">
            AuraAid lets donors support verified NGOs with shielded identities,
            while milestone releases stay publicly verifiable via ZK proofs.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={onExplore} className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-teal-300">
              Explore campaigns <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={onHowItWorks} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white hover:bg-white/10">
              <ShieldCheck className="h-4 w-4 text-teal-300" /> How shielding works
            </button>
          </div>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Donated</dt>
              <dd className="mt-1 text-lg font-extrabold text-white">{formatCompact(stats.totalDonated)}</dd>
              <dd className="text-xs text-slate-500">{formatUSD(stats.totalDonated)}</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Donors</dt>
              <dd className="mt-1 text-lg font-extrabold text-white">{stats.totalDonors.toLocaleString()}</dd>
              <dd className="text-xs text-slate-500">{stats.shieldedRatePercent}% shielded</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">NGOs</dt>
              <dd className="mt-1 text-lg font-extrabold text-white">{stats.activeNgos}</dd>
              <dd className="text-xs text-slate-500">Verified partners</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Proofs</dt>
              <dd className="mt-1 text-lg font-extrabold text-white">{stats.proofsPublished.toLocaleString()}</dd>
              <dd className="text-xs text-slate-500">Published</dd>
            </div>
          </dl>
        </div>
        <aside className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-200">Privacy model</p>
          <div className="flex gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-400/[0.07] p-3 text-sm">
            <Eye className="h-5 w-5 shrink-0 text-emerald-300" />
            <p className="text-slate-300"><span className="font-bold text-emerald-200">Public:</span> pooled totals, milestones, proof hashes.</p>
          </div>
          <div className="flex gap-3 rounded-2xl border border-indigo-300/20 bg-indigo-400/[0.07] p-3 text-sm">
            <EyeOff className="h-5 w-5 shrink-0 text-indigo-300" />
            <p className="text-slate-300"><span className="font-bold text-indigo-200">Shielded:</span> donor identity, exact amount, wallet links.</p>
          </div>
          <p className="rounded-xl border border-amber-300/20 bg-amber-400/10 p-3 text-xs text-amber-200">
            Demo mode: UI uses mock data. No real on-chain transaction is submitted.
          </p>
        </aside>
      </div>
    </section>
  );
}
