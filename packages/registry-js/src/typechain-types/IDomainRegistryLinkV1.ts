/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface IDomainRegistryLinkV1Interface extends utils.Interface {
  functions: {
    "getDomainOwner(bytes32)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getDomainOwner",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "getDomainOwner",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IDomainRegistryLinkV1 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IDomainRegistryLinkV1Interface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    getDomainOwner(
      domainRegistryNode: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;
  };

  getDomainOwner(
    domainRegistryNode: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    getDomainOwner(
      domainRegistryNode: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {};

  estimateGas: {
    getDomainOwner(
      domainRegistryNode: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getDomainOwner(
      domainRegistryNode: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
