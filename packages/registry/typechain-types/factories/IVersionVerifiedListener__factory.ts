/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IVersionVerifiedListener,
  IVersionVerifiedListenerInterface,
} from "../IVersionVerifiedListener";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "patchNodeId",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "packageLocationHash",
        type: "bytes32",
      },
    ],
    name: "onVersionVerified",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IVersionVerifiedListener__factory {
  static readonly abi = _abi;
  static createInterface(): IVersionVerifiedListenerInterface {
    return new utils.Interface(_abi) as IVersionVerifiedListenerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IVersionVerifiedListener {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IVersionVerifiedListener;
  }
}