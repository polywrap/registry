import { Web3ApiClient } from "@web3api/client-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ContractTransaction } from "ethers";
import { registryPlugin } from "../../..";
import { JsonRpcProvider } from "@ethersproject/providers";
import { MaybeError } from "./MaybeError";
import { RegistryContractAddresses } from "./RegistryContractAddresses";
import { OrganizationInfo } from "../../../w3";

export class PolywrapRegistry {
  constructor(
    provider: JsonRpcProvider,
    signer: string,
    contractAddresses: RegistryContractAddresses
  ) {
    this.provider = provider;
    this.contractAddresses = contractAddresses;
    this.polywrapClient = new Web3ApiClient({
      plugins: [
        {
          uri: "ens/ethereum.web3api.eth",
          plugin: ethereumPlugin({
            networks: {
              testnet: {
                provider: provider,
                signer: signer,
              },
              rinkeby: {
                provider: process.env.RINKEBY_PROVIDER as string,
              },
            },
          }),
        },
        {
          uri: "ens/registry.web3api.eth",
          plugin: registryPlugin({
            addresses: {
              localhost: contractAddresses.polywrapRegistry,
            },
          }),
        },
      ],
    });
  }

  polywrapClient: Web3ApiClient;
  provider: JsonRpcProvider;
  contractAddresses: RegistryContractAddresses;

  // publishVersion(
  //   packageId: BytesLike,
  //   version: string,
  //   packageLocation: string
  // ): Promise<MaybeError<ContractTransaction>> {
  //   const buildMetadata = parseVersionString(version).buildMetadata;
  //   const versionBytes = calculateVersionBytes(version);

  //   return handleContractError(
  //     this.polywrapRegistry.publishVersion(
  //       packageId,
  //       versionBytes,
  //       formatBytes32String(buildMetadata),
  //       packageLocation
  //     )
  //   );
  // }

  async claimOrganizationOwnership(
    domainRegistry: string,
    domain: string,
    newOwner: string
  ): Promise<MaybeError<ContractTransaction>> {
    const result = await this.polywrapClient.invoke<{ hash: string }>({
      uri: "ens/registry.web3api.eth",
      module: "mutation",
      method: "claimOrganizationOwnership",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
        address: this.contractAddresses.polywrapRegistry,
        domainRegistry: domainRegistry,
        domain: domain,
        newOwner: newOwner,
      },
    });

    if (result.error) {
      return [result.error, undefined];
    }

    const transaction = await this.provider.getTransaction(
      (result.data as { hash: string }).hash
    );

