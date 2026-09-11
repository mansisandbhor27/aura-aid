import type { MidnightConnectionState, PrivacySummary } from '../../types/index.ts';

/**
 * Placeholder Midnight service layer.
 * Keeps blockchain calls isolated so a real Compact contract +
 * dapp-connector integration can be dropped in later.
 *
 * IMPORTANT: none of these functions submit real on-chain transactions.
 * They return typed demo payloads for UI development only.
 */

export interface DemoDonationIntent {
  campaignId: string;
  amount: number;
  shieldIdentity: boolean;
  shieldAmount: boolean;
}

export interface DemoDonationPreview {
  ok: boolean;
  summary: string;
  privacy: PrivacySummary;
  warning: string;
}

export function buildDonationPreview(
  intent: DemoDonationIntent,
  _connection: MidnightConnectionState,
): DemoDonationPreview {
  const privacy: PrivacySummary = {
    visibleToPublic: [
      'Campaign ID',
      'Pooled donation total (no link to donor)',
      'Zero-knowledge validity proof hash',
    ],
    hiddenByShielding: [
      ...(intent.shieldIdentity ? ['Donor wallet address', 'Donor identity'] : []),
      ...(intent.shieldAmount ? ['Exact donation amount'] : []),
    ],
    verifiableWithoutReveal: [
      'Proof that amount is within valid range',
      'Proof that funds arrived in campaign pool',
      'Auditor-selective disclosure envelope',
    ],
  };

  return {
    ok: true,
    summary: `Demo preview for ${intent.amount} to ${intent.campaignId}. Not submitted on-chain.`,
    privacy,
    warning:
      'Demo mode: this preview does not create a blockchain transaction. Connect a real Midnight wallet + contract to enable on-chain donations.',
  };
}

export function getIntegrationChecklist(): string[] {
  return [
    'Add Midnight dapp-connector wallet flow in services/midnight/wallet.ts',
    'Deploy Compact donation-escrow contract and store address in .env',
    'Replace buildDonationPreview with real shielded-call builder',
    'Stream proofs + block height from Midnight indexer',
  ];
}
