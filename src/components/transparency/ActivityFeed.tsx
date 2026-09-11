import { BadgeCheck, EyeOff, FileText, HandCoins, ShieldCheck } from 'lucide-react';
import type { ActivityItem } from '../../types/index.ts';
import { Badge, SectionHeading } from '../common/ui.tsx';

function iconFor(kind: ActivityItem['kind']) {
  if (kind === 'donation') return <HandCoins className="h-4 w-4" />;
  if (kind === 'milestone-release') return <BadgeCheck className="h-4 w-4" />;
  if (kind === 'proof-published') return <FileText className="h-4 w-4" />;
  return <ShieldCheck className="h-4 w-4" />;
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHeading eyebrow="Live transparency" title="What happened, without exposing who gave" description="Demo feed. Production will stream donation validity proofs, milestone approvals and auditor events from Midnight." />
      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm font-extrabold text-white">Selective disclosure, explained</p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="rounded-xl bg-white/[0.04] p-3"><span className="font-bold text-white">Everyone verifies:</span> proof hash, pool math, milestone gating.</li>
            <li className="rounded-xl bg-white/[0.04] p-3"><span className="font-bold text-white">Nobody sees:</span> donor name, wallet, or exact shielded amount.</li>
            <li className="rounded-xl bg-white/[0.04] p-3"><span className="font-bold text-white">Auditors can:</span> open an encrypted envelope with donor consent or legal threshold.</li>
          </ul>
          <p className="rounded-xl border border-white/10 p-3 text-xs text-slate-400">No fake explorer links are shown. Hashes above are demo placeholders until indexer integration lands.</p>
        </div>
        <ol className="space-y-2">
          {items.map((a) => (
            <li key={a.id} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-400/15 text-teal-200">{iconFor(a.kind)}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-white">{a.title}</p>
                  {a.shielded ? <Badge tone="indigo"><EyeOff className="h-3 w-3" /> Shielded</Badge> : <Badge tone="emerald">Public</Badge>}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{a.detail}</p>
                <p className="mt-1.5 font-mono text-[11px] text-slate-500">{a.actorLabel} • {a.timestampLabel}{a.proofHash ? ` • ${a.proofHash}` : ''}{a.amountLabel ? ` • ${a.amountLabel}` : ''}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
