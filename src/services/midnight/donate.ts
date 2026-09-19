import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import {
  findDeployedContract,
  getPublicStates,
} from '@midnight-ntwrk/midnight-js-contracts';

import { auraAidContract } from './auraAidContract.ts';
import { createAuraAidProviders, type AuraAidProviders } from './providers.ts';
import { ledger } from '../../../contract/managed/contract/index.js';

/**
 * NIGHT uses 6 decimal places.
 * Example: 1 NIGHT = 1_000_000 base units.
 */
export const TOKEN_DECIMALS = 1_000_000n;

export type DonationStage =
  | 'validating'
  | 'reading-balance'
  | 'locating-contract'
  | 'proving'
  | 'finalizing';

export interface DonationProgress {
  stage: DonationStage;
  message: string;
}

export interface DonateParams {
  contractAddress: string;
  ledgerCampaignId: number;
  amount: number;
  onProgress?: (progress: DonationProgress) => void;
}

export interface DonateResult {
  txId: string;
  blockHeight: number;
  status: string;
  contractAddress: string;
  ledgerCampaignId: number;
  tokenType: string;
  baseUnits: bigint;
}

/** Convert a whole-token donation amount to on-chain base units. */
export function donationAmountToBaseUnits(amount: number): bigint {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Enter a donation amount greater than zero.');
  }

  const scaled = Math.round(amount * Number(TOKEN_DECIMALS));

  if (!Number.isFinite(scaled) || scaled <= 0) {
    throw new Error('The donation amount is too small to represent on-chain.');
  }

  return BigInt(scaled);
}

/**
 * Best-effort on-chain check that the campaign exists.
 */
async function campaignExistsOnChain(
  providers: AuraAidProviders,
  contractAddress: string,
  campaignId: bigint,
): Promise<boolean | null> {
  try {
    const states = await getPublicStates(
      providers.publicDataProvider,
      contractAddress,
    );

    const state = ledger(states.contractState.data as never);

    return state.campaigns.member(campaignId);
  } catch {
    return null;
  }
}

function report(
  params: DonateParams,
  stage: DonationStage,
  message: string,
): void {
  params.onProgress?.({ stage, message });
}

/**
 * Submit a donation using the unshielded/native NIGHT flow.
 *
 * The contract circuit receives only the donation amount.
 * The wallet/provider is responsible for balancing the unshielded
 * NIGHT transaction and paying the required fees.
 */
export async function donateToCampaign(
  api: ConnectedAPI,
  params: DonateParams,
): Promise<DonateResult> {
  const contractAddress = params.contractAddress.trim();

  if (!contractAddress) {
    throw new Error('No AuraAid contract address is configured.');
  }

  if (!api) {
    throw new Error('Connect a Midnight wallet before donating.');
  }

  if (
    !Number.isInteger(params.ledgerCampaignId) ||
    params.ledgerCampaignId <= 0
  ) {
    throw new Error(
      'This campaign is not linked to an on-chain campaign id, so it cannot receive real donations.',
    );
  }

  report(params, 'validating', 'Validating donation details...');

  const baseUnits = donationAmountToBaseUnits(params.amount);

  report(
    params,
    'reading-balance',
    'Preparing your unshielded NIGHT donation...',
  );

  /*
   * The actual native/unshielded balance is handled by the connected
   * wallet during transaction balancing. We deliberately do not call
   * getShieldedBalances() here.
   */

  report(
    params,
    'locating-contract',
    'Connecting to the deployed AuraAid contract...',
  );

  const providers = await createAuraAidProviders(api);

  const deployed = await findDeployedContract(providers, {
    compiledContract: auraAidContract,
    contractAddress,
  });

  const ledgerCampaignId = BigInt(params.ledgerCampaignId);

  const exists = await campaignExistsOnChain(
    providers,
    contractAddress,
    ledgerCampaignId,
  );

  if (exists === false) {
    throw new Error(
      `Campaign #${params.ledgerCampaignId} does not exist on the AuraAid contract at ${contractAddress}. No donation was submitted.`,
    );
  }

  report(
    params,
    'proving',
    'Generating the ZK proof and waiting for wallet authorization...',
  );

  /*
   * The Compact circuit now expects:
   *
   * donate(campaignId, amount)
   *
   * The wallet/provider performs the unshielded transaction balancing.
   */
  const finalized = await deployed.callTx.donate(
    ledgerCampaignId,
    baseUnits,
  );

  report(
    params,
    'finalizing',
    'Transaction submitted. Waiting for finalization...',
  );

  return {
    txId: finalized.public.txId,
    blockHeight: finalized.public.blockHeight,
    status: finalized.public.status,
    contractAddress,
    ledgerCampaignId: params.ledgerCampaignId,

    // Native NIGHT is unshielded in this flow.
    tokenType: 'NIGHT',
    baseUnits,
  };
}
