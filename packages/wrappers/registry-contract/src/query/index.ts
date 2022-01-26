import {
  Ethereum_Query,
  Input_domainOwner,
  Input_domainRegistryLinks,
  Input_latestPrereleaseLocation,
  Input_latestPrereleaseNode,
  Input_latestReleaseLocation,
  Input_latestReleaseNode,
  Input_organizationController,
  Input_organizationCount,
  Input_organizationExists,
  Input_organizationOwner,
  Input_owner,
  Input_getPackage,
  Input_packageController,
  Input_packageCount,
  Input_packageExists,
  Input_packageOrganizationId,
  Input_packageOwner,
  Input_version,
  Input_versionBuildMetadata,
  Input_versionCount,
  Input_versionExists,
  Input_versionLocation,
  PackageInfo,
  PackageVersion,
  OrganizationInfo,
  Input_organization,
  Input_versionMetadata,
  VersionNodeMetadata
} from "./w3";
import { BigInt } from '@web3api/wasm-as';

export function domainOwner(input: Input_domainOwner): string {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function domainOwner(bytes32 domainRegistry, bytes32 domainRegistryNode) public view returns (address)",
    args: [input.domainRegistry, input.domainRegistryNode]
  });

  return result;
}

export function domainRegistryLinks(input: Input_domainRegistryLinks): string {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function domainRegistryLinks(bytes32) public view returns (address)",
    args: [input.domainRegistry]
  });

  return result;
}

export function latestPrereleaseLocation(input: Input_latestPrereleaseLocation): string {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function latestPrereleaseLocation(bytes32 versionNodeId) public view returns (string)",
    args: [input.versionNodeId]
  });

  return result;
}

export function latestPrereleaseNode(input: Input_latestPrereleaseNode): string {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function latestPrereleaseNode(bytes32 versionNodeId) public view returns (bytes32)",
    args: [input.versionNodeId]
  });

  return result;
}

export function latestReleaseLocation(input: Input_latestReleaseLocation): string {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function latestReleaseLocation(bytes32 versionNodeId) public view returns (string)",
    args: [input.versionNodeId]
  });

  return result;
}

export function latestReleaseNode(input: Input_latestReleaseNode): string {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function latestReleaseNode(bytes32 versionNodeId) public view returns (bytes32)",
    args: [input.versionNodeId]
  });

  return result;
}

export function organization(input: Input_organization): OrganizationInfo {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function organization(bytes32 organizationId) public view returns (booladdressaddress)",
    args: [input.organizationId]
  });

  const results: string[] = result.split(",");

  return {
    exists: results[0] === "true",
    owner: results[1],
    controller: results[2]
  };
}

export function organizationController(input: Input_organizationController): string {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function organizationController(bytes32 organizationId) public view returns (address)",
    args: [input.organizationId]
  });

  return result;
}

export function organizationCount(input: Input_organizationCount): BigInt {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function organizationCount() public view returns (uint256)",
    args: []
  });

  return BigInt.fromString(result);
}

export function organizationExists(input: Input_organizationExists): bool {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function organizationExists(bytes32 organizationId) public view returns (bool)",
    args: [input.organizationId]
  });

  return result === "true";
}

export function organizationOwner(input: Input_organizationOwner): string {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function organizationOwner(bytes32 organizationId) public view returns (address)",
    args: [input.organizationId]
  });

  return result;
}

export function owner(input: Input_owner): string {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function owner() public view returns (address)",
    args: []
  });

  return result;
}

export function getPackage(input: Input_getPackage): PackageInfo {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function package(bytes32 packageId) public view returns (bool, address, address, bytes32)",
    args: [input.packageId],
  });
  const results: string[] = result.split(",");

  return {
    exists: results[0] === "true",
    owner: results[1],
    controller: results[2],
    organizationId: results[3],
  };
}

export function packageController(input: Input_packageController): string {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function packageController(bytes32 packageId) public view returns (address)",
    args: [input.packageId]
  });

  return result;
}

export function packageCount(input: Input_packageCount): BigInt {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function packageCount(bytes32 organizationId) public view returns (uint256)",
    args: [input.organizationId]
  });

  return BigInt.fromString(result);
}

export function packageExists(input: Input_packageExists): bool {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function packageExists(bytes32 packageId) public view returns (bool)",
    args: [input.packageId]
  });

  return result === "true";
}

export function packageOrganizationId(input: Input_packageOrganizationId): string {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function packageOrganizationId(bytes32 packageId) public view returns (bytes32)",
    args: [input.packageId]
  });

  return result;
}

export function packageOwner(input: Input_packageOwner): string {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function packageOwner(bytes32 packageId) public view returns (address)",
    args: [input.packageId]
  });

  return result;
}

export function version(input: Input_version): PackageVersion {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function version(bytes32 nodeId) public view returns (bool, bool, uint8, uint256, uint256, bytes32, string)",
    args: [input.nodeId]
  });

  const results = result.split(",");

  return {
    exists: results[0] === "true",
    leaf: results[1] === "true",
    level: parseInt(results[2]) as u8,
    latestPrereleaseVersion: BigInt.fromString(results[3]),
    latestReleaseVersion: BigInt.fromString(results[4]),
    buildMetadata: results[5],
    location: results[6],
  };
}

export function versionBuildMetadata(input: Input_versionBuildMetadata): string {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function versionBuildMetadata(bytes32 nodeId) public view returns (bytes32)",
    args: [input.nodeId]
  });

  return result;
}

export function versionMetadata(input: Input_versionMetadata): VersionNodeMetadata {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function versionMetadata(bytes32 nodeId) public view returns (bool, bool, uint8, uint256, uint256)",
    args: [input.nodeId]
  });
  
  const results = result.split(",");

  return {
    exists: results[0] === "true",
    leaf: results[1] === "true",
    level: parseInt(results[2]) as u8,
    latestPrereleaseVersion: BigInt.fromString(results[3]),
    latestReleaseVersion: BigInt.fromString(results[4]),
  };
}

export function versionCount(input: Input_versionCount): BigInt {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function versionCount(bytes32 packageId) public view returns (uint256)",
    args: [input.packageId]
  });

  return BigInt.fromString(result);
}

export function versionExists(input: Input_versionExists): bool {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function versionExists(bytes32 nodeId) public view returns (bool)",
    args: [input.nodeId]
  });

  return !!result;
}

export function versionLocation(input: Input_versionLocation): string {
  const result = Ethereum_Query.callContractView({
    connection: input.connection,
    address: input.address,
    method: "function versionLocation(bytes32 nodeId) public view returns (string)",
    args: [input.nodeId]
  });

  return result;
}
