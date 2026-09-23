import { useState } from 'react';
import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';

import { createCampaign } from '../../services/midnight/createCampaign.ts';

interface CreateCampaignProps {
  api: ConnectedAPI | null;
  contractAddress: string | null;
}

interface SavedCampaign {
  id: string;
  campaignId: number;
  title: string;
  description: string;
  goalAmount: number;
  txId: string;
  createdAt: string;
}

const STORAGE_KEY = 'auraaid_campaigns';

export function CreateCampaign({
  api,
  contractAddress,
}: CreateCampaignProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [txId, setTxId] = useState<string | null>(null);

  const handleCreate = async () => {
    setMessage('');
    setTxId(null);

    if (!title.trim()) {
      setMessage('Enter a campaign title.');
      return;
    }

    if (!description.trim()) {
      setMessage('Enter a short campaign description.');
      return;
    }

    if (!api) {
      setMessage('Connect your Midnight wallet first.');
      return;
    }

    if (!contractAddress) {
      setMessage('AuraAid contract address is not configured.');
      return;
    }

    const goalAmount = Number(goal);

    if (!Number.isFinite(goalAmount) || goalAmount <= 0) {
      setMessage('Enter a campaign goal greater than zero.');
      return;
    }

    try {
      setLoading(true);
      setMessage('Creating campaign on Midnight...');

      const result = await createCampaign(api, {
        contractAddress,
        goalAmount,
      });

      const newCampaign: SavedCampaign = {
  id: crypto.randomUUID(),
  campaignId: result.campaignId,
        title: title.trim(),
        description: description.trim(),
        goalAmount: result.goalAmount,
        txId: result.txId,
        createdAt: new Date().toISOString(),
      };

      const existingRaw = localStorage.getItem(STORAGE_KEY);

      let existingCampaigns: SavedCampaign[] = [];

      if (existingRaw) {
        try {
          existingCampaigns = JSON.parse(existingRaw);
        } catch {
          existingCampaigns = [];
        }
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([
          newCampaign,
          ...existingCampaigns,
        ]),
      );

      window.dispatchEvent(
        new CustomEvent('auraaid-campaign-created'),
      );

      setTxId(result.txId);

      setMessage(
        `Campaign "${newCampaign.title}" created successfully.`,
      );

      setTitle('');
      setDescription('');
      setGoal('');
    } catch (error) {
      console.error('[CREATE CAMPAIGN UI] error:', error);

      setMessage(
        error instanceof Error
          ? error.message
          : 'Failed to create campaign.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">

        {/* HEADER */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">
            NGO
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-white">
            Create Campaign
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Create a fundraising campaign for your NGO.
          </p>
        </div>

        {/* TITLE */}
        <div className="mt-5">
          <label
            htmlFor="campaign-title"
            className="text-sm font-semibold text-slate-300"
          >
            Campaign Title
          </label>

          <input
            id="campaign-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Example: Help Flood Victims"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-teal-300"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mt-4">
          <label
            htmlFor="campaign-description"
            className="text-sm font-semibold text-slate-300"
          >
            Short Description
          </label>

          <textarea
            id="campaign-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Briefly explain what this campaign is for..."
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-teal-300"
          />
        </div>

        {/* GOAL */}
        <div className="mt-4">
          <label
            htmlFor="campaign-goal"
            className="text-sm font-semibold text-slate-300"
          >
            Fundraising Goal
          </label>

          <input
            id="campaign-goal"
            type="number"
            min="0"
            step="0.01"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Enter goal amount"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-teal-300"
          />
        </div>

        {/* BUTTON */}
        <button
          type="button"
          onClick={handleCreate}
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-teal-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Creating Campaign...' : 'Create Campaign'}
        </button>

        {/* MESSAGE */}
        {message ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-slate-950 p-4 text-sm text-slate-300">
            {message}
          </div>
        ) : null}

        {/* TRANSACTION */}
        {txId ? (
          <div className="mt-4 rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Transaction ID
            </p>

            <p className="mt-2 break-all font-mono text-xs text-slate-300">
              {txId}
            </p>
          </div>
        ) : null}

      </div>
    </section>
  );
}