import { useState } from 'react';

import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';

import { createCampaign } from '../../services/midnight/createCampaign.ts';

interface CreateCampaignProps {
  api: ConnectedAPI | null;
  contractAddress: string | null;
}

export function CreateCampaign({
  api,
  contractAddress,
}: CreateCampaignProps) {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [txId, setTxId] = useState<string | null>(null);

  const handleCreate = async () => {
    setMessage('');
    setTxId(null);

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

      setTxId(result.txId);

      setMessage(
        `Campaign created successfully. Campaign goal: ${result.goalAmount}`,
      );

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
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">
          NGO
        </p>

        <h2 className="mt-2 text-2xl font-extrabold text-white">
          Create Campaign
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Create a real campaign on the AuraAid Midnight contract.
        </p>

        <div className="mt-5">
          <label className="text-sm font-semibold text-slate-300">
            Campaign Goal
          </label>

          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter goal amount"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-teal-300"
          />
        </div>

        <button
          type="button"
          onClick={handleCreate}
          disabled={loading}
          className="mt-5 rounded-xl bg-teal-400 px-5 py-3 font-bold text-slate-950 hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Creating Campaign...' : 'Create Campaign'}
        </button>

        {message ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-slate-950 p-4 text-sm text-slate-300">
            {message}
          </div>
        ) : null}

        {txId ? (
          <div className="mt-4 rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4">
            <p className="text-xs font-semibold uppercase text-emerald-400">
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
