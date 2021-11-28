/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface IVersionResolverInterface extends ethers.utils.Interface {
  functions: {
    "latestPrereleaseLocation(bytes32)": FunctionFragment;
    "latestPrereleaseNode(bytes32)": FunctionFragment;
    "latestReleaseLocation(bytes32)": FunctionFragment;
    "latestReleaseNode(bytes32)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "latestPrereleaseLocation",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "latestPrereleaseNode",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "latestReleaseLocation",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "latestReleaseNode",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "latestPrereleaseLocation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "latestPrereleaseNode",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "latestReleaseLocation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "latestReleaseNode",
    data: BytesLike
  ): Result;

  events: {};
}

export class IVersionResolver extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: IVersionResolverInterface;

  functions: {
    latestPrereleaseLocation(
      versionNodeId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string] & { location: string }>;

    latestPrereleaseNode(
      versionNodeId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string] & { nodeId: string }>;

    latestReleaseLocation(
      versionNodeId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string] & { location: string }>;

    latestReleaseNode(
      versionNodeId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string] & { nodeId: string }>;
  };

  latestPrereleaseLocation(
    versionNodeId: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  latestPrereleaseNode(
    versionNodeId: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  latestReleaseLocation(
    versionNodeId: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  latestReleaseNode(
    versionNodeId: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    latestPrereleaseLocation(
      versionNodeId: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    latestPrereleaseNode(
      versionNodeId: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    latestReleaseLocation(
      versionNodeId: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    latestReleaseNode(
      versionNodeId: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {};

  estimateGas: {
    latestPrereleaseLocation(
      versionNodeId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    latestPrereleaseNode(
      versionNodeId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    latestReleaseLocation(
      versionNodeId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    latestReleaseNode(
      versionNodeId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    latestPrereleaseLocation(
      versionNodeId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    latestPrereleaseNode(
      versionNodeId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    latestReleaseLocation(
      versionNodeId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    latestReleaseNode(
      versionNodeId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
