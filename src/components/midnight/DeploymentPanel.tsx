import { useState } from 'react';
import type { MidnightConnectionState } from '../../types/index.ts';

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
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Midnight Preprod
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            AuraAid Contract Deployment
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Deploy the real AuraAid Compact contract to Midnight Preprod.
          </p>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Network</p>
            <p className="mt-1 font-medium text-slate-200">
              {connection.network}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Wallet</p>
            <p className="mt-1 break-all font-mono text-xs text-slate-300">
              {connection.walletAddress ?? 'Not connected'}
            </p>
          </div>
        </div>

        {!connected ? (
          <div className="rounded-xl border border-amber-900/50 bg-amber-950/20 p-4 text-sm text-amber-300">
            Connect your Midnight-compatible wallet first.
          </div>
        ) : (
          <button
            type="button"
            onClick={handleDeploy}
            disabled={deploying}
            className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deploying ? 'Deploying AuraAid...' : 'Deploy AuraAid Contract'}
          </button>
        )}

        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs text-slate-500">Status</p>
          <p className="mt-1 text-sm text-slate-300">
            {connection.message}
          </p>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        {contractAddress ? (
          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Contract Deployed
              </p>

              <p className="mt-2 text-xs text-slate-400">
                Contract Address
              </p>

              <p className="mt-1 break-all font-mono text-xs text-slate-200">
                {contractAddress}
              </p>
            </div>

            {deploymentTxId ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs text-slate-500">
                  Deployment Transaction ID
                </p>

                <p className="mt-1 break-all font-mono text-xs text-slate-300">
                  {deploymentTxId}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
