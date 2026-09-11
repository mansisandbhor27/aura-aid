import type { MouseEvent } from 'react';
import { BadgeCheck, Clock, EyeOff, MapPin } from 'lucide-react';
import type { Campaign } from '../../types/index.ts';
import { formatUSD, progressPercent } from '../../utils/format.ts';
import { Badge, Button, Card, ProgressBar } from '../common/ui.tsx';

const statusTone: Record<Campaign['status'], { label: string; tone: 'emerald' | 'amber' | 'sky' }> = {
  active: { label: 'Active', tone: 'emerald' },
  funded: { label: 'Funded', tone: 'sky' },
  'closing-soon': { label: 'Closing soon', tone: 'amber' },
};

export function CampaignCard({ campaign, onDonate }: {
  campaign: Campaign; onDonate: (c: Campaign) => void;
}) {
  const pct = progressPercent(campaign.raisedAmount, campaign.goalAmount);
  const meta = statusTone[campaign.status];
  const handleDonate = (e: MouseEvent) => {
    e.stopPropagation();
    onDonate(campaign);
  };
  return (
    <Card className="overflow-hidden transition hover:border-teal-300/30">
      <div className={`bg-gradient-to-br ${campaign.imageGradient} relative h-36 p-4`}>
        <div className="flex items-start justify-between gap-2">
          <Badge tone={meta.tone}>{meta.label}</Badge>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
            <EyeOff className="h-3 w-3" /> {campaign.shieldedPercent}% shielded
          </span>
        </div>
        <p className="absolute bottom-3 left-4 right-4 flex items-center gap-1.5 text-xs font-semibold text-white/90">
          <MapPin className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{campaign.location}</span>
        </p>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
          {campaign.ngoVerified ? <BadgeCheck className="h-4 w-4 shrink-0 text-teal-300" /> : null}
          <span className="truncate">{campaign.ngoName}</span>
          {!campaign.ngoVerified ? <Badge tone="amber">Unverified</Badge> : null}
        </div>
        <h3 className="text-lg font-extrabold leading-snug text-white">{campaign.title}</h3>
        <p className="line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-slate-400">{campaign.description}</p>
        <div>
          <div className="flex items-baseline justify-between gap-2 text-sm">
            <span className="font-extrabold text-white">{formatUSD(campaign.raisedAmount)}</span>
            <span className="text-slate-400">of {formatUSD(campaign.goalAmount)}</span>
          </div>
          <ProgressBar value={pct} className="mt-2" />
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>{pct}% funded • {campaign.donorCount.toLocaleString()} donors</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {campaign.status === 'funded' ? 'Complete' : `${campaign.deadlineDaysLeft}d left`}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {campaign.tags.map((t) => (
            <span key={t} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-semibold text-slate-300">{t}</span>
          ))}
        </div>
        <Button onClick={handleDonate} className="w-full" aria-label={`Donate privately to ${campaign.title}`}>
          Donate privately
        </Button>
      </div>
    </Card>
  );
}

