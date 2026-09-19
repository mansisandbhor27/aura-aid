import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { DemoDonationReceipt } from '../types/index.ts';

interface DemoStore {
  receipts: DemoDonationReceipt[];
  addReceipt: (r: DemoDonationReceipt) => void;
  clear: () => void;
}

const Ctx = createContext<DemoStore | null>(null);

export function DemoDonationProvider({ children }: { children: ReactNode }) {
  const [receipts, setReceipts] = useState<DemoDonationReceipt[]>([]);
  const addReceipt = useCallback((r: DemoDonationReceipt) => {
    setReceipts((prev) => [r, ...prev].slice(0, 20));
  }, []);
  const clear = useCallback(() => setReceipts([]), []);
  const value = useMemo(() => ({ receipts, addReceipt, clear }), [receipts, addReceipt, clear]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemoDonations(): DemoStore {
  const ctx = useContext(Ctx);
  if (!ctx) return { receipts: [], addReceipt: () => undefined, clear: () => undefined };
  return ctx;
}
