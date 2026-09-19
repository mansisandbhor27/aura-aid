import type {
  PrivateStateId,
  PrivateStateProvider,
} from '@midnight-ntwrk/midnight-js-types';
import type {
  ContractAddress,
  SigningKey,
} from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';

export class AuraAidPrivateStateProvider
  implements PrivateStateProvider<PrivateStateId, unknown>
{
  private readonly states = new Map<string, unknown>();
  private readonly signingKeys = new Map<string, SigningKey>();
  private contractAddress: ContractAddress | null = null;

  setContractAddress(address: ContractAddress): void {
    this.contractAddress = address;
  }

  async set(
    privateStateId: PrivateStateId,
    state: unknown,
  ): Promise<void> {
    if (!this.contractAddress) {
      throw new Error('Contract address has not been set.');
    }

    this.states.set(`${this.contractAddress}:${privateStateId}`, state);
  }

  async get(privateStateId: PrivateStateId): Promise<unknown | null> {
    if (!this.contractAddress) {
      throw new Error('Contract address has not been set.');
    }

    return this.states.get(`${this.contractAddress}:${privateStateId}`) ?? null;
  }

  async remove(privateStateId: PrivateStateId): Promise<void> {
    if (!this.contractAddress) {
      throw new Error('Contract address has not been set.');
    }

    this.states.delete(`${this.contractAddress}:${privateStateId}`);
  }

  async clear(): Promise<void> {
    this.states.clear();
  }

  async setSigningKey(
    address: ContractAddress,
    signingKey: SigningKey,
  ): Promise<void> {
    this.signingKeys.set(address, signingKey);
  }

  async getSigningKey(
    address: ContractAddress,
  ): Promise<SigningKey | null> {
    return this.signingKeys.get(address) ?? null;
  }

  async removeSigningKey(address: ContractAddress): Promise<void> {
    this.signingKeys.delete(address);
  }

  async clearSigningKeys(): Promise<void> {
    this.signingKeys.clear();
  }

  async exportPrivateStates(): Promise<never> {
    throw new Error(
      'AuraAid private-state export is not implemented yet.',
    );
  }

  async importPrivateStates(): Promise<never> {
    throw new Error(
      'AuraAid private-state import is not implemented yet.',
    );
  }

  async exportSigningKeys(): Promise<never> {
    throw new Error(
      'AuraAid signing-key export is not implemented yet.',
    );
  }

  async importSigningKeys(): Promise<never> {
    throw new Error(
      'AuraAid signing-key import is not implemented yet.',
    );
  }
}

export const auraAidPrivateStateProvider =
  new AuraAidPrivateStateProvider();
