import { useCallback, useRef, useState } from 'react';
import type { MidnightConnectionState } from '../../types/index.ts';

/**
 * Modular Midnight connection hook.
 * UI-only simulation for the frontend foundation. Real wallet + proof
 * integration should replace `simulateConnect` / `simulateDisconnect`
 * inside `src/services/midnight/` without changing component APIs.
 */
const INITIAL_STATE: MidnightConnectionState = {
  status: 'disconnected',
  network: 'Midnight Preprod (preview)',
  blockHeight: null,
  walletAddress: null,
  lastProofHash: null,
  message: 'Wallet not connected. Demo mode shows verified UI states.',
};

export function useMidnightConnection() {
  const [state, setState] = useState<MidnightConnectionState>(INITIAL_STATE);
  const timer = useRef<number | null>(null);

  const clearTimer = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const simulateConnect = useCallback(() => {
    clearTimer();
    setState((s) => ({
      ...s,
      status: 'connecting',
      message: 'Requesting wallet access (demo simulation)...',
    }));
    timer.current = window.setTimeout(() => {
      setState({
        status: 'proof-ready',
        network: 'Midnight Preprod (preview)',
        blockHeight: 1842931,
        walletAddress: 'mn_shield-7x4k9q2m-demo-address',
        lastProofHash: 'zk:demo-9f2c-a41b',
        message: 'Demo connection ready. No real transaction was submitted.',
      });
    }, 1200);
  }, []);

  const simulateDisconnect = useCallback(() => {
    clearTimer();
    setState(INITIAL_STATE);
  }, []);

  return { connection: state, simulateConnect, simulateDisconnect };
}
