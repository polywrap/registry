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

interface TextResolverInterface extends ethers.utils.Interface {
  functions: {
    "setText(bytes32,string,string)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "text(bytes32,string)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "setText",
    values: [BytesLike, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "text",
    values: [BytesLike, string]
  ): string;

  decodeFunctionResult(functionFragment: "setText", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "text", data: BytesLike): Result;

  events: {
    "TextChanged(bytes32,string,string)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "TextChanged"): EventFragment;
}

export type TextChangedEvent = TypedEvent<
  [string, string, string] & { node: string; indexedKey: string; key: string }
>;

export class TextResolver extends BaseContract {
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

  interface: TextResolverInterface;

  functions: {
    setText(
      node: BytesLike,
      key: string,
      value: string,
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
  };

  setText(
    node: BytesLike,
    key: string,
    value: string,
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

  callStatic: {
    setText(
      node: BytesLike,
      key: string,
      value: string,
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
  };

  filters: {
    "TextChanged(bytes32,string,string)"(
      node?: BytesLike | null,
      indexedKey?: string | null,
      key?: null
    ): TypedEventFilter<
      [string, string, string],
      { node: string; indexedKey: string; key: string }
    >;

    TextChanged(
      node?: BytesLike | null,
      indexedKey?: string | null,
      key?: null
    ): TypedEventFilter<
      [string, string, string],
      { node: string; indexedKey: string; key: string }
    >;
  };

  estimateGas: {
    setText(
      node: BytesLike,
      key: string,
      value: string,
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
  };

  populateTransaction: {
    setText(
      node: BytesLike,
      key: string,
      value: string,
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
  };
}
