import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { Campaign, CampaignCategory } from '../../types/index.ts';
import { CampaignCard } from './CampaignCard.tsx';
import { SectionHeading } from '../common/ui.tsx';

const filters: Array<{ id: CampaignCategory | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'water', label: 'Water' },
  { id: 'education', label: 'Education' },
  { id: 'health', label: 'Health' },
  { id: 'climate', label: 'Climate' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'livelihood', label: 'Livelihood' },
];

export function CampaignGrid({ campaigns, onDonate, onSelect }: {
  campaigns: Campaign[]; onDonate: (c: Campaign) => void; onSelect: (c: Campaign) => void;
}) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<CampaignCategory | 'all'>('all');
  const list = useMemo(() => {
    return campaigns.filter((c) => {
      const hitCat = cat === 'all' || c.category === cat;
      const needle = q.trim().toLowerCase();
      const hitQ = !needle || `${c.title} ${c.ngoName} ${c.location}`.toLowerCase().includes(needle);
      return hitCat && hitQ;
    });
  }, [campaigns, q, cat]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading eyebrow="Campaigns" title="Verified, milestone-gated giving" description="Funds unlock only when independent proofs are published. Donor identities stay shielded." />
        <label className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-slate-300">
          <Search className="h-4 w-4 shrink-0 text-slate-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search campaigns, NGOs, places..." className="w-full bg-transparent outline-none placeholder:text-slate-500" />
        </label>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f.id} type="button" onClick={() => setCat(f.id)} className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${cat === f.id ? 'bg-teal-400 text-slate-950' : 'border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10'}`}>
            {f.label}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-slate-400">No campaigns match. Try another search or category.</p>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <article
              key={c.id}
              onClick={() => onSelect(c)}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelect(c); }}
              role="button"
              tabIndex={0}
              aria-label={`View ${c.title}`}
              className="cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
            >
              <CampaignCard campaign={c} onDonate={onDonate} />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

