import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import {
  findDeployedContract,
  getPublicStates,
} from '@midnight-ntwrk/midnight-js-contracts';
import { ledger } from '../../../contract/managed/contract/index.js';

import { auraAidContract } from './auraAidContract.ts';
import { createAuraAidProviders } from './providers.ts';

export interface CreateCampaignParams {
  contractAddress: string;
  goalAmount: number;
}

export interface CreateCampaignResult {
  txId: string;
  blockHeight: number;
  status: string;
  contractAddress: string;
  goalAmount: number;
   campaignId: number;
}

export const TOKEN_DECIMALS = 1_000_000n;

function goalAmountToBaseUnits(amount: number): bigint {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Enter a campaign goal greater than zero.');
  }

  const scaled = Math.round(
    amount * Number(TOKEN_DECIMALS),
  );

  if (scaled <= 0) {
    throw new Error('Campaign goal is too small.');
  }

  return BigInt(scaled);
}

export async function createCampaign(
  api: ConnectedAPI,
  params: CreateCampaignParams,
): Promise<CreateCampaignResult> {
  const contractAddress = params.contractAddress.trim();

  if (!contractAddress) {
    throw new Error(
      'No AuraAid contract address is configured.',
    );
  }

  if (!api) {
    throw new Error(
      'Connect your Midnight wallet first.',
    );
  }

  const goalAmount = goalAmountToBaseUnits(
    params.goalAmount,
  );

  console.log(
    '[AURA CAMPAIGN] connecting to contract...',
  );

  const providers = await createAuraAidProviders(api);

  console.log(
    '[AURA CAMPAIGN] finding deployed contract...',
  );

  /*
   * AuraAid is currently stateless.
   *
   * The Compact contract has no witnesses/private-state
   * fields, so do NOT pass privateStateId or
   * initialPrivateState here.
   */
  const deployed = await findDeployedContract(
  providers,
  {
    compiledContract: auraAidContract,
    contractAddress,
  },
);

  console.log(
    '[AURA CAMPAIGN] deployed contract found',
  );

  console.log(
    '[AURA CAMPAIGN] calling createCampaign...',
  );

  console.log(
    '[AURA CAMPAIGN] goal base units:',
    goalAmount.toString(),
  );

  try {
    console.log(
      '[AURA CAMPAIGN] submitting createCampaign transaction...',
    );

    const finalized =
      await deployed.callTx.createCampaign(
        goalAmount,
      );

    console.log(
      '[AURA CAMPAIGN] transaction completed',
    );

    console.log(
      '[AURA CAMPAIGN] tx id:',
      finalized.public.txId,
    );

    console.log(
      '[AURA CAMPAIGN] block:',
      finalized.public.blockHeight,
    );

        let campaignId: number | null = null;

    for (let attempt = 0; attempt < 10; attempt += 1) {
      try {
        const states = await getPublicStates(
          providers.publicDataProvider,
          contractAddress,
        );

        const state = ledger(states.contractState.data as never);

        const count = Number(state.campaignCount);

        if (count >= 7) {
          campaignId = count;
          break;
        }
      } catch (stateError) {
        console.warn(
          '[AURA CAMPAIGN] waiting for public state:',
          stateError,
        );
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 2000),
      );
    }

    if (campaignId === null) {
      throw new Error(
        'Campaign transaction succeeded, but the new campaign ID is not available from the public ledger yet.',
      );
    }

    console.log(
      '[AURA CAMPAIGN] campaign ID:',
      campaignId,
    );

    return {
  txId: finalized.public.txId,
  blockHeight: finalized.public.blockHeight,
  status: finalized.public.status,
  contractAddress,
  goalAmount: params.goalAmount,
  campaignId,
};
  } catch (error) {
    console.error(
      '[AURA CAMPAIGN] createCampaign FAILED',
    );

    console.error(
      '[AURA CAMPAIGN] error:',
      error,
    );

    if (error instanceof Error) {
      console.error(
        '[AURA CAMPAIGN] message:',
        error.message,
      );

      console.error(
        '[AURA CAMPAIGN] stack:',
        error.stack,
      );
    }

    throw error;
  }
}
