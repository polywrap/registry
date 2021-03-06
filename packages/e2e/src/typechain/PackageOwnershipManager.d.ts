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
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface PackageOwnershipManagerInterface extends ethers.utils.Interface {
  functions: {
    "allowedLocalDomainRegistries(bytes32)": FunctionFragment;
    "connectDomainRegistryLink(bytes32,address)": FunctionFragment;
    "domainRegistryLinks(bytes32)": FunctionFragment;
    "getPolywrapOwner(bytes32,bytes32)": FunctionFragment;
    "incomingBridgeLinks(bytes32)": FunctionFragment;
    "initialize(address,bytes32[],address[])": FunctionFragment;
    "outgoingBridgeLinks(bytes32)": FunctionFragment;
    "owner()": FunctionFragment;
    "receiveOwnership(bytes32,bytes32,bytes32,address)": FunctionFragment;
    "registry()": FunctionFragment;
    "relayOwnership(bytes32,bytes32,bytes32)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "updateIncomingBridgeLink(bytes32,bytes32,address)": FunctionFragment;
    "updateLocalDomainRegistryPermission(bytes32,bool)": FunctionFragment;
    "updateOutgoingBridgeLink(bytes32,bytes32,address)": FunctionFragment;
    "updateOwnership(bytes32,bytes32)": FunctionFragment;
    "updateRegistry(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "allowedLocalDomainRegistries",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "connectDomainRegistryLink",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "domainRegistryLinks",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getPolywrapOwner",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "incomingBridgeLinks",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, BytesLike[], string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "outgoingBridgeLinks",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "receiveOwnership",
    values: [BytesLike, BytesLike, BytesLike, string]
  ): string;
  encodeFunctionData(functionFragment: "registry", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "relayOwnership",
    values: [BytesLike, BytesLike, BytesLike]
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
    functionFragment: "updateIncomingBridgeLink",
    values: [BytesLike, BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateLocalDomainRegistryPermission",
    values: [BytesLike, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "updateOutgoingBridgeLink",
    values: [BytesLike, BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateOwnership",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateRegistry",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "allowedLocalDomainRegistries",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "connectDomainRegistryLink",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "domainRegistryLinks",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPolywrapOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "incomingBridgeLinks",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "outgoingBridgeLinks",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "receiveOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "registry", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "relayOwnership",
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
    functionFragment: "updateIncomingBridgeLink",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateLocalDomainRegistryPermission",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateOutgoingBridgeLink",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateRegistry",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export type OwnershipTransferredEvent = TypedEvent<
  [string, string] & { previousOwner: string; newOwner: string }
>;

export class PackageOwnershipManager extends BaseContract {
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

  interface: PackageOwnershipManagerInterface;

  functions: {
    allowedLocalDomainRegistries(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    connectDomainRegistryLink(
      domainRegistry: BytesLike,
      _domainRegistryLink: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    domainRegistryLinks(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getPolywrapOwner(
      domainRegistry: BytesLike,
      domainRegistryNode: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    incomingBridgeLinks(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    initialize(
      _registry: string,
      _domainRegistries: BytesLike[],
      _domainRegistryLinks: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    outgoingBridgeLinks(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    receiveOwnership(
      blockchainName: BytesLike,
      domainRegistry: BytesLike,
      domainRegistryNode: BytesLike,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    registry(overrides?: CallOverrides): Promise<[string]>;

    relayOwnership(
      blockchainName: BytesLike,
      domainRegistry: BytesLike,
      domainRegistryNode: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateIncomingBridgeLink(
      domainRegistry: BytesLike,
      blockchainName: BytesLike,
      bridgeLink: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateLocalDomainRegistryPermission(
      domainRegistry: BytesLike,
      allowed: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateOutgoingBridgeLink(
      domainRegistry: BytesLike,
      blockchainName: BytesLike,
      bridgeLink: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateOwnership(
      domainRegistry: BytesLike,
      domainRegistryNode: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateRegistry(
      _registry: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  allowedLocalDomainRegistries(
    arg0: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  connectDomainRegistryLink(
    domainRegistry: BytesLike,
    _domainRegistryLink: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  domainRegistryLinks(
    arg0: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  getPolywrapOwner(
    domainRegistry: BytesLike,
    domainRegistryNode: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  incomingBridgeLinks(
    arg0: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  initialize(
    _registry: string,
    _domainRegistries: BytesLike[],
    _domainRegistryLinks: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  outgoingBridgeLinks(
    arg0: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  receiveOwnership(
    blockchainName: BytesLike,
    domainRegistry: BytesLike,
    domainRegistryNode: BytesLike,
    owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  registry(overrides?: CallOverrides): Promise<string>;

  relayOwnership(
    blockchainName: BytesLike,
    domainRegistry: BytesLike,
    domainRegistryNode: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateIncomingBridgeLink(
    domainRegistry: BytesLike,
    blockchainName: BytesLike,
    bridgeLink: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateLocalDomainRegistryPermission(
    domainRegistry: BytesLike,
    allowed: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateOutgoingBridgeLink(
    domainRegistry: BytesLike,
    blockchainName: BytesLike,
    bridgeLink: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateOwnership(
    domainRegistry: BytesLike,
    domainRegistryNode: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateRegistry(
    _registry: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    allowedLocalDomainRegistries(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    connectDomainRegistryLink(
      domainRegistry: BytesLike,
      _domainRegistryLink: string,
      overrides?: CallOverrides
    ): Promise<void>;

    domainRegistryLinks(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    getPolywrapOwner(
      domainRegistry: BytesLike,
      domainRegistryNode: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    incomingBridgeLinks(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    initialize(
      _registry: string,
      _domainRegistries: BytesLike[],
      _domainRegistryLinks: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    outgoingBridgeLinks(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    receiveOwnership(
      blockchainName: BytesLike,
      domainRegistry: BytesLike,
      domainRegistryNode: BytesLike,
      owner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    registry(overrides?: CallOverrides): Promise<string>;

    relayOwnership(
      blockchainName: BytesLike,
      domainRegistry: BytesLike,
      domainRegistryNode: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updateIncomingBridgeLink(
      domainRegistry: BytesLike,
      blockchainName: BytesLike,
      bridgeLink: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updateLocalDomainRegistryPermission(
      domainRegistry: BytesLike,
      allowed: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    updateOutgoingBridgeLink(
      domainRegistry: BytesLike,
      blockchainName: BytesLike,
      bridgeLink: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updateOwnership(
      domainRegistry: BytesLike,
      domainRegistryNode: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    updateRegistry(_registry: string, overrides?: CallOverrides): Promise<void>;
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
  };

  estimateGas: {
    allowedLocalDomainRegistries(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    connectDomainRegistryLink(
      domainRegistry: BytesLike,
      _domainRegistryLink: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    domainRegistryLinks(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPolywrapOwner(
      domainRegistry: BytesLike,
      domainRegistryNode: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    incomingBridgeLinks(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      _registry: string,
      _domainRegistries: BytesLike[],
      _domainRegistryLinks: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    outgoingBridgeLinks(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    receiveOwnership(
      blockchainName: BytesLike,
      domainRegistry: BytesLike,
      domainRegistryNode: BytesLike,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    registry(overrides?: CallOverrides): Promise<BigNumber>;

    relayOwnership(
      blockchainName: BytesLike,
      domainRegistry: BytesLike,
      domainRegistryNode: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateIncomingBridgeLink(
      domainRegistry: BytesLike,
      blockchainName: BytesLike,
      bridgeLink: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateLocalDomainRegistryPermission(
      domainRegistry: BytesLike,
      allowed: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateOutgoingBridgeLink(
      domainRegistry: BytesLike,
      blockchainName: BytesLike,
      bridgeLink: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateOwnership(
      domainRegistry: BytesLike,
      domainRegistryNode: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateRegistry(
      _registry: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    allowedLocalDomainRegistries(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    connectDomainRegistryLink(
      domainRegistry: BytesLike,
      _domainRegistryLink: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    domainRegistryLinks(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPolywrapOwner(
      domainRegistry: BytesLike,
      domainRegistryNode: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    incomingBridgeLinks(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _registry: string,
      _domainRegistries: BytesLike[],
      _domainRegistryLinks: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    outgoingBridgeLinks(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    receiveOwnership(
      blockchainName: BytesLike,
      domainRegistry: BytesLike,
      domainRegistryNode: BytesLike,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    registry(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    relayOwnership(
      blockchainName: BytesLike,
      domainRegistry: BytesLike,
      domainRegistryNode: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateIncomingBridgeLink(
      domainRegistry: BytesLike,
      blockchainName: BytesLike,
      bridgeLink: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateLocalDomainRegistryPermission(
      domainRegistry: BytesLike,
      allowed: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateOutgoingBridgeLink(
      domainRegistry: BytesLike,
      blockchainName: BytesLike,
      bridgeLink: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateOwnership(
      domainRegistry: BytesLike,
      domainRegistryNode: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateRegistry(
      _registry: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
