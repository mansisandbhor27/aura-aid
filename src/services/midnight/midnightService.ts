import type {
  Campaign,
  DemoDonationReceipt,
  DonationFormValues,
  MidnightConnectionState,
  PrivacySummary,
} from '../../types/index.ts';
import { shortReceiptId } from '../../utils/format.ts';

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

export type DonationPreviewInput =
  | DemoDonationIntent
  | (DonationFormValues & { campaignId: string });

function isFullForm(input: DonationPreviewInput): input is DonationFormValues & { campaignId: string } {
  return (input as DonationFormValues).privacyMode !== undefined;
}

export function buildDonationPreview(
  intent: DonationPreviewInput,
  _connection: MidnightConnectionState,
): DemoDonationPreview {
  const shieldIdentity = isFullForm(intent)
    ? intent.privacyMode === 'shielded' || intent.shieldIdentity
    : intent.shieldIdentity;
  const shieldAmount = isFullForm(intent)
    ? intent.privacyMode === 'shielded' && intent.shieldAmount
    : intent.shieldAmount;
  const privacy: PrivacySummary = {
    visibleToPublic: [
      'Campaign ID',
      shieldAmount ? 'Pooled donation total (no link to donor)' : 'Donation amount (public mode)',
      'Demo validity receipt hash (not a real ZK proof)',
    ],
    hiddenByShielding: [
      ...(shieldIdentity ? ['Donor wallet address', 'Donor identity'] : []),
      ...(shieldAmount ? ['Exact donation amount'] : []),
    ],
    verifiableWithoutReveal: [
      'Demo check that amount is within valid range',
      'Demo receipt that funds were allocated to campaign pool',
      'Auditor-selective disclosure envelope (demo format)',
    ],
  };

  return {
    ok: true,
    summary: `Demo preview for $${intent.amount} to ${intent.campaignId}. Not submitted on-chain.`,
    privacy,
    warning:
      'Demo mode: this preview does not create a blockchain transaction. Connect a real Midnight wallet + contract to enable on-chain donations.',
  };
}

export function createDemoReceipt(
  campaign: Campaign,
  values: DonationFormValues,
): DemoDonationReceipt {
  const shielded = values.privacyMode === 'shielded';
  return {
    receiptId: shortReceiptId(campaign.id),
    campaignId: campaign.id,
    campaignTitle: campaign.title,
    amount: values.amount,
    privacyMode: values.privacyMode,
    shieldIdentity: shielded || values.shieldIdentity,
    shieldAmount: shielded && values.shieldAmount,
    donorLabel: shielded ? null : values.donorLabel.trim() || null,
    proofHash: `demo-${Math.random().toString(16).slice(2, 6)}-${Date.now().toString(16).slice(-4)}`,
    createdAtLabel: new Date().toLocaleString(),
    demo: true,
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

