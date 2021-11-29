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
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface RegistryInterface extends ethers.utils.Interface {
  functions: {
    "getPackageOwner(bytes32)": FunctionFragment;
    "initialize()": FunctionFragment;
    "owner()": FunctionFragment;
    "ownershipUpdater()": FunctionFragment;
    "packages(bytes32)": FunctionFragment;
    "publishVersion(bytes32,uint256,uint256,uint256,string)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "updateOwnership(bytes32,bytes32,address)": FunctionFragment;
    "updateOwnershipUpdater(address)": FunctionFragment;
    "updateVersionPublisher(address)": FunctionFragment;
    "versionNodes(bytes32)": FunctionFragment;
    "versionPublisher()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getPackageOwner",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "ownershipUpdater",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "packages", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "publishVersion",
    values: [BytesLike, BigNumberish, BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateOwnership",
    values: [BytesLike, BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateOwnershipUpdater",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateVersionPublisher",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "versionNodes",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "versionPublisher",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "getPackageOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "ownershipUpdater",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "packages", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "publishVersion",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateOwnershipUpdater",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateVersionPublisher",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "versionNodes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "versionPublisher",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "OwnershipUpdated(bytes32,bytes32,bytes32,address)": EventFragment;
    "VersionPublished(bytes32,uint256,uint256,uint256,string)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VersionPublished"): EventFragment;
}

export type OwnershipTransferredEvent = TypedEvent<
  [string, string] & { previousOwner: string; newOwner: string }
>;

export type OwnershipUpdatedEvent = TypedEvent<
  [string, string, string, string] & {
    domainRegistryNode: string;
    packageId: string;
    domainRegistry: string;
    owner: string;
  }
>;

export type VersionPublishedEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber, string] & {
    packageId: string;
    major: BigNumber;
    minor: BigNumber;
    patch: BigNumber;
    location: string;
  }
>;

export class Registry extends BaseContract {
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

  interface: RegistryInterface;

  functions: {
    getPackageOwner(
      packageId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    initialize(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    ownershipUpdater(overrides?: CallOverrides): Promise<[string]>;

    packages(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [string, string, string] & {
        owner: string;
        domainRegistryNode: string;
        domainRegistry: string;
      }
    >;

    publishVersion(
      packageId: BytesLike,
      majorVersion: BigNumberish,
      minorVersion: BigNumberish,
      patchVersion: BigNumberish,
      location: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateOwnership(
      domainRegistry: BytesLike,
      domainRegistryNode: BytesLike,
      domainOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateOwnershipUpdater(
      _ownershipUpdater: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateVersionPublisher(
      _versionPublisher: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    versionNodes(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [boolean, BigNumber, boolean, string] & {
        leaf: boolean;
        latestSubVersion: BigNumber;
        created: boolean;
        location: string;
      }
    >;

    versionPublisher(overrides?: CallOverrides): Promise<[string]>;
  };

  getPackageOwner(
    packageId: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  initialize(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  ownershipUpdater(overrides?: CallOverrides): Promise<string>;

  packages(
    arg0: BytesLike,
    overrides?: CallOverrides
  ): Promise<
    [string, string, string] & {
      owner: string;
      domainRegistryNode: string;
      domainRegistry: string;
    }
  >;

  publishVersion(
    packageId: BytesLike,
    majorVersion: BigNumberish,
    minorVersion: BigNumberish,
    patchVersion: BigNumberish,
    location: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateOwnership(
    domainRegistry: BytesLike,
    domainRegistryNode: BytesLike,
    domainOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateOwnershipUpdater(
    _ownershipUpdater: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateVersionPublisher(
    _versionPublisher: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  versionNodes(
    arg0: BytesLike,
    overrides?: CallOverrides
  ): Promise<
    [boolean, BigNumber, boolean, string] & {
      leaf: boolean;
      latestSubVersion: BigNumber;
      created: boolean;
      location: string;
    }
  >;

  versionPublisher(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    getPackageOwner(
      packageId: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    initialize(overrides?: CallOverrides): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    ownershipUpdater(overrides?: CallOverrides): Promise<string>;

    packages(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [string, string, string] & {
        owner: string;
        domainRegistryNode: string;
        domainRegistry: string;
      }
    >;

    publishVersion(
      packageId: BytesLike,
      majorVersion: BigNumberish,
      minorVersion: BigNumberish,
      patchVersion: BigNumberish,
      location: string,
      overrides?: CallOverrides
    ): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updateOwnership(
      domainRegistry: BytesLike,
      domainRegistryNode: BytesLike,
      domainOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updateOwnershipUpdater(
      _ownershipUpdater: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updateVersionPublisher(
      _versionPublisher: string,
      overrides?: CallOverrides
    ): Promise<void>;

    versionNodes(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [boolean, BigNumber, boolean, string] & {
        leaf: boolean;
        latestSubVersion: BigNumber;
        created: boolean;
        location: string;
      }
    >;

    versionPublisher(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    "OwnershipUpdated(bytes32,bytes32,bytes32,address)"(
      domainRegistryNode?: BytesLike | null,
      packageId?: null,
      domainRegistry?: null,
      owner?: string | null
    ): TypedEventFilter<
      [string, string, string, string],
      {
        domainRegistryNode: string;
        packageId: string;
        domainRegistry: string;
        owner: string;
      }
    >;

    OwnershipUpdated(
      domainRegistryNode?: BytesLike | null,
      packageId?: null,
      domainRegistry?: null,
      owner?: string | null
    ): TypedEventFilter<
      [string, string, string, string],
      {
        domainRegistryNode: string;
        packageId: string;
        domainRegistry: string;
        owner: string;
      }
    >;

    "VersionPublished(bytes32,uint256,uint256,uint256,string)"(
      packageId?: BytesLike | null,
      major?: null,
      minor?: null,
      patch?: null,
      location?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, BigNumber, string],
      {
        packageId: string;
        major: BigNumber;
        minor: BigNumber;
        patch: BigNumber;
        location: string;
      }
    >;

    VersionPublished(
      packageId?: BytesLike | null,
      major?: null,
      minor?: null,
      patch?: null,
      location?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, BigNumber, string],
      {
        packageId: string;
        major: BigNumber;
        minor: BigNumber;
        patch: BigNumber;
        location: string;
      }
    >;
  };

  estimateGas: {
    getPackageOwner(
      packageId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    ownershipUpdater(overrides?: CallOverrides): Promise<BigNumber>;

    packages(arg0: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    publishVersion(
      packageId: BytesLike,
      majorVersion: BigNumberish,
      minorVersion: BigNumberish,
      patchVersion: BigNumberish,
      location: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateOwnership(
      domainRegistry: BytesLike,
      domainRegistryNode: BytesLike,
      domainOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateOwnershipUpdater(
      _ownershipUpdater: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateVersionPublisher(
      _versionPublisher: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    versionNodes(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    versionPublisher(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    getPackageOwner(
      packageId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ownershipUpdater(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    packages(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    publishVersion(
      packageId: BytesLike,
      majorVersion: BigNumberish,
      minorVersion: BigNumberish,
      patchVersion: BigNumberish,
      location: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateOwnership(
      domainRegistry: BytesLike,
      domainRegistryNode: BytesLike,
      domainOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateOwnershipUpdater(
      _ownershipUpdater: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateVersionPublisher(
      _versionPublisher: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    versionNodes(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    versionPublisher(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
