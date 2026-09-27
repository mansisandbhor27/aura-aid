import { useState } from 'react';
import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import { createCampaign } from '../../services/midnight/createCampaign.ts';
import { Button } from '../common/ui.tsx';
import { ExternalLink, Layers, ShieldCheck } from 'lucide-react';

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
      setMessage('Connect your Midnight Lace wallet first.');
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
      setMessage('Generating client-side ZK proof and submitting createCampaign circuit...');

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
        JSON.stringify([newCampaign, ...existingCampaigns]),
      );

      window.dispatchEvent(
        new CustomEvent('auraaid-campaign-created'),
      );

      setTxId(result.txId);
      setMessage(
        `Campaign #${result.campaignId} ("${newCampaign.title}") registered on Midnight Preprod!`,
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
    <section className="mx-auto max-w-5xl">
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        {/* HEADER */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-300">
            <ShieldCheck className="h-4 w-4" />
            <span>On-Chain Registration</span>
          </div>

          <h2 className="mt-2 text-2xl font-extrabold text-white">
            Register New Fundraising Campaign
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Submits a zero-knowledge circuit transaction to register the campaign goal on the Midnight Preprod ledger.
          </p>
        </div>

        {/* TITLE */}
        <div className="mt-6">
          <label
            htmlFor="campaign-title"
            className="text-xs font-bold uppercase tracking-wider text-slate-300"
          >
            Campaign Title
          </label>
          <input
            id="campaign-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Solar Microgrids for Rural Clinics"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-teal-300"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mt-4">
          <label
            htmlFor="campaign-description"
            className="text-xs font-bold uppercase tracking-wider text-slate-300"
          >
            Campaign Summary & Deliverables
          </label>
          <textarea
            id="campaign-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe the initiative impact, target community, and milestone deliverables..."
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-teal-300"
          />
        </div>

        {/* GOAL */}
        <div className="mt-4">
          <label
            htmlFor="campaign-goal"
            className="text-xs font-bold uppercase tracking-wider text-slate-300"
          >
            Target Fundraising Goal (USD / NIGHT equivalent)
          </label>
          <input
            id="campaign-goal"
            type="number"
            min="1"
            step="1"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. 50000"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-teal-300"
          />
        </div>

        {/* BUTTON */}
        <div className="mt-6">
          <Button
            onClick={handleCreate}
            disabled={loading}
            className="w-full justify-center py-3 text-sm font-bold shadow-lg shadow-teal-500/10"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Layers className="h-4 w-4 animate-spin" />
                Submitting createCampaign Proof...
              </span>
            ) : (
              'Create Campaign On-Chain'
            )}
          </Button>
        </div>

        {/* MESSAGE */}
        {message ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/80 p-4 text-xs font-medium text-slate-300 leading-relaxed">
            {message}
          </div>
        ) : null}

        {/* TRANSACTION */}
        {txId ? (
          <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                On-Chain Transaction Confirmed
              </p>
              <a
                href={`https://preprod.midnightexplorer.com/tx/${txId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-teal-300 hover:text-teal-200"
              >
                <span>View on Explorer</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <p className="mt-2 break-all font-mono text-xs text-white">
              {txId}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}