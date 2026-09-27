import { Award, FileCheck2, HandHeart, Layers, Lock, ShieldCheck } from 'lucide-react';
import { SectionHeading } from '../common/ui.tsx';

const steps = [
  {
    icon: HandHeart,
    title: '1. NGO Creates Campaign',
    text: 'NGOs define fundraising goals and metadata on-chain via the Compact createCampaign circuit on Midnight Preprod.',
  },
  {
    icon: Lock,
    title: '2. Donor Connects Wallet',
    text: 'Donors connect their Midnight Lace wallet. Wallet keys, seeds, and personal identities remain strictly local and protected.',
  },
  {
    icon: ShieldCheck,
    title: '3. Client-Side ZK Proving',
    text: 'A zero-knowledge proof is generated locally on the donor device with compiled proving keys before transaction submission.',
  },
  {
    icon: Layers,
    title: '4. Native NIGHT Transfer',
    text: 'Donations transfer native NIGHT tokens to the campaign balance, updating the public ledger state transparently.',
  },
  {
    icon: FileCheck2,
    title: '5. Verifiable Ledger Accounting',
    text: 'Campaign balance maps on the ledger update immediately, providing real-time auditability on Midnight Explorer.',
  },
  {
    icon: Award,
    title: '6. Privacy Without Compromise',
    text: 'Donation tracking is mathematically verifiable without ever storing donor names, emails, or personal data on-chain.',
  },
];

export function HowItWorks({ detailed = false }: { detailed?: boolean }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6" aria-labelledby="how-heading">
      <div id="how-heading">
        <SectionHeading
          eyebrow="How it works"
          title="Transparent donations with zero-knowledge verification"
          description="Built on Midnight Preprod: client-side ZK proof generation, verifiable on-chain campaign balances, and no donor PII on the ledger."
        />
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((s) => (
          <div
            key={s.title}
            className="group rounded-3xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-teal-300/30 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-teal-500/5"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-400/10 text-teal-300 ring-1 ring-teal-400/20 transition group-hover:bg-teal-400/20 group-hover:text-teal-200">
              <s.icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-base font-extrabold text-white group-hover:text-teal-200 transition-colors">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {s.text}
            </p>
          </div>
        ))}
      </div>

      {detailed ? (
        <div className="mt-8 rounded-3xl border border-teal-300/20 bg-teal-400/[0.04] p-6 backdrop-blur-sm">
          <h3 className="text-lg font-extrabold text-white">Midnight Preprod Integration Architecture</h3>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            All contract communication uses <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-teal-200">@midnight-ntwrk/midnight-js-contracts</code> with compiled Compact contracts in <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-teal-200">contract/managed</code>. Transactions are signed directly via the Midnight Lace browser wallet.
          </p>
        </div>
      ) : null}
    </section>
  );
}
