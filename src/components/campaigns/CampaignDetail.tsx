import { BadgeCheck, Check, Clock, Lock, ShieldCheck } from 'lucide-react';
import type { Campaign } from '../../types/index.ts';
import { formatUSD, progressPercent } from '../../utils/format.ts';
import { Badge, Button, ProgressBar } from '../common/ui.tsx';
import { Modal, ModalHeader } from '../common/Modal.tsx';

export function CampaignDetail({
  campaign,
  onClose,
  onDonate,
}: {
  campaign: Campaign;
  onClose: () => void;
  onDonate: (c: Campaign) => void;
}) {
  const pct = progressPercent(campaign.raisedAmount, campaign.goalAmount);

  return (
    <Modal wide label={campaign.title} onClose={onClose}>
      <ModalHeader
        eyebrow={campaign.ngoName}
        title={campaign.title}
        subtitle={campaign.location}
        onClose={onClose}
      />

      <div className={`mt-4 rounded-2xl bg-gradient-to-br ${campaign.imageGradient} p-5 shadow-inner`}>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-sm font-bold text-white">
            {campaign.ngoVerified ? <BadgeCheck className="h-4 w-4 text-teal-300" /> : null}
            {campaign.ngoName}
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/70 px-2.5 py-1 text-xs font-bold text-teal-300 backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" />
            {campaign.ledgerId ? `Ledger #${campaign.ledgerId}` : 'ZK-Verified'}
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-300">
        {campaign.description}
      </p>

      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-sm">
        <div className="flex items-baseline justify-between gap-2 text-sm">
          <span className="text-xl font-extrabold text-white">
            {formatUSD(campaign.raisedAmount)}
          </span>
          <span className="text-xs font-semibold text-slate-400">
            goal {formatUSD(campaign.goalAmount)} • {pct}% funded
          </span>
        </div>
        <ProgressBar value={pct} className="mt-3 h-2.5" />
        <p className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="h-3.5 w-3.5 text-slate-500" />
          <span>{campaign.donorCount.toLocaleString()} supporters</span>
          <span>•</span>
          <span>{campaign.status === 'funded' ? 'Funded' : `${campaign.deadlineDaysLeft} days left`}</span>
        </p>
      </div>

      <h4 className="mt-6 text-xs font-extrabold uppercase tracking-wider text-slate-400">
        Milestones & Proof Verification
      </h4>

      <div className="mt-3 space-y-2.5">
        {campaign.milestones.map((m) => (
          <div
            key={m.id}
            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 transition hover:border-white/20"
          >
            <span
              className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                m.isReleased ? 'bg-emerald-400 text-slate-950' : 'bg-white/10 text-slate-300'
              }`}
            >
              {m.isReleased ? <Check className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">{m.title}</p>
              <p className="mt-0.5 font-mono text-xs text-slate-400 truncate">
                proof: {m.proofHash} • {formatUSD(m.releasedAmount)} / {formatUSD(m.targetAmount)}
              </p>
            </div>
            {m.isReleased ? <Badge tone="emerald">Released</Badge> : <Badge tone="amber">Pending</Badge>}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
        <Button onClick={() => onDonate(campaign)} className="w-full justify-center">
          Donate to Campaign
        </Button>
        <Button variant="secondary" onClick={onClose} className="w-full justify-center">
          Close
        </Button>
      </div>
    </Modal>
  );
}
