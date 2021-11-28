/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  VersionResolverV1,
  VersionResolverV1Interface,
} from "../VersionResolverV1";

const _abi = [
  {
    inputs: [],
    name: "IdentifierNotReset",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidBuildMetadata",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidIdentifier",
    type: "error",
  },
  {
    inputs: [],
    name: "NodeNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyOrganizationController",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyOrganizationOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyPackageController",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyPackageOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "PackageAlreadyExists",
    type: "error",
  },
  {
    inputs: [],
    name: "ReleaseIdentifierMustBeNumeric",
    type: "error",
  },
  {
    inputs: [],
    name: "TooManyIdentifiers",
    type: "error",
  },
  {
    inputs: [],
    name: "VersionAlreadyPublished",
    type: "error",
  },
  {
    inputs: [],
    name: "VersionNotFullLength",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "organizationId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OrganizationClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "organizationId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "previousController",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newController",
        type: "address",
      },
    ],
    name: "OrganizationControllerChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "organizationId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OrganizationOwnerChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "packageId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "previousController",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newController",
        type: "address",
      },
    ],
    name: "PackageControllerChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "packageId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "PackageOwnerChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "organizationId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "packageId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "packageName",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "packageOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "packageController",
        type: "address",
      },
    ],
    name: "PackageRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "trustedVersionPublisher",
        type: "address",
      },
    ],
    name: "TrustedVersionPublisherSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "packageId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "versionNodeId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "versionBytes",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "buildMetadata",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "location",
        type: "string",
      },
    ],
    name: "VersionPublished",
    type: "event",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "versionNodeId",
        type: "bytes32",
      },
    ],
    name: "latestPrereleaseLocation",
    outputs: [
      {
        internalType: "string",
        name: "location",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "versionNodeId",
        type: "bytes32",
      },
    ],
    name: "latestPrereleaseNode",
    outputs: [
      {
        internalType: "bytes32",
        name: "nodeId",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "versionNodeId",
        type: "bytes32",
      },
    ],
    name: "latestReleaseLocation",
    outputs: [
      {
        internalType: "string",
        name: "location",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "versionNodeId",
        type: "bytes32",
      },
    ],
    name: "latestReleaseNode",
    outputs: [
      {
        internalType: "bytes32",
        name: "nodeId",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "organizationId",
        type: "bytes32",
      },
    ],
    name: "organization",
    outputs: [
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "controller",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "organizationId",
        type: "bytes32",
      },
    ],
    name: "organizationController",
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
  {
    inputs: [],
    name: "organizationCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "organizationId",
        type: "bytes32",
      },
    ],
    name: "organizationExists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "start",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    name: "organizationIds",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "organizationId",
        type: "bytes32",
      },
    ],
    name: "organizationOwner",
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
  {
    inputs: [],
    name: "owner",
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
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "packageId",
        type: "bytes32",
      },
    ],
    name: "package",
    outputs: [
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "controller",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "packageId",
        type: "bytes32",
      },
    ],
    name: "packageController",
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
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "organizationId",
        type: "bytes32",
      },
    ],
    name: "packageCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "packageId",
        type: "bytes32",
      },
    ],
    name: "packageExists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "organizationId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "start",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    name: "packageIds",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "packageId",
        type: "bytes32",
      },
    ],
    name: "packageOwner",
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
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "packageId",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "versionBytes",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "buildMetadata",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "location",
        type: "string",
      },
    ],
    name: "publishVersion",
    outputs: [
      {
        internalType: "bytes32",
        name: "nodeId",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "organizationId",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "packageName",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "packageOwner",
        type: "address",
      },
      {
        internalType: "address",
        name: "packageController",
        type: "address",
      },
    ],
    name: "registerPackage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "organizationId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "newController",
        type: "address",
      },
    ],
    name: "setOrganizationController",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "packageId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "newController",
        type: "address",
      },
    ],
    name: "setPackageController",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "packageId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "setPackageOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "organizationId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "newController",
        type: "address",
      },
    ],
    name: "transferOrganizationControl",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "organizationId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOrganizationOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "packageId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "newController",
        type: "address",
      },
    ],
    name: "transferPackageControl",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "packageId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferPackageOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "nodeId",
        type: "bytes32",
      },
    ],
    name: "version",
    outputs: [
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "leaf",
        type: "bool",
      },
      {
        internalType: "uint8",
        name: "level",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "latestPrereleaseVersion",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "latestReleaseVersion",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "buildMetadata",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "location",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "nodeId",
        type: "bytes32",
      },
    ],
    name: "versionBuildMetadata",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "packageId",
        type: "bytes32",
      },
    ],
    name: "versionCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "packageId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "start",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    name: "versionIds",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "nodeId",
        type: "bytes32",
      },
    ],
    name: "versionLocation",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "versionNodeId",
        type: "bytes32",
      },
    ],
    name: "versionMetadata",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "leaf",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "level",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "latestPrereleaseVersion",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "latestReleaseVersion",
            type: "uint256",
          },
        ],
        internalType: "struct VersionRegistryV1.NodeInfo",
        name: "nodeInfo",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class VersionResolverV1__factory {
  static readonly abi = _abi;
  static createInterface(): VersionResolverV1Interface {
    return new utils.Interface(_abi) as VersionResolverV1Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): VersionResolverV1 {
    return new Contract(address, _abi, signerOrProvider) as VersionResolverV1;
  }
}
