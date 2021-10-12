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

interface AddrResolverInterface extends ethers.utils.Interface {
  functions: {
    "addr(bytes32)": FunctionFragment;
    "setAddr(bytes32,uint256,bytes)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "addr", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "setAddr",
    values: [BytesLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "addr", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setAddr", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;

  events: {
    "AddrChanged(bytes32,address)": EventFragment;
    "AddressChanged(bytes32,uint256,bytes)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AddrChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AddressChanged"): EventFragment;
}

export type AddrChangedEvent = TypedEvent<
  [string, string] & { node: string; a: string }
>;

export type AddressChangedEvent = TypedEvent<
  [string, BigNumber, string] & {
    node: string;
    coinType: BigNumber;
    newAddress: string;
  }
>;

export class AddrResolver extends BaseContract {
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

  interface: AddrResolverInterface;

  functions: {
    "addr(bytes32)"(
      node: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    "addr(bytes32,uint256)"(
      node: BytesLike,
      coinType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

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

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  "addr(bytes32)"(node: BytesLike, overrides?: CallOverrides): Promise<string>;

  "addr(bytes32,uint256)"(
    node: BytesLike,
    coinType: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

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

  supportsInterface(
    interfaceID: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    "addr(bytes32)"(
      node: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    "addr(bytes32,uint256)"(
      node: BytesLike,
      coinType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

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

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    "AddrChanged(bytes32,address)"(
      node?: BytesLike | null,
      a?: null
    ): TypedEventFilter<[string, string], { node: string; a: string }>;

    AddrChanged(
      node?: BytesLike | null,
      a?: null
    ): TypedEventFilter<[string, string], { node: string; a: string }>;

    "AddressChanged(bytes32,uint256,bytes)"(
      node?: BytesLike | null,
      coinType?: null,
      newAddress?: null
    ): TypedEventFilter<
      [string, BigNumber, string],
      { node: string; coinType: BigNumber; newAddress: string }
    >;

    AddressChanged(
      node?: BytesLike | null,
      coinType?: null,
      newAddress?: null
    ): TypedEventFilter<
      [string, BigNumber, string],
      { node: string; coinType: BigNumber; newAddress: string }
    >;
  };

  estimateGas: {
    "addr(bytes32)"(
      node: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "addr(bytes32,uint256)"(
      node: BytesLike,
      coinType: BigNumberish,
      overrides?: CallOverrides
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

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    "addr(bytes32)"(
      node: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "addr(bytes32,uint256)"(
      node: BytesLike,
      coinType: BigNumberish,
      overrides?: CallOverrides
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

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
