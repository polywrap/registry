/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
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

export interface VerificationTreeManagerInterface extends utils.Interface {
  functions: {
    "calculateVerificationRoot()": FunctionFragment;
    "initialize(address,address)": FunctionFragment;
    "onVersionVerified(bytes32,bytes32)": FunctionFragment;
    "owner()": FunctionFragment;
    "registry()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "updateRegistry(address)": FunctionFragment;
    "updateVerificationRootRelayer(address)": FunctionFragment;
    "updateVotingMachine(address)": FunctionFragment;
    "verificationRootRelayer()": FunctionFragment;
    "verifiedVersionCount()": FunctionFragment;
    "votingMachine()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "calculateVerificationRoot",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "onVersionVerified",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "registry", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateRegistry",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateVerificationRootRelayer",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateVotingMachine",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "verificationRootRelayer",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "verifiedVersionCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "votingMachine",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "calculateVerificationRoot",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "onVersionVerified",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "registry", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateVerificationRootRelayer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateVotingMachine",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "verificationRootRelayer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "verifiedVersionCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "votingMachine",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "VerificationRootCalculated(bytes32,uint256)": EventFragment;
    "VersionVerified(bytes32,bytes32,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VerificationRootCalculated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VersionVerified"): EventFragment;
}

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export type VerificationRootCalculatedEvent = TypedEvent<
  [string, BigNumber],
  { verificationRoot: string; verifiedVersionCount: BigNumber }
>;

export type VerificationRootCalculatedEventFilter =
  TypedEventFilter<VerificationRootCalculatedEvent>;

export type VersionVerifiedEvent = TypedEvent<
  [string, string, BigNumber],
  {
    patchNodeId: string;
    packageLocationHash: string;
    verifiedVersionIndex: BigNumber;
  }
>;

export type VersionVerifiedEventFilter = TypedEventFilter<VersionVerifiedEvent>;

export interface VerificationTreeManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: VerificationTreeManagerInterface;

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
    calculateVerificationRoot(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    initialize(
      _registry: string,
      _votingMachine: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    onVersionVerified(
      patchNodeId: BytesLike,
      packageLocationHash: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    registry(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateRegistry(
      _registry: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateVerificationRootRelayer(
      _verificationRootRelayer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateVotingMachine(
      _votingMachine: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    verificationRootRelayer(overrides?: CallOverrides): Promise<[string]>;

    verifiedVersionCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    votingMachine(overrides?: CallOverrides): Promise<[string]>;
  };

  calculateVerificationRoot(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  initialize(
    _registry: string,
    _votingMachine: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  onVersionVerified(
    patchNodeId: BytesLike,
    packageLocationHash: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  registry(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateRegistry(
    _registry: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateVerificationRootRelayer(
    _verificationRootRelayer: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateVotingMachine(
    _votingMachine: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  verificationRootRelayer(overrides?: CallOverrides): Promise<string>;

  verifiedVersionCount(overrides?: CallOverrides): Promise<BigNumber>;

  votingMachine(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    calculateVerificationRoot(overrides?: CallOverrides): Promise<string>;

    initialize(
      _registry: string,
      _votingMachine: string,
      overrides?: CallOverrides
    ): Promise<void>;

    onVersionVerified(
      patchNodeId: BytesLike,
      packageLocationHash: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    registry(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updateRegistry(_registry: string, overrides?: CallOverrides): Promise<void>;

    updateVerificationRootRelayer(
      _verificationRootRelayer: string,
      overrides?: CallOverrides
    ): Promise<void>;

    updateVotingMachine(
      _votingMachine: string,
      overrides?: CallOverrides
    ): Promise<void>;

    verificationRootRelayer(overrides?: CallOverrides): Promise<string>;

    verifiedVersionCount(overrides?: CallOverrides): Promise<BigNumber>;

    votingMachine(overrides?: CallOverrides): Promise<string>;
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

    "VerificationRootCalculated(bytes32,uint256)"(
      verificationRoot?: BytesLike | null,
      verifiedVersionCount?: null
    ): VerificationRootCalculatedEventFilter;
    VerificationRootCalculated(
      verificationRoot?: BytesLike | null,
      verifiedVersionCount?: null
    ): VerificationRootCalculatedEventFilter;

    "VersionVerified(bytes32,bytes32,uint256)"(
      patchNodeId?: BytesLike | null,
      packageLocationHash?: null,
      verifiedVersionIndex?: null
    ): VersionVerifiedEventFilter;
    VersionVerified(
      patchNodeId?: BytesLike | null,
      packageLocationHash?: null,
      verifiedVersionIndex?: null
    ): VersionVerifiedEventFilter;
  };

  estimateGas: {
    calculateVerificationRoot(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    initialize(
      _registry: string,
      _votingMachine: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    onVersionVerified(
      patchNodeId: BytesLike,
      packageLocationHash: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    registry(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateRegistry(
      _registry: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateVerificationRootRelayer(
      _verificationRootRelayer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateVotingMachine(
      _votingMachine: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    verificationRootRelayer(overrides?: CallOverrides): Promise<BigNumber>;

    verifiedVersionCount(overrides?: CallOverrides): Promise<BigNumber>;

    votingMachine(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    calculateVerificationRoot(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    initialize(
      _registry: string,
      _votingMachine: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    onVersionVerified(
      patchNodeId: BytesLike,
      packageLocationHash: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    registry(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateRegistry(
      _registry: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateVerificationRootRelayer(
      _verificationRootRelayer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateVotingMachine(
      _votingMachine: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    verificationRootRelayer(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    verifiedVersionCount(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    votingMachine(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}