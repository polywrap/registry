import { BigNumber, ContractTransaction, Signer } from "ethers";
import { BytesLike, formatBytes32String, namehash } from "ethers/lib/utils";

import { RegistryContractAddresses } from "./RegistryContractAddresses";
import { parseVersionString } from "./parseVersionString";
import { calculateVersionNodeId } from "./calculateVersionNodeId";
import { PackageInfo } from "./types/PackageInfo";
import { calculateVersionBytes } from "./calculateVersionBytes";
import {
  PolywrapRegistryV1__factory,
  PolywrapRegistryV1 as PolywrapRegistryContract,
} from "../typechain-types";
import { OrganizationInfo, VersionInfo } from ".";
import { VersionNodeMetadata } from "./types/VersionNodeMetadata";

export class PolywrapRegistry {
  constructor(signer: Signer, contractAddresses: RegistryContractAddresses) {
    this.signer = signer;
    this.polywrapRegistry = PolywrapRegistryV1__factory.connect(
      contractAddresses.polywrapRegistry,
      signer
    );
  }

  signer: Signer;
  private polywrapRegistry: PolywrapRegistryContract;

  publishVersion(
    packageId: BytesLike,
    version: string,
    packageLocation: string
  ): Promise<ContractTransaction> {
    const buildMetadata = parseVersionString(version).buildMetadata;
    const versionBytes = calculateVersionBytes(version);

    return this.polywrapRegistry.publishVersion(
      packageId,
      versionBytes,
      formatBytes32String(buildMetadata),
      packageLocation
    );
  }

  claimOrganizationOwnership(
    domainRegistry: "ens",
    domain: string,
    newOrganizationOwner: string
  ): Promise<ContractTransaction> {
    const domainRegistryNode = namehash(domain);

    return this.polywrapRegistry.claimOrganizationOwnership(
      formatBytes32String(domainRegistry),
      domainRegistryNode,
      newOrganizationOwner
    );
  }

  domainOwner(domainRegistry: "ens", domain: string): Promise<string> {
    const domainRegistryNode = namehash(domain);

    return this.polywrapRegistry.domainOwner(
      domainRegistry,
      domainRegistryNode
    );
  }

  transferOrganizationOwnership(
    organizationId: BytesLike,
    newOwner: string
  ): Promise<ContractTransaction> {
    return this.polywrapRegistry.transferOrganizationOwnership(
      organizationId,
      newOwner
    );
  }

  setOrganizationController(
    organizationId: BytesLike,
    controller: string
  ): Promise<ContractTransaction> {
    return this.polywrapRegistry.setOrganizationController(
      organizationId,
      controller
    );
  }

  transferOrganizationControl(
    organizationId: BytesLike,
    newController: string
  ): Promise<ContractTransaction> {
    return this.polywrapRegistry.transferOrganizationControl(
      organizationId,
      newController
    );
  }

  registerPackage(
    organizationId: BytesLike,
    packageName: string,
    packageOwner: string,
    packageController: string
  ): Promise<ContractTransaction> {
    return this.polywrapRegistry.registerPackage(
      organizationId,
      packageName,
      packageOwner,
      packageController
    );
  }

  setPackageOwner(
    packageId: BytesLike,
    newOwner: string
  ): Promise<ContractTransaction> {
    return this.polywrapRegistry.setPackageOwner(packageId, newOwner);
  }

  transferPackageOwnership(
    packageId: BytesLike,
    newOwner: string
  ): Promise<ContractTransaction> {
    return this.polywrapRegistry.transferPackageOwnership(packageId, newOwner);
  }

  setPackageController(
    packageId: BytesLike,
    newController: string
  ): Promise<ContractTransaction> {
    return this.polywrapRegistry.setPackageController(packageId, newController);
  }

  transferPackageControl(
    packageId: BytesLike,
    newController: string
  ): Promise<ContractTransaction> {
    return this.polywrapRegistry.transferPackageControl(
      packageId,
      newController
    );
  }

  organizationOwner(organizationId: BytesLike): Promise<string> {
    return this.polywrapRegistry.organizationOwner(organizationId);
  }

  organizationController(organizationId: BytesLike): Promise<string> {
    return this.polywrapRegistry.organizationController(organizationId);
  }