    return [undefined, transaction];
  }

  // domainOwner(domainRegistry: "ens", domain: string): Promise<string> {
  //   const domainRegistryNode = namehash(domain);

  //   return this.polywrapRegistry.domainOwner(
  //     formatBytes32String(domainRegistry),
  //     domainRegistryNode
  //   );
  // }

  async transferOrganizationOwnership(
    organizationId: string,
    newOwner: string
  ): Promise<MaybeError<ContractTransaction>> {
    const result = await this.polywrapClient.invoke<{ hash: string }>({
      uri: "ens/registry.web3api.eth",
      module: "mutation",
      method: "transferOrganizationOwnership",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
        address: this.contractAddresses.polywrapRegistry,
        organizationId,
        newOwner,
      },
    });

    if (result.error) {
      return [result.error, undefined];
    }

    const transaction = await this.provider.getTransaction(
      (result.data as { hash: string }).hash
    );

    return [undefined, transaction];
  }

  async setOrganizationController(
    organizationId: string,
    newController: string
  ): Promise<MaybeError<ContractTransaction>> {
    const result = await this.polywrapClient.invoke<{ hash: string }>({
      uri: "ens/registry.web3api.eth",
      module: "mutation",
      method: "setOrganizationController",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
        address: this.contractAddresses.polywrapRegistry,
        organizationId,
        newController,
      },
    });

    if (result.error) {
      return [result.error, undefined];
    }

    const transaction = await this.provider.getTransaction(
      (result.data as { hash: string }).hash
    );

    return [undefined, transaction];
  }

  async transferOrganizationControl(
    organizationId: string,
    newController: string
  ): Promise<MaybeError<ContractTransaction>> {
    const result = await this.polywrapClient.invoke<{ hash: string }>({
      uri: "ens/registry.web3api.eth",
      module: "mutation",
      method: "transferOrganizationControl",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
        address: this.contractAddresses.polywrapRegistry,
        organizationId,
        newController,
      },
    });

    if (result.error) {
      return [result.error, undefined];
    }

    const transaction = await this.provider.getTransaction(
      (result.data as { hash: string }).hash
    );

    return [undefined, transaction];
  }

  // registerPackage(
  //   organizationId: BytesLike,
  //   packageName: string,
  //   packageOwner: string,
  //   packageController: string
  // ): Promise<MaybeError<ContractTransaction>> {
  //   return handleContractError(
  //     this.polywrapRegistry.registerPackage(
  //       organizationId,
  //       formatBytes32String(packageName),
  //       packageOwner,
  //       packageController
  //     )
  //   );
  // }

  // setPackageOwner(
  //   packageId: BytesLike,
  //   newOwner: string
  // ): Promise<MaybeError<ContractTransaction>> {
  //   return handleContractError(
  //     this.polywrapRegistry.setPackageOwner(packageId, newOwner)
  //   );
  // }

  // transferPackageOwnership(
  //   packageId: BytesLike,
  //   newOwner: string
  // ): Promise<MaybeError<ContractTransaction>> {
  //   return handleContractError(
  //     this.polywrapRegistry.transferPackageOwnership(packageId, newOwner)
  //   );
  // }

  // setPackageController(
  //   packageId: BytesLike,
  //   newController: string
  // ): Promise<MaybeError<ContractTransaction>> {
  //   return handleContractError(
  //     this.polywrapRegistry.setPackageController(packageId, newController)
  //   );
  // }

  // transferPackageControl(
  //   packageId: BytesLike,
  //   newController: string
  // ): Promise<MaybeError<ContractTransaction>> {
  //   return handleContractError(
  //     this.polywrapRegistry.transferPackageControl(packageId, newController)
  //   );
  // }

  async organizationOwner(organizationId: string): Promise<string> {
    const result = await this.polywrapClient.invoke<string>({
      uri: "ens/registry.web3api.eth",
      module: "query",
      method: "organizationOwner",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
        address: this.contractAddresses.polywrapRegistry,
        organizationId: organizationId,
      },
    });

    if (result.error) {
      throw result.error;
    }

    return result.data as string;
  }

  async organizationController(organizationId: string): Promise<string> {
    const result = await this.polywrapClient.invoke<string>({
      uri: "ens/registry.web3api.eth",
      module: "query",
      method: "organizationController",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
        address: this.contractAddresses.polywrapRegistry,
        organizationId: organizationId,
      },
    });

    if (result.error) {
      throw result.error;
    }

    return result.data as string;
  }

  async organizationExists(organizationId: string): Promise<boolean> {
    const result = await this.polywrapClient.invoke<boolean>({
      uri: "ens/registry.web3api.eth",
      module: "query",
      method: "organizationExists",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
        address: this.contractAddresses.polywrapRegistry,
        organizationId: organizationId,
      },
    });

    if (result.error) {
      throw result.error;
    }

    return result.data as boolean;
  }

  async organization(organizationId: string): Promise<OrganizationInfo> {
    const result = await this.polywrapClient.invoke<OrganizationInfo>({
      uri: "ens/registry.web3api.eth",
      module: "query",
      method: "organization",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
        address: this.contractAddresses.polywrapRegistry,
        organizationId: organizationId,
      },
    });

    if (result.error) {
      throw result.error;
    }

    return result.data as OrganizationInfo;
  }

  // packageExists(packageId: BytesLike): Promise<boolean> {
  //   return this.polywrapRegistry.packageExists(packageId);
  // }

  // packageOwner(packageId: BytesLike): Promise<string> {
  //   return this.polywrapRegistry.packageOwner(packageId);
  // }

  // packageController(packageId: BytesLike): Promise<string> {
  //   return this.polywrapRegistry.packageController(packageId);
  // }

  // packageOrganizationId(packageId: BytesLike): Promise<BytesLike> {
  //   return this.polywrapRegistry.packageOrganizationId(packageId);
  // }

  // package(packageId: BytesLike): Promise<PackageInfo> {
  //   return this.polywrapRegistry.package(packageId);
  // }

  // versionExists(
  //   packageId: BytesLike,
  //   partialVersion: string
  // ): Promise<boolean> {
  //   const nodeId = calculateVersionNodeId(packageId, partialVersion);

  //   return this.polywrapRegistry.versionExists(nodeId);
  // }

  // versionLocation(packageId: BytesLike, version: string): Promise<string> {
  //   const nodeId = calculateVersionNodeId(packageId, version);

  //   return this.polywrapRegistry.versionLocation(nodeId);
  // }

  // versionMetadata(
  //   packageId: BytesLike,
  //   version: string
  // ): Promise<VersionNodeMetadata> {
  //   const nodeId = calculateVersionNodeId(packageId, version);

  //   return this.polywrapRegistry.versionMetadata(nodeId);
  // }

  // versionBuildMetadata(packageId: BytesLike, version: string): Promise<string> {
  //   const nodeId = calculateVersionNodeId(packageId, version);

  //   return this.polywrapRegistry.versionBuildMetadata(nodeId);
  // }

  // version(packageId: BytesLike, partialVersion: string): Promise<VersionInfo> {
  //   const nodeId = calculateVersionNodeId(packageId, partialVersion);

  //   return this.polywrapRegistry.version(nodeId);
  // }

  // versionIds(
  //   packageId: BytesLike,
  //   start: BigNumber,
  //   count: BigNumber
  // ): Promise<BytesLike[]> {
  //   return this.polywrapRegistry.versionIds(packageId, start, count);
  // }

  // versionCount(packageId: BytesLike): Promise<BigNumber> {
  //   return this.polywrapRegistry.versionCount(packageId);
  // }

  // latestReleaseNode(
  //   packageId: BytesLike,
  //   partialVersion: string
  // ): Promise<BytesLike> {
  //   const nodeId = calculateVersionNodeId(packageId, partialVersion);

  //   return this.polywrapRegistry.latestReleaseNode(nodeId);
  // }

  // latestPrereleaseNode(
  //   packageId: BytesLike,
  //   partialVersion: string
  // ): Promise<BytesLike> {
  //   const nodeId = calculateVersionNodeId(packageId, partialVersion);

  //   return this.polywrapRegistry.latestPrereleaseNode(nodeId);
  // }

  // latestReleaseLocation(
  //   packageId: BytesLike,
  //   partialVersion: string
  // ): Promise<string> {
  //   const nodeId = calculateVersionNodeId(packageId, partialVersion);

  //   return this.polywrapRegistry.latestReleaseLocation(nodeId);
  // }

  // latestPrereleaseLocation(
  //   packageId: BytesLike,
  //   partialVersion: string
  // ): Promise<string> {
  //   const nodeId = calculateVersionNodeId(packageId, partialVersion);

  //   return this.polywrapRegistry.latestPrereleaseLocation(nodeId);
  // }
}
