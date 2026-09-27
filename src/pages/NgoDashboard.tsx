import { useEffect, useState } from 'react';
import { CreateCampaign } from '../components/campaigns/CreateCampaign.tsx';
import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import { formatUSD } from '../utils/format.ts';
import { Award, CheckCircle2, ExternalLink, Layers, PlusCircle, ShieldCheck } from 'lucide-react';
import { Button } from '../components/common/ui.tsx';

interface NgoDashboardProps {
  api: ConnectedAPI | null;
  contractAddress: string | null;
}

interface SavedCampaign {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  txId: string;
  createdAt: string;
}

const STORAGE_KEY = 'auraaid_campaigns';

export function NgoDashboard({
  api,
  contractAddress,
}: NgoDashboardProps) {
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [campaigns, setCampaigns] = useState<SavedCampaign[]>([]);

  const loadCampaigns = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setCampaigns([]);
      return;
    }

    try {
      const parsed: SavedCampaign[] = JSON.parse(saved);
      setCampaigns(parsed);
    } catch (error) {
      console.error('[NGO DASHBOARD] Failed to load campaigns:', error);
      setCampaigns([]);
    }
  };

  useEffect(() => {
    loadCampaigns();

    const handleCampaignCreated = () => {
      loadCampaigns();
    };

    window.addEventListener('auraaid-campaign-created', handleCampaignCreated);
    return () => {
      window.removeEventListener('auraaid-campaign-created', handleCampaignCreated);
    };
  }, []);

  const totalGoalAmount = campaigns.reduce((acc, c) => acc + (c.goalAmount || 0), 0);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">
            NGO Portal
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            NGO Campaign Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Create, manage, and verify on-chain fundraising initiatives registered on the Midnight Preprod smart contract.
          </p>
        </div>

        <Button
          onClick={() => setShowCreateCampaign((current) => !current)}
          className="shadow-lg shadow-teal-500/10"
        >
          {showCreateCampaign ? (
            'Close Form'
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Create Campaign
            </>
          )}
        </Button>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Created Campaigns</span>
            <Layers className="h-4 w-4 text-teal-300" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">{campaigns.length}</p>
          <p className="mt-1 text-xs text-slate-400">Registered on Midnight</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Total Target Goal</span>
            <Award className="h-4 w-4 text-emerald-300" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">
            {formatUSD(totalGoalAmount)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Across active initiatives</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Network Status</span>
            <ShieldCheck className="h-4 w-4 text-cyan-300" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">Preprod</p>
          <p className="mt-1 text-xs text-slate-400">Compact Circuit Active</p>
        </div>
      </div>

      {/* CREATE CAMPAIGN FORM */}
      {showCreateCampaign ? (
        <div className="mt-8">
          <CreateCampaign api={api} contractAddress={contractAddress} />
        </div>
      ) : null}

      {/* MY CAMPAIGNS */}
      <div className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white">Registered Campaigns</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Campaigns deployed and indexed from the Midnight Preprod ledger.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {campaigns.length} {campaigns.length === 1 ? 'campaign' : 'campaigns'}
          </span>
        </div>

        {campaigns.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/30 p-12 text-center">
            <p className="text-base font-bold text-white">No campaigns created yet</p>
            <p className="mt-1.5 text-sm text-slate-400 max-w-sm mx-auto">
              Click &quot;Create Campaign&quot; above to submit an on-chain registration transaction to the AuraAid smart contract.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md transition hover:border-teal-300/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                      On-Chain Initiative
                    </span>
                    <h3 className="mt-1 text-xl font-extrabold text-white">{campaign.title}</h3>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Active
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-300 line-clamp-2">
                  {campaign.description}
                </p>

                <div className="mt-4 rounded-2xl border border-white/5 bg-slate-950/60 p-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Fundraising Target
                  </span>
                  <p className="mt-1 text-xl font-extrabold text-white">
                    {formatUSD(campaign.goalAmount)}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-400">
                  <span className="font-mono truncate max-w-[200px]">
                    tx: {campaign.txId.slice(0, 14)}…
                  </span>
                  <a
                    href={`https://preprod.midnightexplorer.com/tx/${campaign.txId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-teal-300 hover:text-teal-200"
                  >
                    <span>Explorer</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}