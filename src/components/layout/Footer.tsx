import type { AppView } from '../../types/index.ts';
import { AuraAidLogo } from '../common/AuraAidLogo.tsx';

export function Footer({ onNavigate }: { onNavigate: (v: AppView) => void }) {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_0.85fr_0.85fr]">
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => onNavigate('discover')}
            className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
          >
            <AuraAidLogo size="md" />
          </button>
          <p className="max-w-sm text-sm leading-relaxed text-slate-400">
            Privacy-focused NGO donation platform built on Midnight Preprod. Empowering transparent charitable giving with client-side zero-knowledge proof verification.
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <a
              href="https://x.com/AuraAid_NGO"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-teal-300 transition hover:text-teal-200"
            >
              X (@AuraAid_NGO)
            </a>
            <span>•</span>
            <a
              href="https://github.com/mansisandbhor27/aura-aid"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 transition hover:text-white"
            >
              GitHub
            </a>
            <span>•</span>
            <a
              href="https://preprod.midnightexplorer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 transition hover:text-white"
            >
              Preprod Explorer
            </a>
          </div>
        </div>

        <nav aria-label="Platform navigation">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Platform</p>
          <div className="mt-3 grid gap-2.5 text-sm">
            <button
              type="button"
              onClick={() => onNavigate('discover')}
              className="w-fit text-left text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
            >
              Discover campaigns
            </button>
            <button
              type="button"
              onClick={() => onNavigate('transparency')}
              className="w-fit text-left text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
            >
              Transparency & Activity
            </button>
            <button
              type="button"
              onClick={() => onNavigate('ngos')}
              className="w-fit text-left text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
            >
              NGO Dashboard
            </button>
          </div>
        </nav>

        <nav aria-label="Resources navigation">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Resources</p>
          <div className="mt-3 grid gap-2.5 text-sm">
            <button
              type="button"
              onClick={() => onNavigate('how-it-works')}
              className="w-fit text-left text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
            >
              How it works
            </button>
            <a
              href="https://midnight-tmnight-preprod.nethermind.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-left text-slate-300 transition hover:text-white"
            >
              Midnight Faucet
            </a>
            <a
              href="https://github.com/mansisandbhor27/aura-aid/blob/main/docs/USAGE.md"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-left text-teal-300 transition hover:text-teal-200"
            >
              Documentation (USAGE.md)
            </a>
          </div>
        </nav>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        AuraAid MVP • Powered by Midnight Blockchain Preprod Network • Contract: <code className="font-mono text-slate-400">6afc78083dea96c0...310d4d1</code>
      </div>
    </footer>
  );
}
