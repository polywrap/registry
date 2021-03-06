/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IDomainRegistryLink,
  IDomainRegistryLinkInterface,
} from "../IDomainRegistryLink";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "domainRegistryNode",
        type: "bytes32",
      },
    ],
    name: "getPolywrapOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IDomainRegistryLink__factory {
  static readonly abi = _abi;
  static createInterface(): IDomainRegistryLinkInterface {
    return new utils.Interface(_abi) as IDomainRegistryLinkInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IDomainRegistryLink {
    return new Contract(address, _abi, signerOrProvider) as IDomainRegistryLink;
  }
}
