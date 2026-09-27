import { BadgeCheck, EyeOff, FileText, HandCoins, ShieldCheck } from 'lucide-react';
import type { ActivityItem } from '../../types/index.ts';
import { Badge, Button, EmptyState, Skeleton } from '../common/ui.tsx';

function iconFor(kind: ActivityItem['kind']) {
  if (kind === 'donation') return <HandCoins className="h-4 w-4" />;
  if (kind === 'milestone-release') return <BadgeCheck className="h-4 w-4" />;
  if (kind === 'proof-published') return <FileText className="h-4 w-4" />;
  return <ShieldCheck className="h-4 w-4" />;
}

export function ActivityList(p: {
  items: ActivityItem[];
  loading: boolean;
  demoCount: number;
  onClearFilter: () => void;
}) {
  if (p.loading) {
    return (
      <div className="space-y-3" aria-label="Loading activity" role="status">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex gap-3.5 rounded-2xl border border-white/10 bg-slate-900/40 p-4"
          >
            <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (p.items.length === 0) {
    return (
      <EmptyState
        title={p.demoCount === 0 ? 'No activity in this category yet' : 'No donations recorded'}
        description="Submit a live on-chain donation or campaign registration on Midnight Preprod to see new ledger activity here."
        action={
          <Button variant="secondary" onClick={p.onClearFilter}>
            Show all activity
          </Button>
        }
      />
    );
  }

  return (
    <ol className="space-y-3" aria-live="polite">
      {p.items.map((a) => (
        <li
          key={a.id}
          className="flex gap-3.5 rounded-2xl border border-white/10 bg-slate-900/50 p-4 transition-all hover:border-teal-300/30 hover:bg-slate-900/70"
        >
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-400/10 text-teal-300 ring-1 ring-teal-400/20"
            aria-hidden="true"
          >
            {iconFor(a.kind)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-white">{a.title}</p>
              {a.shielded ? (
                <Badge tone="indigo">
                  <EyeOff className="h-3 w-3" /> Anonymous
                </Badge>
              ) : (
                <Badge tone="emerald">Named Supporter</Badge>
              )}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{a.detail}</p>
            <p className="mt-2 font-mono text-[11px] text-slate-400">
              {a.actorLabel} • {a.timestampLabel}
              {a.proofHash ? ` • tx: ${a.proofHash.slice(0, 16)}…` : ''}
              {a.amountLabel ? ` • ${a.amountLabel}` : ''}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
