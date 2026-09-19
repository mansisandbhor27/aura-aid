import { useCallback, useRef, useState } from 'react';
import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import type { MidnightConnectionState } from '../../types/index.ts';
import {
  connectWallet,
  disconnectWallet,
  type RealState,
} from './wallet.ts';
import { deployAuraAidContract } from './deploy.ts';

const INITIAL_STATE: MidnightConnectionState = {
  status: 'disconnected',
  network: 'Midnight Preprod',
  blockHeight: null,
  walletAddress: null,
  lastProofHash: null,
  message: 'Wallet not connected.',
};

function toConnectionState(
  realState: RealState,
  message: string,
  status: MidnightConnectionState['status'],
): MidnightConnectionState {
  return {
    status,
    network:
      realState.networkId === 'preprod'
        ? 'Midnight Preprod'
        : 'Midnight',
    blockHeight: null,
    walletAddress: realState.unshieldedAddress,
    lastProofHash: null,
    message,
  };
}

export function useMidnightConnection() {
  const [state, setState] =
    useState<MidnightConnectionState>(INITIAL_STATE);

  const [api, setApi] = useState<ConnectedAPI | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(() => {
    const envAddress = import.meta.env.VITE_AURA_AID_CONTRACT_ADDRESS;
    return envAddress && envAddress.trim() ? envAddress.trim() : null;
  });
  const [deploymentTxId, setDeploymentTxId] = useState<string | null>(null);
  const [deploying, setDeploying] = useState(false);

  const connecting = useRef(false);

  const connect = useCallback(async () => {
    if (connecting.current) return;

    connecting.current = true;

    setState((current) => ({
      ...current,
      status: 'connecting',
      message: 'Connecting to Midnight wallet...',
    }));

    try {
      const result = await connectWallet();

      if (!result.ok) {
        setApi(null);

        setState(
          toConnectionState(
            result.state,
            result.message,
            'disconnected',
          ),
        );

        return;
      }

      setApi(result.state.api);

      setState(
        toConnectionState(
          result.state,
          result.message,
          'proof-ready',
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Wallet connection failed.';

      setApi(null);

      setState({
        ...INITIAL_STATE,
        message,
      });
    } finally {
      connecting.current = false;
    }
  }, []);

  const disconnect = useCallback(() => {
    disconnectWallet();
    connecting.current = false;

    setApi(null);
    setContractAddress(null);
    setDeploymentTxId(null);
    setDeploying(false);

    setState(INITIAL_STATE);
  }, []);

  const deploy = useCallback(async () => {
    if (!api) {
      throw new Error('Connect a Midnight wallet before deploying.');
    }

    if (deploying) return;

    setDeploying(true);

    setState((current) => ({
      ...current,
      message: 'Preparing AuraAid contract deployment...',
    }));

    try {
      const result = await deployAuraAidContract(api);

      setContractAddress(result.contractAddress);
      setDeploymentTxId(result.transactionId);

      setState((current) => ({
        ...current,
        status: 'connected',
        message: 'AuraAid contract deployed successfully on Midnight Preprod.',
      }));

      return result;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'AuraAid contract deployment failed.';

      setState((current) => ({
        ...current,
        status: 'error',
        message,
      }));

      throw error;
    } finally {
      setDeploying(false);
    }
  }, [api, deploying]);

  return {
    connection: state,
    api,
    simulateConnect: connect,
    simulateDisconnect: disconnect,
    deploy,
    deploying,
    contractAddress,
    deploymentTxId,
  };
}
