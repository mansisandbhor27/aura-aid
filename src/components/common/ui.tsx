import type { ButtonHTMLAttributes, ReactNode } from 'react';
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
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-white/10', className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(Math.min(100, Math.max(0, value)))}
    >
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

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export function Button({
  variant = 'primary',
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50';
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-teal-400 text-slate-950 hover:bg-teal-300',
    secondary: 'border border-white/10 bg-white/[0.05] text-white hover:bg-white/10',
    ghost: 'text-teal-300 hover:text-teal-200 hover:bg-white/[0.06]',
    danger: 'bg-rose-500/15 border border-rose-400/30 text-rose-200 hover:bg-rose-500/25',
  };
  return <button type="button" className={cn(base, variants[variant], className)} {...rest} />;
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center">
      <p className="text-sm font-extrabold text-white">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-400">{description}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-xl bg-white/10', className)} />;
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]" aria-hidden="true">
      <Skeleton className="h-36 rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-semibold text-rose-300">
      {message}
    </p>
  );
}

