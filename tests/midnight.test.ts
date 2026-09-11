import { describe, expect, it } from 'vitest';
import { buildDonationPreview, createDemoReceipt, getIntegrationChecklist } from '../src/services/midnight/midnightService.ts';
import { campaigns } from '../src/data/mockData.ts';

const connection = { status: 'disconnected' as const, network: 'demo', blockHeight: null, walletAddress: null, lastProofHash: null, message: 'demo' };
const form = { amount: 75, privacyMode: 'shielded' as const, shieldIdentity: true, shieldAmount: true, donorLabel: '', note: '' };

describe('midnight demo service', () => {
  it('builds a demo-only preview', () => {
    const preview = buildDonationPreview({ campaignId: 'cmp-x', ...form }, connection);
    expect(preview.ok).toBe(true);
    expect(preview.warning.toLowerCase()).toContain('does not create a blockchain transaction');
  });
  it('creates a local demo receipt', () => {
    const receipt = createDemoReceipt(campaigns[0], form);
    expect(receipt.demo).toBe(true);
    expect(receipt.receiptId.startsWith('DEMO-')).toBe(true);
  });
  it('exposes integration checklist', () => {
    expect(getIntegrationChecklist().length).toBeGreaterThan(0);
  });
});
