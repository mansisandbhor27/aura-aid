import { ShieldCheck } from 'lucide-react';
import type { AppView } from '../../types/index.ts';

export function Footer({ onNavigate }: { onNavigate: (v: AppView) => void }) {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="space-y-3">
          <p className="flex items-center gap-2 font-extrabold text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-teal-300 to-cyan-500 text-slate-950"><ShieldCheck className="h-4 w-4" /></span>
            AuraAid
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-slate-400">Privacy-preserving NGO donation transparency. Shield donor identity, prove every unit of impact.</p>
          <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-relaxed text-slate-500">Frontend demo foundation. Blockchain actions are disabled until real Midnight wallet + contract integration is implemented.</p>
        </div>
        <nav aria-label="Platform">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Platform</p>
          <div className="mt-3 grid gap-2 text-sm">
            <button type="button" onClick={() => onNavigate('discover')} className="w-fit text-left text-slate-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300">Discover campaigns</button>
            <button type="button" onClick={() => onNavigate('transparency')} className="w-fit text-left text-slate-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300">Transparency feed</button>
            <button type="button" onClick={() => onNavigate('ngos')} className="w-fit text-left text-slate-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300">Verified NGOs</button>
          </div>
        </nav>
        <nav aria-label="Trust">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Trust</p>
          <div className="mt-3 grid gap-2 text-sm">
            <button type="button" onClick={() => onNavigate('how-it-works')} className="w-fit text-left text-slate-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300">How shielding works</button>
            <span className="text-slate-500">Auditor access (coming soon)</span>
            <span className="text-slate-500">Verification policy (coming soon)</span>
          </div>
        </nav>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">AuraAid demo UI • No real Midnight transactions yet • Built with React + Tailwind</div>
    </footer>
  );
}
