import { useEffect, useState } from 'react';
import type { ActivityItem } from '../../types/index.ts';
import { ActivityList } from './ActivityList.tsx';
import { SectionHeading } from '../common/ui.tsx';
import { ExternalLink, Layers, Lock, ShieldCheck } from 'lucide-react';

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  const [filter, setFilter] = useState<'all' | ActivityItem['kind']>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 400);
    return () => window.clearTimeout(t);
  }, []);

  const shown = filter === 'all' ? items : items.filter((a) => a.kind === filter);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6" aria-labelledby="transparency-heading">
      <div id="transparency-heading">
        <SectionHeading
          eyebrow="On-Chain Transparency"
          title="Verifiable donation activity on Midnight Preprod"
          description="Every donation executes through the Compact smart contract. Explore verified transaction proofs, block finality, and campaign balance updates."
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter activity">
        {([
          ['all', 'All Activity'],
          ['donation', 'Donations'],
          ['milestone-release', 'Milestones'],
          ['proof-published', 'ZK Proofs'],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            aria-pressed={filter === id}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 ${
              filter === id
                ? 'bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20'
                : 'border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="h-fit space-y-4 rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md lg:sticky lg:top-20">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-teal-300" />
            <h3 className="text-sm font-extrabold text-white">Midnight Verification Breakdown</h3>
          </div>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="rounded-2xl border border-white/5 bg-white/[0.03] p-3.5 space-y-1">
              <span className="font-bold text-teal-200 flex items-center gap-1.5">
                <Layers className="h-4 w-4" /> Public On-Chain Ledger
              </span>
              <p className="text-slate-400 leading-relaxed">
                Campaign goals, accumulated balance maps, transaction IDs, and block heights are permanently verifiable on Midnight.
              </p>
            </li>

            <li className="rounded-2xl border border-white/5 bg-white/[0.03] p-3.5 space-y-1">
              <span className="font-bold text-indigo-200 flex items-center gap-1.5">
                <Lock className="h-4 w-4" /> Off-Chain Donor Identity
              </span>
              <p className="text-slate-400 leading-relaxed">
                Personal identifying information (PII) such as real names, emails, and home addresses are never written to the blockchain.
              </p>
            </li>

            <li className="rounded-2xl border border-white/5 bg-white/[0.03] p-3.5 space-y-1">
              <span className="font-bold text-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Client-Side Proving
              </span>
              <p className="text-slate-400 leading-relaxed">
                Zero-knowledge validity proofs are generated locally with Midnight Lace before transaction submission to Preprod.
              </p>
            </li>
          </ul>

          <div className="rounded-2xl border border-teal-300/20 bg-teal-400/[0.04] p-3.5 text-xs text-slate-400">
            <a
              href="https://preprod.midnightexplorer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-teal-300 hover:text-teal-200"
            >
              <span>Explore Midnight Preprod Explorer</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <ActivityList
          items={shown}
          loading={loading}
          demoCount={0}
          onClearFilter={() => setFilter('all')}
        />
      </div>
    </section>
  );
}
