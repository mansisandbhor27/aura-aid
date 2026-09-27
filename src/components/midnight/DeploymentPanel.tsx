import { useState } from 'react';
import type { MidnightConnectionState } from '../../types/index.ts';
import { ExternalLink, Layers, ShieldCheck } from 'lucide-react';
import { Button } from '../common/ui.tsx';

interface DeploymentPanelProps {
  connection: MidnightConnectionState;
  deploying: boolean;
  contractAddress: string | null;
  deploymentTxId: string | null;
  onDeploy: () => Promise<unknown>;
}

export function DeploymentPanel({
  connection,
  deploying,
  contractAddress,
  deploymentTxId,
  onDeploy,
}: DeploymentPanelProps) {
  const [error, setError] = useState<string | null>(null);

  const connected = Boolean(connection.walletAddress);

  const handleDeploy = async () => {
    setError(null);

    try {
      await onDeploy();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Deployment failed.',
      );
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 pb-12">
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-300">
            <ShieldCheck className="h-4 w-4" />
            <span>Midnight Preprod Contract Manager</span>
          </div>

          <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
            AuraAid Contract Deployment & Verification
          </h2>

          <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-2xl">
            Manage the deployed Compact contract instance on the Midnight Preprod network. The contract maintains on-chain campaign registrations and transparent balance maps.
          </p>
        </div>

        <div className="mb-6 grid gap-3.5 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Network</p>
            <p className="mt-1 font-semibold text-teal-300">
              {connection.network.toUpperCase()}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Connected Wallet</p>
            <p className="mt-1 break-all font-mono text-xs text-slate-300">
              {connection.walletAddress ?? 'Not connected (Connect Lace wallet)'}
            </p>
          </div>
        </div>

        {!connected ? (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-xs font-semibold text-amber-200">
            Connect your Midnight Lace browser extension wallet to deploy or interact with contracts.
          </div>
        ) : (
          <Button
            onClick={handleDeploy}
            disabled={deploying}
            className="px-6 py-3 font-bold"
          >
            {deploying ? (
              <span className="flex items-center gap-2">
                <Layers className="h-4 w-4 animate-spin" />
                Deploying AuraAid Contract...
              </span>
            ) : (
              'Deploy Fresh AuraAid Contract'
            )}
          </Button>
        )}

        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Status</p>
          <p className="mt-1 text-xs text-slate-300">
            {connection.message}
          </p>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-xs text-red-300 font-mono">
            {error}
          </div>
        ) : null}

        {contractAddress ? (
          <div className="mt-6 space-y-3.5 pt-4 border-t border-white/10">
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Active Deployed Contract
                </p>
                <a
                  href={`https://preprod.midnightexplorer.com/contract/${contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-teal-300 hover:text-teal-200"
                >
                  <span>View on Explorer</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <p className="mt-2 break-all font-mono text-xs font-bold text-white">
                {contractAddress}
              </p>
            </div>

            {deploymentTxId ? (
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Deployment Transaction ID
                </p>
                <a
                  href={`https://preprod.midnightexplorer.com/tx/${deploymentTxId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 font-mono text-xs text-teal-300 hover:text-teal-200"
                >
                  <span className="break-all">{deploymentTxId}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
