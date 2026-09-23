import { useEffect, useState } from 'react';

import { CreateCampaign } from '../components/campaigns/CreateCampaign.tsx';

import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';

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
  const [showCreateCampaign, setShowCreateCampaign] =
    useState(false);

  const [campaigns, setCampaigns] =
    useState<SavedCampaign[]>([]);

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
      console.error(
        '[NGO DASHBOARD] Failed to load campaigns:',
        error,
      );

      setCampaigns([]);
    }
  };

  useEffect(() => {
    loadCampaigns();

    const handleCampaignCreated = () => {
      loadCampaigns();
    };

    window.addEventListener(
      'auraaid-campaign-created',
      handleCampaignCreated,
    );

    return () => {
      window.removeEventListener(
        'auraaid-campaign-created',
        handleCampaignCreated,
      );
    };
  }, []);

  const totalRaised = 0;

  const activeCampaigns = campaigns.length;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">

      {/* HEADER */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">
          NGO
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-white">
          NGO Dashboard
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Create and manage fundraising campaigns on AuraAid.
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm text-slate-400">
            My Campaigns
          </p>

          <p className="mt-2 text-3xl font-extrabold text-white">
            {campaigns.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm text-slate-400">
            Total Raised
          </p>

          <p className="mt-2 text-3xl font-extrabold text-white">
            {totalRaised}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm text-slate-400">
            Active Campaigns
          </p>

          <p className="mt-2 text-3xl font-extrabold text-white">
            {activeCampaigns}
          </p>
        </div>

      </div>

      {/* CAMPAIGN MANAGEMENT */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-xl font-bold text-white">
              Campaign Management
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Create a fundraising campaign for your NGO.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowCreateCampaign((current) => !current)
            }
            className="rounded-xl bg-teal-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-teal-300"
          >
            {showCreateCampaign
              ? 'Close'
              : '+ Create Campaign'}
          </button>

        </div>

      </div>

      {/* CREATE CAMPAIGN FORM */}
      {showCreateCampaign ? (
        <div className="mt-6">
          <CreateCampaign
            api={api}
            contractAddress={contractAddress}
          />
        </div>
      ) : null}

      {/* MY CAMPAIGNS */}
      <div className="mt-8">

        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">
            My Campaigns
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Campaigns created by your NGO will appear here.
          </p>
        </div>

        {campaigns.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">

            <p className="text-sm font-semibold text-slate-300">
              No campaigns created yet
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Create your first campaign and it will appear here.
            </p>

          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">

            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
              >

                {/* TITLE */}
                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-teal-300">
                      Campaign
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-white">
                      {campaign.title}
                    </h3>
                  </div>

                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                    Active
                  </span>

                </div>

                {/* DESCRIPTION */}
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  {campaign.description}
                </p>

                {/* GOAL */}
                <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/60 p-4">

                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Fundraising Goal
                  </p>

                  <p className="mt-1 text-2xl font-extrabold text-white">
                    {campaign.goalAmount}
                  </p>

                </div>

                {/* TX */}
                <div className="mt-4">

                  <p className="text-xs font-semibold text-slate-500">
                    Transaction ID
                  </p>

                  <p className="mt-1 break-all font-mono text-[11px] text-slate-400">
                    {campaign.txId}
                  </p>

                </div>

                {/* DATE */}
                <p className="mt-4 text-xs text-slate-600">
                  Created{' '}
                  {new Date(
                    campaign.createdAt,
                  ).toLocaleString()}
                </p>

              </div>
            ))}

          </div>
        )}

      </div>

    </section>
  );
}