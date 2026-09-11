import { Eye, EyeOff, FileText, HandHeart, LockKeyhole, ShieldCheck } from 'lucide-react';
import { SectionHeading } from '../common/ui.tsx';

const steps = [
  { icon: HandHeart, title: '1. Donor gives with shielding', text: 'Choose a campaign, pick what to shield: identity, amount, or both. A validity proof is generated locally.' },
  { icon: EyeOff, title: '2. Pool grows, privacy holds', text: 'The public pool total updates without linking you to any amount. Wallet graphs stay unlinkable.' },
  { icon: FileText, title: '3. NGO publishes milestone proof', text: 'Photos, lab reports, scans and attendance become signed, checkable proofs — not PDFs in an inbox.' },
  { icon: LockKeyhole, title: '4. Funds unlock by contract', text: 'Milestone money releases only when proofs pass. Otherwise funds stay locked or return.' },
  { icon: Eye, title: '5. Anyone verifies, auditors inspect', text: 'The public verifies hashes and totals. Auditors open selective-disclosure envelopes when allowed.' },
  { icon: ShieldCheck, title: '6. Midnight enforces the rules', text: 'Production uses Compact contracts + ZK circuits. This demo previews the UX before chain wiring.' },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHeading eyebrow="How it works" title="Shielded donations, provable milestones" description="Designed for real Midnight integration: local proofs, contract-gated releases, selective auditor disclosure." />
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((s) => (
          <div key={s.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-400/15 text-teal-200"><s.icon className="h-5 w-5" /></span>
            <h3 className="mt-3 font-extrabold text-white">{s.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
