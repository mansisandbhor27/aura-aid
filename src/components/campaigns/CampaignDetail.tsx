import { BadgeCheck, Check, Clock, Lock } from 'lucide-react';
import type { Campaign } from '../../types/index.ts';
import { formatUSD, progressPercent } from '../../utils/format.ts';
import { Badge, Button, ProgressBar } from '../common/ui.tsx';
import { Modal, ModalHeader } from '../common/Modal.tsx';

export function CampaignDetail({ campaign, onClose, onDonate }: {
  campaign: Campaign; onClose: () => void; onDonate: (c: Campaign) => void;
}) {
  const pct = progressPercent(campaign.raisedAmount, campaign.goalAmount);
  return (
    <Modal wide label={campaign.title} onClose={onClose}>
      <ModalHeader eyebrow={campaign.ngoName} title={campaign.title} subtitle={campaign.location} onClose={onClose} />
      <div className={`mt-4 rounded-2xl bg-gradient-to-br ${campaign.imageGradient} p-4`}>
        <p className="flex items-center gap-1.5 text-sm font-bold text-white">{campaign.ngoVerified ? <BadgeCheck className="h-4 w-4" /> : null} {campaign.ngoName} • {pct}% funded</p>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-300">{campaign.description}</p>
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-baseline justify-between gap-2 text-sm">
          <span className="text-xl font-extrabold text-white">{formatUSD(campaign.raisedAmount)}</span>
          <span className="text-slate-400">goal {formatUSD(campaign.goalAmount)} • {pct}%</span>
        </div>
        <ProgressBar value={pct} className="mt-3" />
        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400"><Clock className="h-3.5 w-3.5" /> {campaign.donorCount.toLocaleString()} donors • {campaign.shieldedPercent}% shielded • {campaign.status === 'funded' ? 'Complete' : `${campaign.deadlineDaysLeft} days left`}</p>
      </div>
      <h4 className="mt-5 text-sm font-extrabold uppercase tracking-wider text-slate-300">Milestones & proofs</h4>
      <div className="mt-2 space-y-2">
        {campaign.milestones.map((m) => (
          <div key={m.id} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${m.isReleased ? 'bg-emerald-400 text-slate-950' : 'bg-white/10 text-slate-300'}`}>{m.isReleased ? <Check className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">{m.title}</p>
              <p className="mt-0.5 font-mono text-xs text-slate-400">proof: {m.proofHash} • {formatUSD(m.releasedAmount)} / {formatUSD(m.targetAmount)}</p>
            </div>
            {m.isReleased ? <Badge tone="emerald">Released</Badge> : <Badge tone="amber">Gated</Badge>}
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <Button onClick={() => onDonate(campaign)}>Donate privately (demo)</Button>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-500">Demo detail view. Real milestone verification will read Midnight contract state and proof history.</p>
    </Modal>
  );
}
