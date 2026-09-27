import { cn } from '../../utils/cn.ts';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function AuraAidLogo({ className, size = 'md', showText = true }: LogoProps) {
  const iconSizes = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'relative grid place-items-center rounded-xl bg-gradient-to-br from-teal-400 via-emerald-500 to-cyan-600 p-0.5 shadow-lg shadow-teal-500/20 ring-1 ring-white/20',
          iconSizes[size],
        )}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full p-1 text-slate-950"
          aria-hidden="true"
        >
          {/* Outer Aura Halo Ring */}
          <circle
            cx="18"
            cy="18"
            r="15"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 2"
            className="opacity-70"
          />
          {/* Inner Protective Shield */}
          <path
            d="M18 6L28 10.5V17C28 23.5 23.8 28.8 18 31C12.2 28.8 8 23.5 8 17V10.5L18 6Z"
            fill="currentColor"
            fillOpacity="0.85"
          />
          {/* Core Aid Giving Heart / Keyhole Node */}
          <path
            d="M18 13C16.343 13 15 14.343 15 16C15 17.2 15.7 18.23 16.7 18.72L16 23.5H20L19.3 18.72C20.3 18.23 21 17.2 21 16C21 14.343 19.657 13 18 13Z"
            fill="#020617"
          />
        </svg>
      </div>

      {showText && (
        <span className="text-left leading-tight">
          <span
            className={cn(
              'block font-extrabold tracking-tight text-white transition-colors group-hover:text-teal-200',
              textSizes[size],
            )}
          >
            AuraAid
          </span>
          <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-teal-300">
            Midnight Preprod
          </span>
        </span>
      )}
    </div>
  );
}

export function AuraAidIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="18"
        cy="18"
        r="15"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 2"
        className="opacity-70"
      />
      <path
        d="M18 6L28 10.5V17C28 23.5 23.8 28.8 18 31C12.2 28.8 8 23.5 8 17V10.5L18 6Z"
        fill="currentColor"
      />
      <path
        d="M18 13C16.343 13 15 14.343 15 16C15 17.2 15.7 18.23 16.7 18.72L16 23.5H20L19.3 18.72C20.3 18.23 21 17.2 21 16C21 14.343 19.657 13 18 13Z"
        fill="#020617"
      />
    </svg>
  );
}
