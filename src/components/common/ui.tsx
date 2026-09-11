import type { ReactNode } from 'react';
import { cn } from '../../utils/cn.ts';

export function Badge({
  children,
  tone = 'slate',
  className,
}: {
  children: ReactNode;
  tone?: 'slate' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'sky';
  className?: string;
}) {
  const tones: Record<string, string> = {
    slate: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    sky: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-white/10', className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-teal-300 via-emerald-400 to-cyan-400 transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl space-y-2">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">{eyebrow}</p>
      <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{title}</h2>
      {description ? <p className="text-sm leading-relaxed text-slate-400">{description}</p> : null}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </div>
  );
}
