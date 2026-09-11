import { describe, expect, it } from 'vitest';
import { parseAmountInput, progressPercent, shortReceiptId, validateDonation } from '../src/utils/format.ts';

const shielded = { amount: 50, privacyMode: 'shielded' as const, shieldIdentity: true, shieldAmount: true, donorLabel: '', note: '' };

describe('donation validation', () => {
  it('rejects amounts below $1', () => {
    expect(validateDonation({ ...shielded, amount: 0 }).ok).toBe(false);
    expect(validateDonation({ ...shielded, amount: Number.NaN }).ok).toBe(false);
  });
  it('requires display name for public donations', () => {
    const bad = validateDonation({ ...shielded, privacyMode: 'public', donorLabel: '' });
    const good = validateDonation({ ...shielded, privacyMode: 'public', shieldAmount: false, donorLabel: 'Priya' });
    expect(bad.ok).toBe(false);
    expect(good.ok).toBe(true);
  });
  it('parses amounts and computes progress', () => {
    expect(parseAmountInput('$120.50')).toBeCloseTo(120.5);
    expect(progressPercent(50, 100)).toBe(50);
    expect(progressPercent(10, 0)).toBe(0);
    expect(shortReceiptId('cmp-demo').startsWith('DEMO-')).toBe(true);
  });
});
