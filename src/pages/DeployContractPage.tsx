import { DeploymentPanel } from '../components/midnight/DeploymentPanel.tsx';
import type { MidnightConnectionState } from '../types/index.ts';

interface DeployContractPageProps {
  connection: MidnightConnectionState;
  deploying: boolean;
  contractAddress: string | null;
  deploymentTxId: string | null;
  onDeploy: () => Promise<unknown>;
}

export function DeployContractPage({
  connection,
  deploying,
  contractAddress,
  deploymentTxId,
  onDeploy,
}: DeployContractPageProps) {
  return (
    <main className="min-h-screen bg-slate-950 pt-8">
      <DeploymentPanel
        connection={connection}
        deploying={deploying}
        contractAddress={contractAddress}
        deploymentTxId={deploymentTxId}
        onDeploy={onDeploy}
      />
    </main>
  );
}
