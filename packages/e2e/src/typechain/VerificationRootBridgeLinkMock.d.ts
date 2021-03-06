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

interface VerificationRootBridgeLinkMockInterface
  extends ethers.utils.Interface {
  functions: {
    "bridge()": FunctionFragment;
    "bridgeChainId()": FunctionFragment;
    "bridgeLink()": FunctionFragment;
    "initialize(address,bytes32,uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "receiveVerificationRoot(bytes32)": FunctionFragment;
    "relayVerificationRoot(bytes32)": FunctionFragment;
    "relayVerificationRootGasLimit()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "updateBridge(address)": FunctionFragment;
    "updateBridgeChainId(bytes32)": FunctionFragment;
    "updateBridgeLink(address)": FunctionFragment;
    "updateRelayVerificationRootGasLimit(uint256)": FunctionFragment;
    "updateVerificationRootRelayer(address)": FunctionFragment;
    "updateVersionVerificationManager(address)": FunctionFragment;
    "verificationRootRelayer()": FunctionFragment;
    "versionVerificationManager()": FunctionFragment;
  };

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
    values: [string, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "receiveVerificationRoot",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "relayVerificationRoot",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "relayVerificationRootGasLimit",
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
    functionFragment: "updateRelayVerificationRootGasLimit",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "updateVerificationRootRelayer",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateVersionVerificationManager",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "verificationRootRelayer",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "versionVerificationManager",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "bridge", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "bridgeChainId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "bridgeLink", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "receiveVerificationRoot",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "relayVerificationRoot",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "relayVerificationRootGasLimit",
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
    functionFragment: "updateRelayVerificationRootGasLimit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateVerificationRootRelayer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateVersionVerificationManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "verificationRootRelayer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "versionVerificationManager",
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

export class VerificationRootBridgeLinkMock extends BaseContract {
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

  interface: VerificationRootBridgeLinkMockInterface;

  functions: {
    bridge(overrides?: CallOverrides): Promise<[string]>;

    bridgeChainId(overrides?: CallOverrides): Promise<[string]>;

    bridgeLink(overrides?: CallOverrides): Promise<[string]>;

    initialize(
      _bridge: string,
      _bridgeChainId: BytesLike,
      _relayVerificationRootGasLimit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    receiveVerificationRoot(
      verificationRoot: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    relayVerificationRoot(
      verificationRoot: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    relayVerificationRootGasLimit(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
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

    updateRelayVerificationRootGasLimit(
      _relayVerificationRootGasLimit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateVerificationRootRelayer(
      _verificationRootRelayer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateVersionVerificationManager(
      _versionVerificationManager: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    verificationRootRelayer(overrides?: CallOverrides): Promise<[string]>;

    versionVerificationManager(overrides?: CallOverrides): Promise<[string]>;
  };

  bridge(overrides?: CallOverrides): Promise<string>;

  bridgeChainId(overrides?: CallOverrides): Promise<string>;

  bridgeLink(overrides?: CallOverrides): Promise<string>;

  initialize(
    _bridge: string,
    _bridgeChainId: BytesLike,
    _relayVerificationRootGasLimit: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  receiveVerificationRoot(
    verificationRoot: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  relayVerificationRoot(
    verificationRoot: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  relayVerificationRootGasLimit(overrides?: CallOverrides): Promise<BigNumber>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
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

  updateRelayVerificationRootGasLimit(
    _relayVerificationRootGasLimit: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateVerificationRootRelayer(
    _verificationRootRelayer: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateVersionVerificationManager(
    _versionVerificationManager: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  verificationRootRelayer(overrides?: CallOverrides): Promise<string>;

  versionVerificationManager(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    bridge(overrides?: CallOverrides): Promise<string>;

    bridgeChainId(overrides?: CallOverrides): Promise<string>;

    bridgeLink(overrides?: CallOverrides): Promise<string>;

    initialize(
      _bridge: string,
      _bridgeChainId: BytesLike,
      _relayVerificationRootGasLimit: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    receiveVerificationRoot(
      verificationRoot: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    relayVerificationRoot(
      verificationRoot: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    relayVerificationRootGasLimit(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: string,
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

    updateRelayVerificationRootGasLimit(
      _relayVerificationRootGasLimit: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    updateVerificationRootRelayer(
      _verificationRootRelayer: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updateVersionVerificationManager(
      _versionVerificationManager: string,
      overrides?: CallOverrides
    ): Promise<void>;

    verificationRootRelayer(overrides?: CallOverrides): Promise<string>;

    versionVerificationManager(overrides?: CallOverrides): Promise<string>;
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
    bridge(overrides?: CallOverrides): Promise<BigNumber>;

    bridgeChainId(overrides?: CallOverrides): Promise<BigNumber>;

    bridgeLink(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _bridge: string,
      _bridgeChainId: BytesLike,
      _relayVerificationRootGasLimit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    receiveVerificationRoot(
      verificationRoot: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    relayVerificationRoot(
      verificationRoot: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    relayVerificationRootGasLimit(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
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

    updateRelayVerificationRootGasLimit(
      _relayVerificationRootGasLimit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateVerificationRootRelayer(
      _verificationRootRelayer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateVersionVerificationManager(
      _versionVerificationManager: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    verificationRootRelayer(overrides?: CallOverrides): Promise<BigNumber>;

    versionVerificationManager(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    bridge(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    bridgeChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    bridgeLink(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      _bridge: string,
      _bridgeChainId: BytesLike,
      _relayVerificationRootGasLimit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    receiveVerificationRoot(
      verificationRoot: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    relayVerificationRoot(
      verificationRoot: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    relayVerificationRootGasLimit(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
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

    updateRelayVerificationRootGasLimit(
      _relayVerificationRootGasLimit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateVerificationRootRelayer(
      _verificationRootRelayer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateVersionVerificationManager(
      _versionVerificationManager: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    verificationRootRelayer(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    versionVerificationManager(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
