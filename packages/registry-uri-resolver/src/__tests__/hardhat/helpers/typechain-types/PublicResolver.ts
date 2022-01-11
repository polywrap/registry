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

export interface PublicResolverInterface extends utils.Interface {
  functions: {
    "ABI(bytes32,uint256)": FunctionFragment;
    "addr(bytes32)": FunctionFragment;
    "authorisations(bytes32,address,address)": FunctionFragment;
    "clearDNSZone(bytes32)": FunctionFragment;
    "contenthash(bytes32)": FunctionFragment;
    "dnsRecord(bytes32,bytes32,uint16)": FunctionFragment;
    "hasDNSRecords(bytes32,bytes32)": FunctionFragment;
    "interfaceImplementer(bytes32,bytes4)": FunctionFragment;
    "multicall(bytes[])": FunctionFragment;
    "name(bytes32)": FunctionFragment;
    "pubkey(bytes32)": FunctionFragment;
    "setABI(bytes32,uint256,bytes)": FunctionFragment;
    "setAddr(bytes32,uint256,bytes)": FunctionFragment;
    "setAuthorisation(bytes32,address,bool)": FunctionFragment;
    "setContenthash(bytes32,bytes)": FunctionFragment;
    "setDNSRecords(bytes32,bytes)": FunctionFragment;
    "setInterface(bytes32,bytes4,address)": FunctionFragment;
    "setName(bytes32,string)": FunctionFragment;
    "setPubkey(bytes32,bytes32,bytes32)": FunctionFragment;
    "setText(bytes32,string,string)": FunctionFragment;
    "setZonehash(bytes32,bytes)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "text(bytes32,string)": FunctionFragment;
    "zonehash(bytes32)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "ABI",
    values: [BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "addr", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "authorisations",
    values: [BytesLike, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "clearDNSZone",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "contenthash",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "dnsRecord",
    values: [BytesLike, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "hasDNSRecords",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "interfaceImplementer",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "multicall",
    values: [BytesLike[]]
  ): string;
  encodeFunctionData(functionFragment: "name", values: [BytesLike]): string;
  encodeFunctionData(functionFragment: "pubkey", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "setABI",
    values: [BytesLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setAddr",
    values: [BytesLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setAuthorisation",
    values: [BytesLike, string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setContenthash",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setDNSRecords",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setInterface",
    values: [BytesLike, BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setName",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setPubkey",
    values: [BytesLike, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setText",
    values: [BytesLike, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setZonehash",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "text",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(functionFragment: "zonehash", values: [BytesLike]): string;

  decodeFunctionResult(functionFragment: "ABI", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "addr", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "authorisations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "clearDNSZone",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "contenthash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "dnsRecord", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "hasDNSRecords",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "interfaceImplementer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "multicall", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pubkey", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setABI", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setAddr", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setAuthorisation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setContenthash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDNSRecords",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setName", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setPubkey", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setText", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setZonehash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "text", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "zonehash", data: BytesLike): Result;

  events: {
    "ABIChanged(bytes32,uint256)": EventFragment;
    "AddrChanged(bytes32,address)": EventFragment;
    "AddressChanged(bytes32,uint256,bytes)": EventFragment;
    "AuthorisationChanged(bytes32,address,address,bool)": EventFragment;
    "ContenthashChanged(bytes32,bytes)": EventFragment;
    "DNSRecordChanged(bytes32,bytes,uint16,bytes)": EventFragment;
    "DNSRecordDeleted(bytes32,bytes,uint16)": EventFragment;
    "DNSZoneCleared(bytes32)": EventFragment;
    "DNSZonehashChanged(bytes32,bytes,bytes)": EventFragment;
    "InterfaceChanged(bytes32,bytes4,address)": EventFragment;
    "NameChanged(bytes32,string)": EventFragment;
    "PubkeyChanged(bytes32,bytes32,bytes32)": EventFragment;
    "TextChanged(bytes32,string,string)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ABIChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AddrChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AddressChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AuthorisationChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ContenthashChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DNSRecordChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DNSRecordDeleted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DNSZoneCleared"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DNSZonehashChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "InterfaceChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NameChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PubkeyChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TextChanged"): EventFragment;
}

export type ABIChangedEvent = TypedEvent<
  [string, BigNumber],
  { node: string; contentType: BigNumber }
>;

export type ABIChangedEventFilter = TypedEventFilter<ABIChangedEvent>;

export type AddrChangedEvent = TypedEvent<
  [string, string],
  { node: string; a: string }
>;

export type AddrChangedEventFilter = TypedEventFilter<AddrChangedEvent>;

export type AddressChangedEvent = TypedEvent<
  [string, BigNumber, string],
  { node: string; coinType: BigNumber; newAddress: string }
>;

export type AddressChangedEventFilter = TypedEventFilter<AddressChangedEvent>;

export type AuthorisationChangedEvent = TypedEvent<
  [string, string, string, boolean],
  { node: string; owner: string; target: string; isAuthorised: boolean }
>;

export type AuthorisationChangedEventFilter =
  TypedEventFilter<AuthorisationChangedEvent>;

export type ContenthashChangedEvent = TypedEvent<
  [string, string],
  { node: string; hash: string }
>;

export type ContenthashChangedEventFilter =
  TypedEventFilter<ContenthashChangedEvent>;

export type DNSRecordChangedEvent = TypedEvent<
  [string, string, number, string],
  { node: string; name: string; resource: number; record: string }
>;

export type DNSRecordChangedEventFilter =
  TypedEventFilter<DNSRecordChangedEvent>;

export type DNSRecordDeletedEvent = TypedEvent<
  [string, string, number],
  { node: string; name: string; resource: number }
>;

export type DNSRecordDeletedEventFilter =
  TypedEventFilter<DNSRecordDeletedEvent>;

export type DNSZoneClearedEvent = TypedEvent<[string], { node: string }>;

export type DNSZoneClearedEventFilter = TypedEventFilter<DNSZoneClearedEvent>;

export type DNSZonehashChangedEvent = TypedEvent<
  [string, string, string],
  { node: string; lastzonehash: string; zonehash: string }
>;

export type DNSZonehashChangedEventFilter =
  TypedEventFilter<DNSZonehashChangedEvent>;

export type InterfaceChangedEvent = TypedEvent<
  [string, string, string],
  { node: string; interfaceID: string; implementer: string }
>;

export type InterfaceChangedEventFilter =
  TypedEventFilter<InterfaceChangedEvent>;

export type NameChangedEvent = TypedEvent<
  [string, string],
  { node: string; name: string }
>;

export type NameChangedEventFilter = TypedEventFilter<NameChangedEvent>;

export type PubkeyChangedEvent = TypedEvent<
  [string, string, string],
  { node: string; x: string; y: string }
>;

export type PubkeyChangedEventFilter = TypedEventFilter<PubkeyChangedEvent>;

export type TextChangedEvent = TypedEvent<
  [string, string, string],
  { node: string; indexedKey: string; key: string }
>;

export type TextChangedEventFilter = TypedEventFilter<TextChangedEvent>;

export interface PublicResolver extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PublicResolverInterface;

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
    ABI(
      node: BytesLike,
      contentTypes: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber, string]>;

    "addr(bytes32)"(
      node: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    "addr(bytes32,uint256)"(
      node: BytesLike,
      coinType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    authorisations(
      arg0: BytesLike,
      arg1: string,
      arg2: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    clearDNSZone(
      node: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    contenthash(node: BytesLike, overrides?: CallOverrides): Promise<[string]>;

    dnsRecord(
      node: BytesLike,
      name: BytesLike,
      resource: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    hasDNSRecords(
      node: BytesLike,
      name: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    interfaceImplementer(
      node: BytesLike,
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    multicall(
      data: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    name(node: BytesLike, overrides?: CallOverrides): Promise<[string]>;

    pubkey(
      node: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string, string] & { x: string; y: string }>;

    setABI(
      node: BytesLike,
      contentType: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "setAddr(bytes32,uint256,bytes)"(
      node: BytesLike,
      coinType: BigNumberish,
      a: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "setAddr(bytes32,address)"(
      node: BytesLike,
      a: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setAuthorisation(
      node: BytesLike,
      target: string,
      isAuthorised: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setContenthash(
      node: BytesLike,
      hash: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setDNSRecords(
      node: BytesLike,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setInterface(
      node: BytesLike,
      interfaceID: BytesLike,
      implementer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setName(
      node: BytesLike,
      name: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setPubkey(
      node: BytesLike,
      x: BytesLike,
      y: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setText(
      node: BytesLike,
      key: string,
      value: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setZonehash(
      node: BytesLike,
      hash: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    text(
      node: BytesLike,
      key: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    zonehash(node: BytesLike, overrides?: CallOverrides): Promise<[string]>;
  };

  ABI(
    node: BytesLike,
    contentTypes: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[BigNumber, string]>;

  "addr(bytes32)"(node: BytesLike, overrides?: CallOverrides): Promise<string>;

  "addr(bytes32,uint256)"(
    node: BytesLike,
    coinType: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  authorisations(
    arg0: BytesLike,
    arg1: string,
    arg2: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  clearDNSZone(
    node: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  contenthash(node: BytesLike, overrides?: CallOverrides): Promise<string>;

  dnsRecord(
    node: BytesLike,
    name: BytesLike,
    resource: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  hasDNSRecords(
    node: BytesLike,
    name: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  interfaceImplementer(
    node: BytesLike,
    interfaceID: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  multicall(
    data: BytesLike[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  name(node: BytesLike, overrides?: CallOverrides): Promise<string>;

  pubkey(
    node: BytesLike,
    overrides?: CallOverrides
  ): Promise<[string, string] & { x: string; y: string }>;

  setABI(
    node: BytesLike,
    contentType: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "setAddr(bytes32,uint256,bytes)"(
    node: BytesLike,
    coinType: BigNumberish,
    a: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "setAddr(bytes32,address)"(
    node: BytesLike,
    a: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setAuthorisation(
    node: BytesLike,
    target: string,
    isAuthorised: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setContenthash(
    node: BytesLike,
    hash: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setDNSRecords(
    node: BytesLike,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setInterface(
    node: BytesLike,
    interfaceID: BytesLike,
    implementer: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setName(
    node: BytesLike,
    name: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setPubkey(
    node: BytesLike,
    x: BytesLike,
    y: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setText(
    node: BytesLike,
    key: string,
    value: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setZonehash(
    node: BytesLike,
    hash: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceID: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  text(
    node: BytesLike,
    key: string,
    overrides?: CallOverrides
  ): Promise<string>;

  zonehash(node: BytesLike, overrides?: CallOverrides): Promise<string>;

  callStatic: {
    ABI(
      node: BytesLike,
      contentTypes: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber, string]>;

    "addr(bytes32)"(
      node: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    "addr(bytes32,uint256)"(
      node: BytesLike,
      coinType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    authorisations(
      arg0: BytesLike,
      arg1: string,
      arg2: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    clearDNSZone(node: BytesLike, overrides?: CallOverrides): Promise<void>;

    contenthash(node: BytesLike, overrides?: CallOverrides): Promise<string>;

    dnsRecord(
      node: BytesLike,
      name: BytesLike,
      resource: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    hasDNSRecords(
      node: BytesLike,
      name: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    interfaceImplementer(
      node: BytesLike,
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    multicall(data: BytesLike[], overrides?: CallOverrides): Promise<string[]>;

    name(node: BytesLike, overrides?: CallOverrides): Promise<string>;

    pubkey(
      node: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string, string] & { x: string; y: string }>;

    setABI(
      node: BytesLike,
      contentType: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "setAddr(bytes32,uint256,bytes)"(
      node: BytesLike,
      coinType: BigNumberish,
      a: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "setAddr(bytes32,address)"(
      node: BytesLike,
      a: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setAuthorisation(
      node: BytesLike,
      target: string,
      isAuthorised: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    setContenthash(
      node: BytesLike,
      hash: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setDNSRecords(
      node: BytesLike,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setInterface(
      node: BytesLike,
      interfaceID: BytesLike,
      implementer: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setName(
      node: BytesLike,
      name: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setPubkey(
      node: BytesLike,
      x: BytesLike,
      y: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setText(
      node: BytesLike,
      key: string,
      value: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setZonehash(
      node: BytesLike,
      hash: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    text(
      node: BytesLike,
      key: string,
      overrides?: CallOverrides
    ): Promise<string>;

    zonehash(node: BytesLike, overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "ABIChanged(bytes32,uint256)"(
      node?: BytesLike | null,
      contentType?: BigNumberish | null
    ): ABIChangedEventFilter;
    ABIChanged(
      node?: BytesLike | null,
      contentType?: BigNumberish | null
    ): ABIChangedEventFilter;

    "AddrChanged(bytes32,address)"(
      node?: BytesLike | null,
      a?: null
    ): AddrChangedEventFilter;
    AddrChanged(node?: BytesLike | null, a?: null): AddrChangedEventFilter;

    "AddressChanged(bytes32,uint256,bytes)"(
      node?: BytesLike | null,
      coinType?: null,
      newAddress?: null
    ): AddressChangedEventFilter;
    AddressChanged(
      node?: BytesLike | null,
      coinType?: null,
      newAddress?: null
    ): AddressChangedEventFilter;

    "AuthorisationChanged(bytes32,address,address,bool)"(
      node?: BytesLike | null,
      owner?: string | null,
      target?: string | null,
      isAuthorised?: null
    ): AuthorisationChangedEventFilter;
    AuthorisationChanged(
      node?: BytesLike | null,
      owner?: string | null,
      target?: string | null,
      isAuthorised?: null
    ): AuthorisationChangedEventFilter;

    "ContenthashChanged(bytes32,bytes)"(
      node?: BytesLike | null,
      hash?: null
    ): ContenthashChangedEventFilter;
    ContenthashChanged(
      node?: BytesLike | null,
      hash?: null
    ): ContenthashChangedEventFilter;

    "DNSRecordChanged(bytes32,bytes,uint16,bytes)"(
      node?: BytesLike | null,
      name?: null,
      resource?: null,
      record?: null
    ): DNSRecordChangedEventFilter;
    DNSRecordChanged(
      node?: BytesLike | null,
      name?: null,
      resource?: null,
      record?: null
    ): DNSRecordChangedEventFilter;

    "DNSRecordDeleted(bytes32,bytes,uint16)"(
      node?: BytesLike | null,
      name?: null,
      resource?: null
    ): DNSRecordDeletedEventFilter;
    DNSRecordDeleted(
      node?: BytesLike | null,
      name?: null,
      resource?: null
    ): DNSRecordDeletedEventFilter;

    "DNSZoneCleared(bytes32)"(
      node?: BytesLike | null
    ): DNSZoneClearedEventFilter;
    DNSZoneCleared(node?: BytesLike | null): DNSZoneClearedEventFilter;

    "DNSZonehashChanged(bytes32,bytes,bytes)"(
      node?: BytesLike | null,
      lastzonehash?: null,
      zonehash?: null
    ): DNSZonehashChangedEventFilter;
    DNSZonehashChanged(
      node?: BytesLike | null,
      lastzonehash?: null,
      zonehash?: null
    ): DNSZonehashChangedEventFilter;

    "InterfaceChanged(bytes32,bytes4,address)"(
      node?: BytesLike | null,
      interfaceID?: BytesLike | null,
      implementer?: null
    ): InterfaceChangedEventFilter;
    InterfaceChanged(
      node?: BytesLike | null,
      interfaceID?: BytesLike | null,
      implementer?: null
    ): InterfaceChangedEventFilter;

    "NameChanged(bytes32,string)"(
      node?: BytesLike | null,
      name?: null
    ): NameChangedEventFilter;
    NameChanged(node?: BytesLike | null, name?: null): NameChangedEventFilter;

    "PubkeyChanged(bytes32,bytes32,bytes32)"(
      node?: BytesLike | null,
      x?: null,
      y?: null
    ): PubkeyChangedEventFilter;
    PubkeyChanged(
      node?: BytesLike | null,
      x?: null,
      y?: null
    ): PubkeyChangedEventFilter;

    "TextChanged(bytes32,string,string)"(
      node?: BytesLike | null,
      indexedKey?: string | null,
      key?: null
    ): TextChangedEventFilter;
    TextChanged(
      node?: BytesLike | null,
      indexedKey?: string | null,
      key?: null
    ): TextChangedEventFilter;
  };

  estimateGas: {
    ABI(
      node: BytesLike,
      contentTypes: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "addr(bytes32)"(
      node: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "addr(bytes32,uint256)"(
      node: BytesLike,
      coinType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    authorisations(
      arg0: BytesLike,
      arg1: string,
      arg2: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    clearDNSZone(
      node: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    contenthash(node: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    dnsRecord(
      node: BytesLike,
      name: BytesLike,
      resource: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    hasDNSRecords(
      node: BytesLike,
      name: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    interfaceImplementer(
      node: BytesLike,
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    multicall(
      data: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    name(node: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    pubkey(node: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    setABI(
      node: BytesLike,
      contentType: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "setAddr(bytes32,uint256,bytes)"(
      node: BytesLike,
      coinType: BigNumberish,
      a: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "setAddr(bytes32,address)"(
      node: BytesLike,
      a: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setAuthorisation(
      node: BytesLike,
      target: string,
      isAuthorised: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setContenthash(
      node: BytesLike,
      hash: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setDNSRecords(
      node: BytesLike,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setInterface(
      node: BytesLike,
      interfaceID: BytesLike,
      implementer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setName(
      node: BytesLike,
      name: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setPubkey(
      node: BytesLike,
      x: BytesLike,
      y: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setText(
      node: BytesLike,
      key: string,
      value: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setZonehash(
      node: BytesLike,
      hash: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    text(
      node: BytesLike,
      key: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    zonehash(node: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    ABI(
      node: BytesLike,
      contentTypes: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "addr(bytes32)"(
      node: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "addr(bytes32,uint256)"(
      node: BytesLike,
      coinType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    authorisations(
      arg0: BytesLike,
      arg1: string,
      arg2: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    clearDNSZone(
      node: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    contenthash(
      node: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    dnsRecord(
      node: BytesLike,
      name: BytesLike,
      resource: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    hasDNSRecords(
      node: BytesLike,
      name: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    interfaceImplementer(
      node: BytesLike,
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    multicall(
      data: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    name(
      node: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pubkey(
      node: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setABI(
      node: BytesLike,
      contentType: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "setAddr(bytes32,uint256,bytes)"(
      node: BytesLike,
      coinType: BigNumberish,
      a: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "setAddr(bytes32,address)"(
      node: BytesLike,
      a: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setAuthorisation(
      node: BytesLike,
      target: string,
      isAuthorised: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setContenthash(
      node: BytesLike,
      hash: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setDNSRecords(
      node: BytesLike,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setInterface(
      node: BytesLike,
      interfaceID: BytesLike,
      implementer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setName(
      node: BytesLike,
      name: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setPubkey(
      node: BytesLike,
      x: BytesLike,
      y: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setText(
      node: BytesLike,
      key: string,
      value: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setZonehash(
      node: BytesLike,
      hash: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    text(
      node: BytesLike,
      key: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    zonehash(
      node: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
