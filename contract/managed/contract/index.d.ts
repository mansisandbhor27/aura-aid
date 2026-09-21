import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  createCampaign(context: __compactRuntime.CircuitContext<PS>,
                 goalAmount__0: bigint): __compactRuntime.CircuitResults<PS, []>;
  donate(context: __compactRuntime.CircuitContext<PS>,
         campaignId__0: bigint,
         amount__0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  createCampaign(context: __compactRuntime.CircuitContext<PS>,
                 goalAmount__0: bigint): __compactRuntime.CircuitResults<PS, []>;
  donate(context: __compactRuntime.CircuitContext<PS>,
         campaignId__0: bigint,
         amount__0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  createCampaign(context: __compactRuntime.CircuitContext<PS>,
                 goalAmount__0: bigint): __compactRuntime.CircuitResults<PS, []>;
  donate(context: __compactRuntime.CircuitContext<PS>,
         campaignId__0: bigint,
         amount__0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly campaignCount: bigint;
  campaigns: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): bigint;
    [Symbol.iterator](): Iterator<[bigint, bigint]>
  };
  campaignBalances: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): bigint;
    [Symbol.iterator](): Iterator<[bigint, bigint]>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
