import { useEffect, useState } from 'react';
import type { ActivityItem } from '../../types/index.ts';
import { ActivityList } from './ActivityList.tsx';
import { SectionHeading } from '../common/ui.tsx';

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  const [filter, setFilter] = useState<'all' | ActivityItem['kind']>('all');
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = window.setTimeout(() => setLoading(false), 500); return () => window.clearTimeout(t); }, []);
  const shown = filter === 'all' ? items : items.filter((a) => a.kind === filter);
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6" aria-labelledby="transparency-heading">
      <div id="transparency-heading">
        <SectionHeading eyebrow="Live transparency" title="What happened, without exposing who gave" description="Production will stream donation validity proofs, milestone approvals and auditor events from Midnight." />
      </div>
      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter activity">
        {([['all', 'All'], ['donation', 'Donations'], ['milestone-release', 'Milestones'], ['proof-published', 'Proofs']] as const).map(([id, label]) => (
          <button key={id} type="button" onClick={() => setFilter(id)} aria-pressed={filter === id} className={`rounded-full px-3.5 py-1.5 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 ${filter === id ? 'bg-teal-400 text-slate-950' : 'border border-white/10 text-slate-300 hover:bg-white/10'}`}>{label}</button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="h-fit space-y-3 rounded-3xl border border-white/10 bg-white/[0.03] p-5 lg:sticky lg:top-20">
          <p className="text-sm font-extrabold text-white">Selective disclosure, explained</p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="rounded-xl bg-white/[0.04] p-3"><span className="font-bold text-white">Everyone verifies:</span> proof hash, pool math, milestone gating.</li>
            <li className="rounded-xl bg-white/[0.04] p-3"><span className="font-bold text-white">Nobody sees:</span> donor name, wallet, or exact shielded amount.</li>
            <li className="rounded-xl bg-white/[0.04] p-3"><span className="font-bold text-white">Auditors can:</span> open an encrypted envelope with donor consent or legal threshold.</li>
          </ul>
          <p className="rounded-xl border border-white/10 p-3 text-xs text-slate-400">On-chain data streamed from Midnight indexer.</p>
        </div>
        <ActivityList items={shown} loading={loading} demoCount={0} onClearFilter={() => setFilter('all')} />
      </div>
    </section>
  );
}

