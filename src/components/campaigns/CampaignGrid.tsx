import { useMemo, useState } from 'react';
import { ArrowUpDown, Search, SearchX } from 'lucide-react';
import type { Campaign, CampaignCategory } from '../../types/index.ts';
import { CampaignCard } from './CampaignCard.tsx';
import { Button, CardSkeleton, EmptyState, SectionHeading } from '../common/ui.tsx';

const filters: Array<{ id: CampaignCategory | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'water', label: 'Water' },
  { id: 'education', label: 'Education' },
  { id: 'health', label: 'Health' },
  { id: 'climate', label: 'Climate' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'livelihood', label: 'Livelihood' },
];

type SortKey = 'recommended' | 'most-funded' | 'most-donors' | 'ending-soon';


export function CampaignGrid({ campaigns, onDonate, onSelect, loading = false }: {
  campaigns: Campaign[]; onDonate: (c: Campaign) => void; onSelect: (c: Campaign) => void; loading?: boolean;
}) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<CampaignCategory | 'all'>('all');
  const [sort, setSort] = useState<SortKey>('recommended');
  const [status, setStatus] = useState<'all' | Campaign['status']>('all');
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = campaigns.filter((c) => {
      const hitCat = cat === 'all' || c.category === cat;
      const hitStatus = status === 'all' || c.status === status;
      const hitQ = !needle || `${c.title} ${c.ngoName} ${c.location} ${c.tags.join(' ')}`.toLowerCase().includes(needle);
      return hitCat && hitStatus && hitQ;
    });
    const sorted = [...filtered];
    if (sort === 'most-funded') sorted.sort((a, b) => b.raisedAmount / b.goalAmount - a.raisedAmount / a.goalAmount);
    if (sort === 'most-donors') sorted.sort((a, b) => b.donorCount - a.donorCount);
    if (sort === 'ending-soon') sorted.sort((a, b) => a.deadlineDaysLeft - b.deadlineDaysLeft);
    return sorted;
  }, [campaigns, q, cat, sort, status]);
  const reset = () => { setQ(''); setCat('all'); setStatus('all'); setSort('recommended'); };

  return (
    <section aria-labelledby="campaigns-heading" className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div id="campaigns-heading">
          <SectionHeading eyebrow="Campaigns" title="Verified, milestone-gated giving" description="Funds unlock only when independent proofs are published. Donor identities stay shielded." />
        </div>
        <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
          <label className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-slate-300 focus-within:border-teal-300/60">
            <Search className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
            <span className="sr-only">Search campaigns</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search campaigns, NGOs, places..." className="w-full bg-transparent outline-none placeholder:text-slate-500" type="search" />
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-slate-300">
            <ArrowUpDown className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
            <span className="sr-only">Sort campaigns</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="bg-transparent text-sm font-semibold outline-none [&>option]:bg-slate-900" aria-label="Sort campaigns">
              <option value="recommended">Recommended</option>
              <option value="most-funded">Most funded</option>
              <option value="most-donors">Most donors</option>
              <option value="ending-soon">Ending soon</option>
            </select>
          </label>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
        {filters.map((f) => (
          <button key={f.id} type="button" onClick={() => setCat(f.id)} aria-pressed={cat === f.id} className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 ${cat === f.id ? 'bg-teal-400 text-slate-950' : 'border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10'}`}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {(['all', 'active', 'closing-soon', 'funded'] as const).map((s) => (
          <button key={s} type="button" onClick={() => setStatus(s)} aria-pressed={status === s} className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 ${status === s ? 'bg-white text-slate-950' : 'border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
            {s === 'all' ? 'Any status' : s === 'closing-soon' ? 'Closing soon' : s[0].toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      <p className="mt-4 text-xs font-semibold text-slate-500" role="status" aria-live="polite">Showing {list.length} of {campaigns.length} campaigns{q.trim() ? ` for “${q.trim()}”` : ''}</p>
      {loading ? (
        <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading campaigns" role="status">
          {[0, 1, 2, 3, 4, 5].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : list.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No campaigns match those filters" description="Try a different keyword, category or status. New verified campaigns appear as NGO proofs are accepted." action={<Button variant="secondary" onClick={reset}><SearchX className="h-4 w-4" /> Clear search and filters</Button>} />
        </div>
      ) : (
        <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <article key={c.id} onClick={() => onSelect(c)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(c); } }} role="button" tabIndex={0} aria-label={`View details for ${c.title}`} className="cursor-pointer rounded-2xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300">
              <CampaignCard campaign={c} onDonate={onDonate} />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

