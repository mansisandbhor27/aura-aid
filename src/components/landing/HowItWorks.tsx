import { Eye, EyeOff, FileText, HandHeart, LockKeyhole, ShieldCheck } from 'lucide-react';
import { getIntegrationChecklist } from '../../services/midnight/midnightService.ts';
import { SectionHeading } from '../common/ui.tsx';

const steps = [
  { icon: HandHeart, title: '1. Donor gives with shielding', text: 'Choose a campaign, pick what to shield: identity, amount, or both. A validity proof is generated locally.' },
  { icon: EyeOff, title: '2. Pool grows, privacy holds', text: 'The public pool total updates without linking you to any amount. Wallet graphs stay unlinkable.' },
  { icon: FileText, title: '3. NGO publishes milestone proof', text: 'Photos, lab reports, scans and attendance become signed, checkable proofs — not PDFs in an inbox.' },
  { icon: LockKeyhole, title: '4. Funds unlock by contract', text: 'Milestone money releases only when proofs pass. Otherwise funds stay locked or return.' },
  { icon: Eye, title: '5. Anyone verifies, auditors inspect', text: 'The public verifies hashes and totals. Auditors open selective-disclosure envelopes when allowed.' },
  { icon: ShieldCheck, title: '6. Midnight enforces the rules', text: 'Production uses Compact contracts + ZK circuits. This demo previews the UX before chain wiring.' },
];

export function HowItWorks({ detailed = false }: { detailed?: boolean }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6" aria-labelledby="how-heading">
      <div id="how-heading">
        <SectionHeading eyebrow="How it works" title="Shielded donations, provable milestones" description="Designed for real Midnight integration: local proofs, contract-gated releases, selective auditor disclosure." />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((s) => (
          <div key={s.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-teal-300/25">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-400/15 text-teal-200"><s.icon className="h-5 w-5" aria-hidden="true" /></span>
            <h3 className="mt-3 font-extrabold text-white">{s.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{s.text}</p>
          </div>
        ))}
      </div>
      {detailed ? (
        <div className="mt-6 rounded-3xl border border-amber-300/20 bg-amber-400/[0.06] p-5 sm:p-6">
          <h3 className="text-lg font-extrabold text-white">What remains for real Midnight integration</h3>
          <p className="mt-1 text-sm text-slate-300">All blockchain work is isolated in <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-teal-200">src/services/midnight</code>. Demo previews never submit transactions.</p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-slate-300">
            {getIntegrationChecklist().map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  );
}