  organizationExists(organizationId: BytesLike): Promise<boolean> {
    return this.polywrapRegistry.organizationExists(organizationId);
  }

  organization(organizationId: BytesLike): Promise<OrganizationInfo> {
    return this.polywrapRegistry.organization(organizationId);
  }

  organizationIds(start: number, count: number): Promise<BytesLike[]> {
    return this.polywrapRegistry.organizationIds(start, count);
  }

  organizationCount(): Promise<BigNumber> {
    return this.polywrapRegistry.organizationCount();
  }

  packageIds(
    organizationId: BytesLike,
    start: number,
    count: number
  ): Promise<BytesLike[]> {
    return this.polywrapRegistry.packageIds(organizationId, start, count);
  }

  packageCount(packageId: BytesLike): Promise<BigNumber> {
    return this.polywrapRegistry.packageCount(packageId);
  }

  packageExists(packageId: BytesLike): Promise<boolean> {
    return this.polywrapRegistry.packageExists(packageId);
  }

  packageOwner(packageId: BytesLike): Promise<string> {
    return this.polywrapRegistry.packageOwner(packageId);
  }

  packageController(packageId: BytesLike): Promise<string> {
    return this.polywrapRegistry.packageController(packageId);
  }

  packageOrganizationId(packageId: BytesLike): Promise<BytesLike> {
    return this.polywrapRegistry.packageOrganizationId(packageId);
  }

  package(packageId: BytesLike): Promise<PackageInfo> {
    return this.polywrapRegistry.package(packageId);
  }

  versionExists(
    packageId: BytesLike,
    partialVersion: string
  ): Promise<boolean> {
    const nodeId = calculateVersionNodeId(packageId, partialVersion);

    return this.polywrapRegistry.versionExists(nodeId);
  }

  versionLocation(packageId: BytesLike, version: string): Promise<string> {
    const nodeId = calculateVersionNodeId(packageId, version);

    return this.polywrapRegistry.versionLocation(nodeId);
  }

  versionMetadata(
    packageId: BytesLike,
    version: string
  ): Promise<VersionNodeMetadata> {
    const nodeId = calculateVersionNodeId(packageId, version);

    return this.polywrapRegistry.versionMetadata(nodeId);
  }

  versionBuildMetadata(packageId: BytesLike, version: string): Promise<string> {
    const nodeId = calculateVersionNodeId(packageId, version);

    return this.polywrapRegistry.versionBuildMetadata(nodeId);
  }

  version(packageId: BytesLike, partialVersion: string): Promise<VersionInfo> {
    const nodeId = calculateVersionNodeId(packageId, partialVersion);

    return this.polywrapRegistry.version(nodeId);
  }

  versionIds(
    packageId: BytesLike,
    start: BigNumber,
    count: BigNumber
  ): Promise<BytesLike[]> {
    return this.polywrapRegistry.versionIds(packageId, start, count);
  }

  versionCount(packageId: BytesLike): Promise<BigNumber> {
    return this.polywrapRegistry.versionCount(packageId);
  }

  latestReleaseNode(
    packageId: BytesLike,
    partialVersion: string
  ): Promise<BytesLike> {
    const nodeId = calculateVersionNodeId(packageId, partialVersion);

    return this.polywrapRegistry.latestReleaseNode(nodeId);
  }

  latestPrereleaseNode(
    packageId: BytesLike,
    partialVersion: string
  ): Promise<BytesLike> {
    const nodeId = calculateVersionNodeId(packageId, partialVersion);

    return this.polywrapRegistry.latestPrereleaseNode(nodeId);
  }

  latestReleaseLocation(
    packageId: BytesLike,
    partialVersion: string
  ): Promise<string> {
    const nodeId = calculateVersionNodeId(packageId, partialVersion);

    return this.polywrapRegistry.latestReleaseLocation(nodeId);
  }

  latestPrereleaseLocation(
    packageId: BytesLike,
    partialVersion: string
  ): Promise<string> {
    const nodeId = calculateVersionNodeId(packageId, partialVersion);

    return this.polywrapRegistry.latestPrereleaseLocation(nodeId);
  }
}
