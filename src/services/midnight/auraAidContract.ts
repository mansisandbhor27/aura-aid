import { CompiledContract } from '@midnight-ntwrk/compact-js';

import { Contract } from '../../../contract/managed/contract/index.js';

const COMPILED_CONTRACT_TAG = 'aura-aid';

const COMPILED_ASSETS_PATH = 'contract/managed';

export const auraAidContract = CompiledContract.make(
  COMPILED_CONTRACT_TAG,
  Contract,
).pipe(
  CompiledContract.withVacantWitnesses,
  CompiledContract.withCompiledFileAssets(COMPILED_ASSETS_PATH),
);