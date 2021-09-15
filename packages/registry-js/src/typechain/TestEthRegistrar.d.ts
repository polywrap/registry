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

interface TestEthRegistrarInterface extends ethers.utils.Interface {
  functions: {
    "GRACE_PERIOD()": FunctionFragment;
    "addController(address)": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "available(uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "baseNode()": FunctionFragment;
    "controllers(address)": FunctionFragment;
    "ens()": FunctionFragment;
    "getApproved(uint256)": FunctionFragment;
    "isApprovedForAll(address,address)": FunctionFragment;
    "name()": FunctionFragment;
    "nameExpires(uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "ownerOf(uint256)": FunctionFragment;
    "reclaim(uint256,address)": FunctionFragment;
    "register(uint256,address,uint256)": FunctionFragment;
    "registerOnly(uint256,address,uint256)": FunctionFragment;
    "removeController(address)": FunctionFragment;
    "renew(uint256,uint256)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "safeTransferFrom(address,address,uint256)": FunctionFragment;
    "setApprovalForAll(address,bool)": FunctionFragment;
    "setResolver(address)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "symbol()": FunctionFragment;
    "tokenURI(uint256)": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "GRACE_PERIOD",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "addController",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "available",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(functionFragment: "baseNode", values?: undefined): string;
  encodeFunctionData(functionFragment: "controllers", values: [string]): string;
  encodeFunctionData(functionFragment: "ens", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getApproved",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isApprovedForAll",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "nameExpires",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "ownerOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "reclaim",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "register",
    values: [BigNumberish, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "registerOnly",
    values: [BigNumberish, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "removeController",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "renew",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setApprovalForAll",
    values: [string, boolean]
  ): string;
  encodeFunctionData(functionFragment: "setResolver", values: [string]): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "tokenURI",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "GRACE_PERIOD",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addController",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "available", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "baseNode", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "controllers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ens", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "nameExpires",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "reclaim", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "register", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "registerOnly",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeController",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "renew", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setApprovalForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setResolver",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "Approval(address,address,uint256)": EventFragment;
    "ApprovalForAll(address,address,bool)": EventFragment;
    "ControllerAdded(address)": EventFragment;
    "ControllerRemoved(address)": EventFragment;
    "NameMigrated(uint256,address,uint256)": EventFragment;
    "NameRegistered(uint256,address,uint256)": EventFragment;
    "NameRenewed(uint256,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ApprovalForAll"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ControllerAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ControllerRemoved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NameMigrated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NameRegistered"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NameRenewed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
}

export class TestEthRegistrar extends BaseContract {
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

  interface: TestEthRegistrarInterface;

  functions: {
    GRACE_PERIOD(overrides?: CallOverrides): Promise<[BigNumber]>;

    addController(
      controller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    available(id: BigNumberish, overrides?: CallOverrides): Promise<[boolean]>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    baseNode(overrides?: CallOverrides): Promise<[string]>;

    controllers(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;

    ens(overrides?: CallOverrides): Promise<[string]>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    name(overrides?: CallOverrides): Promise<[string]>;

    nameExpires(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    reclaim(
      id: BigNumberish,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    register(
      id: BigNumberish,
      owner: string,
      duration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    registerOnly(
      id: BigNumberish,
      owner: string,
      duration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removeController(
      controller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renew(
      id: BigNumberish,
      duration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setResolver(
      resolver: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

    tokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  GRACE_PERIOD(overrides?: CallOverrides): Promise<BigNumber>;

  addController(
    controller: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  approve(
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  available(id: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

  balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

  baseNode(overrides?: CallOverrides): Promise<string>;

  controllers(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  ens(overrides?: CallOverrides): Promise<string>;

  getApproved(
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  isApprovedForAll(
    owner: string,
    operator: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  name(overrides?: CallOverrides): Promise<string>;

  nameExpires(id: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

  reclaim(
    id: BigNumberish,
    owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  register(
    id: BigNumberish,
    owner: string,
    duration: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  registerOnly(
    id: BigNumberish,
    owner: string,
    duration: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removeController(
    controller: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renew(
    id: BigNumberish,
    duration: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "safeTransferFrom(address,address,uint256)"(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "safeTransferFrom(address,address,uint256,bytes)"(
    from: string,
    to: string,
    tokenId: BigNumberish,
    _data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setApprovalForAll(
    operator: string,
    approved: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setResolver(
    resolver: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceID: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  symbol(overrides?: CallOverrides): Promise<string>;

  tokenURI(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

  transferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    GRACE_PERIOD(overrides?: CallOverrides): Promise<BigNumber>;

    addController(controller: string, overrides?: CallOverrides): Promise<void>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    available(id: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    baseNode(overrides?: CallOverrides): Promise<string>;

    controllers(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    ens(overrides?: CallOverrides): Promise<string>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    name(overrides?: CallOverrides): Promise<string>;

    nameExpires(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

    reclaim(
      id: BigNumberish,
      owner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    register(
      id: BigNumberish,
      owner: string,
      duration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    registerOnly(
      id: BigNumberish,
      owner: string,
      duration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    removeController(
      controller: string,
      overrides?: CallOverrides
    ): Promise<void>;

    renew(
      id: BigNumberish,
      duration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    setResolver(resolver: string, overrides?: CallOverrides): Promise<void>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    symbol(overrides?: CallOverrides): Promise<string>;

    tokenURI(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    Approval(
      owner?: string | null,
      approved?: string | null,
      tokenId?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { owner: string; approved: string; tokenId: BigNumber }
    >;

    ApprovalForAll(
      owner?: string | null,
      operator?: string | null,
      approved?: null
    ): TypedEventFilter<
      [string, string, boolean],
      { owner: string; operator: string; approved: boolean }
    >;

    ControllerAdded(
      controller?: string | null
    ): TypedEventFilter<[string], { controller: string }>;

    ControllerRemoved(
      controller?: string | null
    ): TypedEventFilter<[string], { controller: string }>;

    NameMigrated(
      id?: BigNumberish | null,
      owner?: string | null,
      expires?: null
    ): TypedEventFilter<
      [BigNumber, string, BigNumber],
      { id: BigNumber; owner: string; expires: BigNumber }
    >;

    NameRegistered(
      id?: BigNumberish | null,
      owner?: string | null,
      expires?: null
    ): TypedEventFilter<
      [BigNumber, string, BigNumber],
      { id: BigNumber; owner: string; expires: BigNumber }
    >;

    NameRenewed(
      id?: BigNumberish | null,
      expires?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { id: BigNumber; expires: BigNumber }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    Transfer(
      from?: string | null,
      to?: string | null,
      tokenId?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { from: string; to: string; tokenId: BigNumber }
    >;
  };

  estimateGas: {
    GRACE_PERIOD(overrides?: CallOverrides): Promise<BigNumber>;

    addController(
      controller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    available(id: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    baseNode(overrides?: CallOverrides): Promise<BigNumber>;

    controllers(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    ens(overrides?: CallOverrides): Promise<BigNumber>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    nameExpires(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    reclaim(
      id: BigNumberish,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    register(
      id: BigNumberish,
      owner: string,
      duration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    registerOnly(
      id: BigNumberish,
      owner: string,
      duration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removeController(
      controller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renew(
      id: BigNumberish,
      duration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setResolver(
      resolver: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

    tokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    GRACE_PERIOD(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    addController(
      controller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    available(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    balanceOf(
      owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    baseNode(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    controllers(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    ens(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    nameExpires(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    reclaim(
      id: BigNumberish,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    register(
      id: BigNumberish,
      owner: string,
      duration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    registerOnly(
      id: BigNumberish,
      owner: string,
      duration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    removeController(
      controller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renew(
      id: BigNumberish,
      duration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setResolver(
      resolver: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
