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

export interface DNSResolverInterface extends utils.Interface {
  functions: {
    "clearDNSZone(bytes32)": FunctionFragment;
    "dnsRecord(bytes32,bytes32,uint16)": FunctionFragment;
    "hasDNSRecords(bytes32,bytes32)": FunctionFragment;
    "setDNSRecords(bytes32,bytes)": FunctionFragment;
    "setZonehash(bytes32,bytes)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "zonehash(bytes32)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "clearDNSZone",
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
    functionFragment: "setDNSRecords",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setZonehash",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "zonehash", values: [BytesLike]): string;

  decodeFunctionResult(
    functionFragment: "clearDNSZone",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "dnsRecord", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "hasDNSRecords",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDNSRecords",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setZonehash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "zonehash", data: BytesLike): Result;

  events: {
    "DNSRecordChanged(bytes32,bytes,uint16,bytes)": EventFragment;
    "DNSRecordDeleted(bytes32,bytes,uint16)": EventFragment;
    "DNSZoneCleared(bytes32)": EventFragment;
    "DNSZonehashChanged(bytes32,bytes,bytes)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DNSRecordChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DNSRecordDeleted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DNSZoneCleared"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DNSZonehashChanged"): EventFragment;
}

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

export interface DNSResolver extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: DNSResolverInterface;

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
    clearDNSZone(
      node: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

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

    setDNSRecords(
      node: BytesLike,
      data: BytesLike,
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

    zonehash(node: BytesLike, overrides?: CallOverrides): Promise<[string]>;
  };

  clearDNSZone(
    node: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

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

  setDNSRecords(
    node: BytesLike,
    data: BytesLike,
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

  zonehash(node: BytesLike, overrides?: CallOverrides): Promise<string>;

  callStatic: {
    clearDNSZone(node: BytesLike, overrides?: CallOverrides): Promise<void>;

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

    setDNSRecords(
      node: BytesLike,
      data: BytesLike,
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

    zonehash(node: BytesLike, overrides?: CallOverrides): Promise<string>;
  };

  filters: {
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
  };

  estimateGas: {
    clearDNSZone(
      node: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

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

    setDNSRecords(
      node: BytesLike,
      data: BytesLike,
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

    zonehash(node: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    clearDNSZone(
      node: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
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

    setDNSRecords(
      node: BytesLike,
      data: BytesLike,
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

    zonehash(
      node: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
