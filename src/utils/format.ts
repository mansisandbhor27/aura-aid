export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompact(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
}

export function progressPercent(raised: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
}

import type { DonationFormValues, DonationValidationResult } from '../types/index.ts';

export function truncateAddress(address: string, chars = 6): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function validateDonation(values: DonationFormValues): DonationValidationResult {
  const errors: DonationValidationResult['errors'] = {};
  if (!Number.isFinite(values.amount) || values.amount < 1) {
    errors.amount = 'Enter an amount of at least $1.';
  } else if (values.amount > 1000000) {
    errors.amount = 'Demo limit is $1,000,000 per donation.';
  }
  if (values.privacyMode === 'public' && values.donorLabel.trim().length < 2) {
    errors.donorLabel = 'Add a display name (2+ characters) for a public donation.';
  }
  return { ok: Object.keys(errors).length === 0, errors };
}

export function parseAmountInput(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, '');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export function shortReceiptId(seed = ''): string {
  const base = seed.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 4).padEnd(4, 'X');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DEMO-${base}-${rand}`;
}

