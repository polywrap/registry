import { Api, Web3ApiClient, Web3ApiClientConfig } from "@web3api/client-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ContractTransaction } from "ethers";
import { registryPlugin } from "../../..";
import { JsonRpcProvider } from "@ethersproject/providers";
import { MaybeError } from "./MaybeError";
import { RegistryContractAddresses } from "./RegistryContractAddresses";
import { OrganizationInfo, PackageInfo, PackageMetadata } from "../../../w3";

export class PolywrapRegistry {
  constructor() {
    this.polywrapClient = new Web3ApiClient();
  }

  polywrapClient: Web3ApiClient;
  provider: JsonRpcProvider;
  contractAddresses: RegistryContractAddresses;

  connect(
    provider: JsonRpcProvider,
    signer: string,
    contractAddresses: RegistryContractAddresses
  ): PolywrapRegistry {
    this.provider = provider;
    this.contractAddresses = contractAddresses;

    //Save cache to be reused later
    const apiCache = this.polywrapClient["_apiCache"];

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
              localhost: this.contractAddresses.polywrapRegistry,
            },
          }),
        },
      ],
    });

    const filteredCache = new Map<string, Api>();

    //Get cache without the plugins
    for (const key of apiCache.keys()) {
      const api = apiCache.get(key);

      if (!api["_plugin"]) {
        filteredCache.set(key, api);
      }
    }

    //Restore cache without the plugins
    this.polywrapClient["_apiCache"] = filteredCache;

    return this;
  }

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

  async registerPackage(
    organizationId: string,
    packageName: string,
    packageOwner: string,
    packageController: string
  ): Promise<MaybeError<ContractTransaction>> {
    const result = await this.polywrapClient.invoke<{ hash: string }>({
      uri: "ens/registry.web3api.eth",
      module: "mutation",
      method: "registerPackage",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
        address: this.contractAddresses.polywrapRegistry,
        organizationId,
        packageName,
        packageOwner,
        packageController,
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

  async setPackageOwner(
    packageId: string,
    newOwner: string
  ): Promise<MaybeError<ContractTransaction>> {
    const result = await this.polywrapClient.invoke<{ hash: string }>({
      uri: "ens/registry.web3api.eth",
      module: "mutation",
      method: "setPackageOwner",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
        address: this.contractAddresses.polywrapRegistry,
        packageId,
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

  async transferPackageOwnership(
    packageId: string,
    newOwner: string
  ): Promise<MaybeError<ContractTransaction>> {
    const result = await this.polywrapClient.invoke<{ hash: string }>({
      uri: "ens/registry.web3api.eth",
      module: "mutation",
      method: "transferPackageOwnership",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
        address: this.contractAddresses.polywrapRegistry,
        packageId,
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

  async setPackageController(
    packageId: string,
    newController: string
  ): Promise<MaybeError<ContractTransaction>> {
    const result = await this.polywrapClient.invoke<{ hash: string }>({
      uri: "ens/registry.web3api.eth",
      module: "mutation",
      method: "setPackageController",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
        address: this.contractAddresses.polywrapRegistry,
        packageId,
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

  async transferPackageControl(
    packageId: string,
    newController: string
  ): Promise<MaybeError<ContractTransaction>> {
    const result = await this.polywrapClient.invoke<{ hash: string }>({
      uri: "ens/registry.web3api.eth",
      module: "mutation",
      method: "transferPackageControl",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
        address: this.contractAddresses.polywrapRegistry,
        packageId,
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

  async packageExists(packageId: string): Promise<boolean> {
    const result = await this.polywrapClient.invoke<boolean>({
      uri: "ens/registry.web3api.eth",
      module: "query",
      method: "packageExists",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
        address: this.contractAddresses.polywrapRegistry,
        packageId,
      },
    });

    if (result.error) {
      throw result.error;
    }

    return result.data as boolean;
  }

  async packageOwner(packageId: string): Promise<string> {
    const result = await this.polywrapClient.invoke<string>({
      uri: "ens/registry.web3api.eth",
      module: "query",
      method: "packageOwner",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
        address: this.contractAddresses.polywrapRegistry,
        packageId,
      },
    });

    if (result.error) {
      throw result.error;
    }

    return result.data as string;
  }

  async packageController(packageId: string): Promise<string> {
    const result = await this.polywrapClient.invoke<string>({
      uri: "ens/registry.web3api.eth",
      module: "query",
      method: "packageController",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
        address: this.contractAddresses.polywrapRegistry,
        packageId,
      },
    });

    if (result.error) {
      throw result.error;
    }

    return result.data as string;
  }

  async packageOrganizationId(packageId: string): Promise<string> {
    const result = await this.polywrapClient.invoke<string>({
      uri: "ens/registry.web3api.eth",
      module: "query",
      method: "packageOrganizationId",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
        address: this.contractAddresses.polywrapRegistry,
        packageId,
      },
    });

    if (result.error) {
      throw result.error;
    }

    return result.data as string;
  }

  async getPackage(packageId: string): Promise<PackageMetadata> {
    const result = await this.polywrapClient.invoke<PackageMetadata>({
      uri: "ens/registry.web3api.eth",
      module: "query",
      method: "getPackage",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
        address: this.contractAddresses.polywrapRegistry,
        packageId,
      },
    });

    if (result.error) {
      throw result.error;
    }

    return result.data as PackageMetadata;
  }

  async buildPackageInfo(
    domainRegistry: string,
    domain: string,
    packageName: string
  ): Promise<PackageInfo> {
    const result = await this.polywrapClient.invoke<PackageInfo>({
      uri: "ens/registry.web3api.eth",
      module: "query",
      method: "buildPackageInfo",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
        address: this.contractAddresses.polywrapRegistry,
        domainRegistry,
        domain,
        packageName,
      },
    });

    if (result.error) {
      throw result.error;
    }

    return result.data as PackageInfo;
  }

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
