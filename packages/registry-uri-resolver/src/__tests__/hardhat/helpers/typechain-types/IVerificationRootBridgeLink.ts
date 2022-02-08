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
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface IVerificationRootBridgeLinkInterface extends utils.Interface {
  functions: {
    "receiveVerificationRoot(bytes32)": FunctionFragment;
    "relayVerificationRoot(bytes32)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "receiveVerificationRoot",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "relayVerificationRoot",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "receiveVerificationRoot",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "relayVerificationRoot",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IVerificationRootBridgeLink extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IVerificationRootBridgeLinkInterface;

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
    receiveVerificationRoot(
      verificationRoot: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    relayVerificationRoot(
      verificationRoot: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  receiveVerificationRoot(
    verificationRoot: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  relayVerificationRoot(
    verificationRoot: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    receiveVerificationRoot(
      verificationRoot: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    relayVerificationRoot(
      verificationRoot: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    receiveVerificationRoot(
      verificationRoot: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    relayVerificationRoot(
      verificationRoot: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    receiveVerificationRoot(
      verificationRoot: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    relayVerificationRoot(
      verificationRoot: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}