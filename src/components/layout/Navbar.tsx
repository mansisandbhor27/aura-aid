import { Menu, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { AppView, MidnightConnectionState } from '../../types/index.ts';
import { MidnightStatusBar } from '../midnight/MidnightStatusBar.tsx';
import { cn } from '../../utils/cn.ts';

const links: Array<{ id: AppView; label: string }> = [
  { id: 'discover', label: 'Discover' },
  { id: 'transparency', label: 'Transparency' },
  { id: 'ngos', label: 'NGOs' },
  { id: 'how-it-works', label: 'How it works' },
];

export function Navbar(p: {
  view: AppView;
  onNavigate: (v: AppView) => void;
  connection: MidnightConnectionState;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:rounded-lg focus:bg-teal-400 focus:px-3 focus:py-2 focus:text-sm focus:font-bold focus:text-slate-950">Skip to content</a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <button type="button" onClick={() => p.onNavigate('discover')} className="flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300" aria-label="AuraAid home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal-300 via-emerald-400 to-cyan-500 text-slate-950"><ShieldCheck className="h-5 w-5" /></span>
          <span className="text-left leading-tight">
            <span className="block text-base font-extrabold tracking-tight text-white">AuraAid</span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-300">Shielded Giving</span>
          </span>
        </button>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((l) => (
            <button key={l.id} type="button" onClick={() => p.onNavigate(l.id)} aria-current={p.view === l.id ? 'page' : undefined} className={cn('rounded-xl px-3.5 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300', p.view === l.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/[0.06] hover:text-white')}>{l.label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <MidnightStatusBar connection={p.connection} onConnect={p.onConnect} onDisconnect={p.onDisconnect} />
          <button type="button" className="rounded-xl border border-white/10 p-2 text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 md:hidden" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen((s) => !s)}>{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>
      {mobileOpen ? (
        <nav className="border-t border-white/10 px-4 py-3 md:hidden" aria-label="Mobile">
          <div className="grid gap-1">
            {links.map((l) => (
              <button key={l.id} type="button" onClick={() => { p.onNavigate(l.id); setMobileOpen(false); }} aria-current={p.view === l.id ? 'page' : undefined} className={cn('rounded-xl px-3 py-2.5 text-left text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300', p.view === l.id ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/[0.06]')}>{l.label}</button>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
