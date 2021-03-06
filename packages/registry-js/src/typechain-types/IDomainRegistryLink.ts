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

export interface IDomainRegistryLinkInterface extends utils.Interface {
  functions: {
    "getPolywrapOwner(bytes32)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getPolywrapOwner",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "getPolywrapOwner",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IDomainRegistryLink extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IDomainRegistryLinkInterface;

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
    getPolywrapOwner(
      domainRegistryNode: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;
  };

  getPolywrapOwner(
    domainRegistryNode: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    getPolywrapOwner(
      domainRegistryNode: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {};

  estimateGas: {
    getPolywrapOwner(
      domainRegistryNode: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getPolywrapOwner(
      domainRegistryNode: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
