import { useState } from 'react';
import { BadgeCheck, Building, MapPin, Search } from 'lucide-react';
import type { Ngo } from '../../types/index.ts';
import { formatUSD } from '../../utils/format.ts';
import { Badge, Button, Card, EmptyState, SectionHeading } from '../common/ui.tsx';

export function NgoCards({ ngos, onApply }: { ngos: Ngo[]; onApply?: () => void }) {
  const [q, setQ] = useState('');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [applied, setApplied] = useState(false);

  const list = ngos.filter((n) => {
    const hitQ =
      !q.trim() ||
      `${n.name} ${n.location} ${n.mission}`
        .toLowerCase()
        .includes(q.trim().toLowerCase());
    return hitQ && (!onlyVerified || n.verified);
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6" aria-labelledby="ngos-heading">
      <div id="ngos-heading">
        <SectionHeading
          eyebrow="NGO Directory"
          title="Verified charitable partners"
          description="Participating NGOs with verified on-chain campaign milestones and transparency scores."
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex w-full max-w-sm items-center gap-2.5 rounded-xl border border-white/10 bg-slate-900/60 px-3.5 py-2.5 text-sm text-slate-300 backdrop-blur-sm focus-within:border-teal-300/60">
          <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <span className="sr-only">Search NGOs</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search NGOs, missions, locations..."
            type="search"
            className="w-full bg-transparent outline-none placeholder:text-slate-500 text-sm"
          />
        </label>

        <button
          type="button"
          aria-pressed={onlyVerified}
          onClick={() => setOnlyVerified((s) => !s)}
          className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 ${
            onlyVerified
              ? 'bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20'
              : 'border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <BadgeCheck className="h-4 w-4" /> Verified only
        </button>
      </div>

      {list.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No NGOs match your filter"
            description="Clear the search or verified-only filter to see all NGO partners."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQ('');
                  setOnlyVerified(false);
                }}
              >
                Reset NGO filters
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {list.map((n) => (
            <Card
              key={n.id}
              className="p-6 transition-all duration-300 hover:border-teal-300/30 hover:bg-slate-900/70"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal-400/20 to-cyan-500/10 text-teal-300 ring-1 ring-teal-400/30">
                    <Building className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="flex items-center gap-1.5 text-base font-extrabold text-white">
                      {n.verified ? <BadgeCheck className="h-4 w-4 shrink-0 text-teal-300" /> : null}{' '}
                      {n.name}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" /> {n.location}
                    </p>
                  </div>
                </div>
                {n.verified ? <Badge tone="emerald">Verified</Badge> : <Badge tone="amber">In review</Badge>}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-300">{n.mission}</p>

              <div
                className="mt-5 grid grid-cols-3 gap-2.5 text-center"
                role="list"
                aria-label={`${n.name} metrics`}
              >
                <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-3" role="listitem">
                  <p className="text-sm font-extrabold text-white">{formatUSD(n.totalRaised)}</p>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Raised</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-3" role="listitem">
                  <p className="text-sm font-extrabold text-teal-300">{n.transparencyScore}%</p>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Score</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-3" role="listitem">
                  <p className="text-sm font-extrabold text-white">{n.proofCount}</p>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Milestones</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-400">
                <span>{n.activeCampaigns} active campaigns</span>
                <span className="font-mono text-[11px] text-slate-400">
                  {n.proofCount} verification entries
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-3xl border border-teal-300/20 bg-gradient-to-r from-teal-400/10 via-emerald-400/[0.06] to-cyan-400/10 p-6 sm:p-8 backdrop-blur-md">
        <h3 className="text-lg font-extrabold text-white">Are you an NGO? Register on Midnight Preprod.</h3>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-300 leading-relaxed">
          Connect your Midnight Lace wallet and create transparent fundraising initiatives with verifiable on-chain campaign goals and balance tracking.
        </p>
        {applied ? (
          <p
            role="status"
            className="mt-4 rounded-2xl border border-emerald-300/25 bg-emerald-400/10 p-3.5 text-xs font-semibold text-emerald-200"
          >
            NGO interest registered for this session. Use the NGO Dashboard to create live campaigns on-chain.
          </p>
        ) : (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button
              className="px-5 py-2.5 font-bold"
              onClick={() => {
                setApplied(true);
                onApply?.();
              }}
            >
              Start NGO Application
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
