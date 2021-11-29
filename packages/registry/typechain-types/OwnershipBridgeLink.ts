/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface OwnershipBridgeLinkInterface extends utils.Interface {
  functions: {
    "blockchainName()": FunctionFragment;
    "bridge()": FunctionFragment;
    "bridgeChainId()": FunctionFragment;
    "bridgeLink()": FunctionFragment;
    "initialize(address,address,bytes32,bytes32,uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "packageOwnershipManager()": FunctionFragment;
    "receiveOwnership(bytes32,bytes32,address)": FunctionFragment;
    "relayOwnership(bytes32,bytes32,address)": FunctionFragment;
    "relayOwnershipGasLimit()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "updateBlockchainName(bytes32)": FunctionFragment;
    "updateBridge(address)": FunctionFragment;
    "updateBridgeChainId(bytes32)": FunctionFragment;
    "updateBridgeLink(address)": FunctionFragment;
    "updatePackageOwnershipManager(address)": FunctionFragment;
    "updateRelayOwnershipGasLimit(uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "blockchainName",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "bridge", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "bridgeChainId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "bridgeLink",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string, BytesLike, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "packageOwnershipManager",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "receiveOwnership",
    values: [BytesLike, BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "relayOwnership",
    values: [BytesLike, BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "relayOwnershipGasLimit",
    values?: undefined
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
    functionFragment: "updateBlockchainName",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateBridge",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateBridgeChainId",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateBridgeLink",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updatePackageOwnershipManager",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateRelayOwnershipGasLimit",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "blockchainName",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "bridge", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "bridgeChainId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "bridgeLink", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "packageOwnershipManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "receiveOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "relayOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "relayOwnershipGasLimit",
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
    functionFragment: "updateBlockchainName",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateBridge",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateBridgeChainId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateBridgeLink",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updatePackageOwnershipManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateRelayOwnershipGasLimit",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface OwnershipBridgeLink extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: OwnershipBridgeLinkInterface;

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
    blockchainName(overrides?: CallOverrides): Promise<[string]>;

    bridge(overrides?: CallOverrides): Promise<[string]>;

    bridgeChainId(overrides?: CallOverrides): Promise<[string]>;

    bridgeLink(overrides?: CallOverrides): Promise<[string]>;

    initialize(
      _bridge: string,
      _packageOwnershipManager: string,
      _blockchainName: BytesLike,
      _bridgeChainId: BytesLike,
      _relayOwnershipGasLimit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    packageOwnershipManager(overrides?: CallOverrides): Promise<[string]>;

    receiveOwnership(
      domainRegistrar: BytesLike,
      domainRegistrarNode: BytesLike,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    relayOwnership(
      domainRegistrar: BytesLike,
      domainRegistrarNode: BytesLike,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    relayOwnershipGasLimit(overrides?: CallOverrides): Promise<[BigNumber]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateBlockchainName(
      _blockchainName: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateBridge(
      _bridge: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateBridgeChainId(
      _bridgeChainId: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateBridgeLink(
      _bridgeLink: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updatePackageOwnershipManager(
      _packageOwnershipManager: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateRelayOwnershipGasLimit(
      _relayOwnershipGasLimit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  blockchainName(overrides?: CallOverrides): Promise<string>;

  bridge(overrides?: CallOverrides): Promise<string>;

  bridgeChainId(overrides?: CallOverrides): Promise<string>;

  bridgeLink(overrides?: CallOverrides): Promise<string>;

  initialize(
    _bridge: string,
    _packageOwnershipManager: string,
    _blockchainName: BytesLike,
    _bridgeChainId: BytesLike,
    _relayOwnershipGasLimit: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  packageOwnershipManager(overrides?: CallOverrides): Promise<string>;

  receiveOwnership(
    domainRegistrar: BytesLike,
    domainRegistrarNode: BytesLike,
    owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  relayOwnership(
    domainRegistrar: BytesLike,
    domainRegistrarNode: BytesLike,
    owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  relayOwnershipGasLimit(overrides?: CallOverrides): Promise<BigNumber>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateBlockchainName(
    _blockchainName: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateBridge(
    _bridge: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateBridgeChainId(
    _bridgeChainId: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateBridgeLink(
    _bridgeLink: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updatePackageOwnershipManager(
    _packageOwnershipManager: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateRelayOwnershipGasLimit(
    _relayOwnershipGasLimit: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    blockchainName(overrides?: CallOverrides): Promise<string>;

    bridge(overrides?: CallOverrides): Promise<string>;

    bridgeChainId(overrides?: CallOverrides): Promise<string>;

    bridgeLink(overrides?: CallOverrides): Promise<string>;

    initialize(
      _bridge: string,
      _packageOwnershipManager: string,
      _blockchainName: BytesLike,
      _bridgeChainId: BytesLike,
      _relayOwnershipGasLimit: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    packageOwnershipManager(overrides?: CallOverrides): Promise<string>;

    receiveOwnership(
      domainRegistrar: BytesLike,
      domainRegistrarNode: BytesLike,
      owner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    relayOwnership(
      domainRegistrar: BytesLike,
      domainRegistrarNode: BytesLike,
      owner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    relayOwnershipGasLimit(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updateBlockchainName(
      _blockchainName: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    updateBridge(_bridge: string, overrides?: CallOverrides): Promise<void>;

    updateBridgeChainId(
      _bridgeChainId: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    updateBridgeLink(
      _bridgeLink: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updatePackageOwnershipManager(
      _packageOwnershipManager: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updateRelayOwnershipGasLimit(
      _relayOwnershipGasLimit: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    blockchainName(overrides?: CallOverrides): Promise<BigNumber>;

    bridge(overrides?: CallOverrides): Promise<BigNumber>;

    bridgeChainId(overrides?: CallOverrides): Promise<BigNumber>;

    bridgeLink(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _bridge: string,
      _packageOwnershipManager: string,
      _blockchainName: BytesLike,
      _bridgeChainId: BytesLike,
      _relayOwnershipGasLimit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    packageOwnershipManager(overrides?: CallOverrides): Promise<BigNumber>;

    receiveOwnership(
      domainRegistrar: BytesLike,
      domainRegistrarNode: BytesLike,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    relayOwnership(
      domainRegistrar: BytesLike,
      domainRegistrarNode: BytesLike,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    relayOwnershipGasLimit(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateBlockchainName(
      _blockchainName: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateBridge(
      _bridge: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateBridgeChainId(
      _bridgeChainId: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateBridgeLink(
      _bridgeLink: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updatePackageOwnershipManager(
      _packageOwnershipManager: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateRelayOwnershipGasLimit(
      _relayOwnershipGasLimit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    blockchainName(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    bridge(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    bridgeChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    bridgeLink(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      _bridge: string,
      _packageOwnershipManager: string,
      _blockchainName: BytesLike,
      _bridgeChainId: BytesLike,
      _relayOwnershipGasLimit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    packageOwnershipManager(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    receiveOwnership(
      domainRegistrar: BytesLike,
      domainRegistrarNode: BytesLike,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    relayOwnership(
      domainRegistrar: BytesLike,
      domainRegistrarNode: BytesLike,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    relayOwnershipGasLimit(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateBlockchainName(
      _blockchainName: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateBridge(
      _bridge: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateBridgeChainId(
      _bridgeChainId: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateBridgeLink(
      _bridgeLink: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updatePackageOwnershipManager(
      _packageOwnershipManager: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateRelayOwnershipGasLimit(
      _relayOwnershipGasLimit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
