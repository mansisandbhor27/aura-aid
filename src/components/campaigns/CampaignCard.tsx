import type { MouseEvent } from 'react';
import { BadgeCheck, Clock, MapPin, ShieldCheck } from 'lucide-react';
import type { Campaign } from '../../types/index.ts';
import { formatUSD, progressPercent } from '../../utils/format.ts';
import { Badge, Button, Card, ProgressBar } from '../common/ui.tsx';

const statusTone: Record<Campaign['status'], { label: string; tone: 'emerald' | 'amber' | 'sky' }> = {
  active: { label: 'Active', tone: 'emerald' },
  funded: { label: 'Funded', tone: 'sky' },
  'closing-soon': { label: 'Closing soon', tone: 'amber' },
};

export function CampaignCard({
  campaign,
  onDonate,
}: {
  campaign: Campaign;
  onDonate: (c: Campaign) => void;
}) {
  const pct = progressPercent(campaign.raisedAmount, campaign.goalAmount);
  const meta = statusTone[campaign.status];
  const handleDonate = (e: MouseEvent) => {
    e.stopPropagation();
    onDonate(campaign);
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:border-teal-400/40 hover:shadow-xl hover:shadow-teal-500/5">
      <div className={`bg-gradient-to-br ${campaign.imageGradient} relative h-40 p-4 transition-transform duration-500 group-hover:scale-[1.01]`}>
        <div className="flex items-start justify-between gap-2">
          <Badge tone={meta.tone}>{meta.label}</Badge>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/70 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-300" />
            {campaign.ledgerId ? `Ledger #${campaign.ledgerId}` : 'ZK-Verified'}
          </span>
        </div>
        <p className="absolute bottom-3 left-4 right-4 flex items-center gap-1.5 text-xs font-semibold text-white/95 drop-shadow-sm">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-teal-300" />
          <span className="truncate">{campaign.location}</span>
        </p>
      </div>

      <div className="space-y-3.5 p-5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
          {campaign.ngoVerified ? <BadgeCheck className="h-4 w-4 shrink-0 text-teal-300" /> : null}
          <span className="truncate">{campaign.ngoName}</span>
          {!campaign.ngoVerified ? <Badge tone="amber">Unverified</Badge> : null}
        </div>

        <h3 className="text-lg font-extrabold leading-snug text-white group-hover:text-teal-200 transition-colors">
          {campaign.title}
        </h3>

        <p className="line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-slate-400">
          {campaign.description}
        </p>

        <div className="pt-1">
          <div className="flex items-baseline justify-between gap-2 text-sm">
            <span className="font-extrabold text-white text-base">
              {formatUSD(campaign.raisedAmount)}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              goal {formatUSD(campaign.goalAmount)}
            </span>
          </div>

          <ProgressBar value={pct} className="mt-2 h-2.5" />

          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-slate-300">
              {pct}% funded • {campaign.donorCount.toLocaleString()} donors
            </span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              <Clock className="h-3.5 w-3.5 text-slate-500" />
              {campaign.status === 'funded' ? 'Target met' : `${campaign.deadlineDaysLeft}d left`}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {campaign.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-semibold text-slate-300"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="pt-2">
          <Button
            onClick={handleDonate}
            className="w-full justify-center py-2.5 text-sm font-bold shadow-md shadow-teal-500/10"
            aria-label={`Donate to ${campaign.title}`}
          >
            Donate
          </Button>
        </div>
      </div>
    </Card>
  );
}
