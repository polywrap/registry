import { BigNumber, ContractTransaction, Signer } from "ethers";
import { BytesLike, formatBytes32String, namehash } from "ethers/lib/utils";

import { RegistryContractAddresses } from "./RegistryContractAddresses";
import {
  PolywrapRegistry__factory,
  PolywrapRegistry as PolywrapRegistryContract,
} from "../typechain";
import { parseVersionString } from "./parseVersionString";
import { calculateVersionNodeId } from "./calculateVersionNodeId";
import { OrganizationInfo } from "./OrganizationInfo";
import { PackageInfo } from "./PackageInfo";
import { calculateVersionBytes } from "./calculateVersionBytes";
import { VersionInfo } from ".";

export class PolywrapRegistry {
  constructor(signer: Signer, contractAddresses: RegistryContractAddresses) {
    this.signer = signer;
    this.polywrapRegistry = PolywrapRegistry__factory.connect(
      contractAddresses.polywrapRegistry,
      signer
    );
  }

  signer: Signer;
  private polywrapRegistry: PolywrapRegistryContract;

  async publishVersion(
    packageId: BytesLike,
    version: string,
    packageLocation: string
  ): Promise<ContractTransaction> {
    const [versionIdentifiers, buildMetadata] = parseVersionString(version);
    const versionBytes = calculateVersionBytes(packageId, versionIdentifiers);

    return this.polywrapRegistry.publishVersion(
      packageId,
      versionBytes,
      formatBytes32String(buildMetadata),
      packageLocation
    );
  }

  async claimOrganizationOwnership(
    domainRegistry: "ens",
    domain: string,
    newOrganizationOwner: string
  ): Promise<ContractTransaction> {
    const domainRegistryNode = namehash(domain);

    return await this.polywrapRegistry.claimOrganizationOwnership(
      domainRegistry,
      domainRegistryNode,
      newOrganizationOwner
    );
  }

  async domainOwner(domainRegistry: "ens", domain: string): Promise<string> {
    const domainRegistryNode = namehash(domain);

    return await this.polywrapRegistry.domainOwner(
      domainRegistry,
      domainRegistryNode
    );
  }

  async setOrganizationOwner(
    organizationId: BytesLike,
    owner: string
  ): Promise<ContractTransaction> {
    return await this.polywrapRegistry.setOrganizationOwner(
      organizationId,
      owner
    );
  }

  async setOrganizationController(
    organizationId: BytesLike,
    controller: string
  ): Promise<ContractTransaction> {
    return await this.polywrapRegistry.setOrganizationController(
      organizationId,
      controller
    );
  }

  async setOrganizationOwnerAndController(
    organizationId: BytesLike,
    owner: string,
    controller: string
  ): Promise<ContractTransaction> {
    return await this.polywrapRegistry.setOrganizationOwnerAndController(
      organizationId,
      owner,
      controller
    );
  }

  async registerPackage(
    organizationId: BytesLike,
    packageName: string,
    packageOwner: string
  ): Promise<ContractTransaction> {
    return await this.polywrapRegistry.registerPackage(
      organizationId,
      packageName,
      packageOwner
    );
  }

  async setPackageOwner(
    packageId: BytesLike,
    owner: string
  ): Promise<ContractTransaction> {
    return await this.polywrapRegistry.setPackageOwner(packageId, owner);
  }

  async setPackageController(
    packageId: BytesLike,
    controller: string
  ): Promise<ContractTransaction> {
    return await this.polywrapRegistry.setPackageController(
      packageId,
      controller
    );
  }

  async setPackageOwnerAndController(
    packageId: BytesLike,
    owner: string,
    controller: string
  ): Promise<ContractTransaction> {
    return await this.polywrapRegistry.setPackageOwnerAndController(
      packageId,
      owner,
      controller
    );
  }

  async organizationOwner(organizationId: BytesLike): Promise<string> {
    return await this.polywrapRegistry.organizationOwner(organizationId);
  }

  async organizationController(organizationId: BytesLike): Promise<string> {
    return await this.polywrapRegistry.organizationController(organizationId);
  }

  async organizationExists(organizationId: BytesLike): Promise<boolean> {
    return await this.polywrapRegistry.organizationExists(organizationId);
  }

  async organization(organizationId: BytesLike): Promise<OrganizationInfo> {
    return await this.polywrapRegistry.organization(organizationId);
  }

  async organizationIds(start: number, count: number): Promise<BytesLike[]> {
    return await this.polywrapRegistry.organizationIds(start, count);
  }

  async organizationCount(): Promise<BigNumber> {
    return await this.polywrapRegistry.organizationCount();
  }

  async packageIds(
    organizationId: BytesLike,
    start: number,
    count: number
  ): Promise<BytesLike[]> {
    return await this.polywrapRegistry.packageIds(organizationId, start, count);
  }

  async packageCount(packageId: BytesLike): Promise<BigNumber> {
    return await this.polywrapRegistry.packageCount(packageId);
  }

  async packageExists(packageId: BytesLike): Promise<boolean> {
    return await this.polywrapRegistry.packageExists(packageId);
  }

  async packageOwner(packageId: BytesLike): Promise<string> {
    return await this.polywrapRegistry.packageOwner(packageId);
  }

  async packageController(packageId: BytesLike): Promise<string> {
    return await this.polywrapRegistry.packageController(packageId);
  }

  async package(packageId: BytesLike): Promise<PackageInfo> {
    return await this.polywrapRegistry.package(packageId);
  }

  async version(
    packageId: BytesLike,
    partialVersion: string
  ): Promise<VersionInfo> {
    const nodeId = calculateVersionNodeId(packageId, partialVersion);

    return await this.polywrapRegistry.version(nodeId);
  }

  async versionIds(
    packageId: BytesLike,
    start: BigNumber,
    count: BigNumber
  ): Promise<BytesLike[]> {
    return await this.polywrapRegistry.versionIds(packageId, start, count);
  }

  async versionCount(packageId: BytesLike): Promise<BigNumber> {
    return await this.polywrapRegistry.versionCount(packageId);
  }

  async latestReleaseNode(
    packageId: BytesLike,
    partialVersion: string
  ): Promise<BytesLike> {
    const nodeId = calculateVersionNodeId(packageId, partialVersion);

    return await this.polywrapRegistry.latestReleaseNode(nodeId);
  }

  async latestPrereleaseNode(
    packageId: BytesLike,
    partialVersion: string
  ): Promise<BytesLike> {
    const nodeId = calculateVersionNodeId(packageId, partialVersion);

    return await this.polywrapRegistry.latestPrereleaseNode(nodeId);
  }

  async latestReleaseLocation(
    packageId: BytesLike,
    partialVersion: string
  ): Promise<string> {
    const nodeId = calculateVersionNodeId(packageId, partialVersion);

    return await this.polywrapRegistry.latestReleaseLocation(nodeId);
  }

  async latestPrereleaseLocation(
    packageId: BytesLike,
    partialVersion: string
  ): Promise<string> {
    const nodeId = calculateVersionNodeId(packageId, partialVersion);

    return await this.polywrapRegistry.latestPrereleaseLocation(nodeId);
  }
}
