import { Award, CheckCircle2, Eye, LockKeyhole, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import type { PlatformStats } from '../../types/index.ts';
import { Button } from '../common/ui.tsx';
import { formatCompact, formatUSD } from '../../utils/format.ts';

export function Hero({
  stats,
  onExplore,
  onHowItWorks,
}: {
  stats: PlatformStats;
  onExplore: () => void;
  onHowItWorks: () => void;
}) {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 left-1/2 h-80 w-[46rem] -translate-x-1/2 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="absolute -left-20 top-40 hidden h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl md:block" />
        <div className="absolute -right-20 top-20 hidden h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl md:block" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-8 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:pt-14">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-teal-400/10 px-3.5 py-1.5 text-xs font-semibold text-teal-200 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Midnight Preprod Network • Active Contract Live
          </div>

          <h1 id="hero-heading" className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Give privately.
            <span className="mt-1 block bg-gradient-to-r from-teal-200 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Prove impact publicly.
            </span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            AuraAid enables transparent charitable donations on the Midnight blockchain. Donors contribute with client-side zero-knowledge proofs without exposing personal identifying information, while campaign milestones stay publicly verifiable on-chain.
          </p>

          <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <Button onClick={onExplore} className="px-6 py-3.5 text-sm font-bold shadow-lg shadow-teal-500/20">
              Explore campaigns
            </Button>
            <Button
              variant="secondary"
              onClick={onHowItWorks}
              className="px-6 py-3.5 text-sm font-bold border-white/15 hover:border-teal-300/40"
            >
              <ShieldCheck className="h-4 w-4 text-teal-300 mr-1.5" />
              How verification works
            </Button>
          </div>

          <dl className="grid grid-cols-2 gap-3.5 pt-2 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-sm transition hover:border-white/20">
              <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <TrendingUp className="h-3.5 w-3.5 text-teal-300" /> Total Goal
              </dt>
              <dd className="mt-1.5 text-lg font-extrabold text-white">{formatCompact(stats.totalDonated)}</dd>
              <dd className="text-xs text-slate-400">{formatUSD(stats.totalDonated)}</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-sm transition hover:border-white/20">
              <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <Users className="h-3.5 w-3.5 text-cyan-300" /> Supporters
              </dt>
              <dd className="mt-1.5 text-lg font-extrabold text-white">{stats.totalDonors.toLocaleString()}</dd>
              <dd className="text-xs text-slate-400">Verified donations</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-sm transition hover:border-white/20">
              <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <Award className="h-3.5 w-3.5 text-emerald-300" /> NGOs
              </dt>
              <dd className="mt-1.5 text-lg font-extrabold text-white">{stats.activeNgos}</dd>
              <dd className="text-xs text-slate-400">Campaign partners</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-sm transition hover:border-white/20">
              <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-300" /> Network
              </dt>
              <dd className="mt-1.5 text-lg font-extrabold text-white">Preprod</dd>
              <dd className="text-xs text-slate-400">Midnight Testnet</dd>
            </div>
          </dl>
        </div>

        <aside
          className="h-fit space-y-3.5 rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md"
          aria-label="Privacy model architecture"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-300">
              Audited Privacy Model
            </p>
            <span className="rounded-full bg-teal-400/10 px-2.5 py-0.5 text-[10px] font-bold text-teal-300">
              Midnight Compact
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            <div className="flex gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-400/[0.06] p-3.5 text-xs">
              <Eye className="h-4 w-4 shrink-0 text-emerald-300 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-200">Public On-Chain:</span>
                <p className="text-slate-300 mt-0.5">
                  Campaign goals, pooled balances, transaction IDs, and block heights.
                </p>
              </div>
            </div>

            <div className="flex gap-3 rounded-2xl border border-teal-300/20 bg-teal-400/[0.06] p-3.5 text-xs">
              <LockKeyhole className="h-4 w-4 shrink-0 text-teal-300 mt-0.5" />
              <div>
                <span className="font-bold text-teal-200">Client-Side ZK Proving:</span>
                <p className="text-slate-300 mt-0.5">
                  Transactions are authorized via local Zero-Knowledge proofs without disclosing private keys.
                </p>
              </div>
            </div>

            <div className="flex gap-3 rounded-2xl border border-indigo-300/20 bg-indigo-400/[0.06] p-3.5 text-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-300 mt-0.5" />
              <div>
                <span className="font-bold text-indigo-200">Zero Donor PII On-Chain:</span>
                <p className="text-slate-300 mt-0.5">
                  Real names, emails, and personal identifiers are never stored on the ledger.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-[11px] leading-relaxed text-slate-400">
            <span className="font-semibold text-slate-300">Contract: </span>
            <code className="font-mono text-teal-300">6afc78...d4d1</code>
            <span className="block mt-0.5">Connect Midnight Lace wallet to submit live transactions.</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
