import { mutation, query } from "./resolvers";
import {
  manifest,
  Query,
  RegistryContract_Query,
  RegistryContract_Mutation,
  Ethereum_TxResponse,
  Mutation,
  OrganizationInfo,
  PackageInfo,
  VersionInfo,
  VersionNodeMetadata,
  PackageMetadata,
} from "./w3";

import {
  Client,
  Plugin,
  PluginPackageManifest,
  PluginFactory,
} from "@web3api/core-js";
import {
  calculateOrganizationId,
  calculatePackageId,
  calculatePatchNodeId,
  calculateVersionBytes,
  calculateVersionNodeId,
  parseVersionString,
} from "./helpers";
import { getAddress } from "@ethersproject/address";
import { formatBytes32String, namehash } from "ethers/lib/utils";
import { solidityKeccak256 } from "ethers/lib/utils";

export type Address = string;

export interface Addresses {
  [network: string]: Address;
}

export interface PluginConfig {
  addresses?: Addresses;
}

export class RegistryPlugin extends Plugin {
  public static defaultRegistryAddress =
    "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";

  constructor(private _config: PluginConfig) {
    super();
  }

  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public getModules(
    client: Client
  ): {
    query: Query.Module;
    mutation: Mutation.Module;
  } {
    return {
      query: query(this, client),
      mutation: mutation(this, client),
    };
  }

  async domainOwner(
    input: Query.Input_domainOwner,
    client: Client
  ): Promise<string> {
    const domainRegistryNode = namehash(input.domainName);

    const { data, error } = await RegistryContract_Query.domainOwner(
      {
        connection: input.connection,
        address: input.address,
        domainRegistry: formatBytes32String(input.domainRegistry),
        domainRegistryNode,
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract call`);
    }

    return data;
  }

  async latestReleaseNode(
    input: Query.Input_latestReleaseNode,
    client: Client
  ): Promise<string> {
    const versionNodeId = calculateVersionNodeId(
      input.packageId,
      input.partialVersion
    );

    const { data, error } = await RegistryContract_Query.latestReleaseNode(
      {
        connection: input.connection,
        address: input.address,
        versionNodeId: versionNodeId.toString(),
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract call`);
    }

    return data;
  }

  async latestPrereleaseNode(
    input: Query.Input_latestPrereleaseNode,
    client: Client
  ): Promise<string> {
    const versionNodeId = calculateVersionNodeId(
      input.packageId,
      input.partialVersion
    );

    const { data, error } = await RegistryContract_Query.latestPrereleaseNode(
      {
        connection: input.connection,
        address: input.address,
        versionNodeId: versionNodeId.toString(),
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract call`);
    }

    return data;
  }

  async latestReleaseLocation(
    input: Query.Input_latestReleaseLocation,
    client: Client
  ): Promise<string> {
    const versionNodeId = calculateVersionNodeId(
      input.packageId,
      input.partialVersion
    );

    const { data, error } = await RegistryContract_Query.latestReleaseLocation(
      {
        connection: input.connection,
        address: input.address,
        versionNodeId: versionNodeId.toString(),
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract call`);
    }

    return data;
  }

  async latestPrereleaseLocation(
    input: Query.Input_latestPrereleaseLocation,
    client: Client
  ): Promise<string> {
    const versionNodeId = calculateVersionNodeId(
      input.packageId,
      input.partialVersion
    );

    const {
      data,
      error,
    } = await RegistryContract_Query.latestPrereleaseLocation(
      {
        connection: input.connection,
        address: input.address,
        versionNodeId: versionNodeId.toString(),
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract call`);
    }

    return data;
  }

  async organization(
    input: Query.Input_organization,
    client: Client
  ): Promise<OrganizationInfo> {
    const { data, error } = await RegistryContract_Query.organization(
      {
        connection: input.connection,
        address: input.address,
        organizationId: input.organizationId,
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract call`);
    }

    return data;
  }

  async organizationExists(
    input: Query.Input_organizationExists,
    client: Client
  ): Promise<boolean> {
    const { data, error } = await RegistryContract_Query.organizationExists(
      {
        connection: input.connection,
        address: input.address,
        organizationId: input.organizationId,
      },
      client
    );

    if (error) {
      throw error;
    }

    if (data === undefined) {
      throw Error(`No data returned from contract call`);
    }

    return data;
  }

  async organizationOwner(
    input: Query.Input_organizationOwner,
    client: Client
  ): Promise<string> {
    const { data, error } = await RegistryContract_Query.organizationOwner(
      {
        connection: input.connection,
        address: input.address,
        organizationId: input.organizationId,
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract call`);
    }

    return data;
  }

  async organizationController(
    input: Query.Input_organizationController,
    client: Client
  ): Promise<string> {
    const { data, error } = await RegistryContract_Query.organizationController(
      {
        connection: input.connection,
        address: input.address,
        organizationId: input.organizationId,
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract call`);
    }

    return data;
  }

  async getPackage(
    input: Query.Input_getPackage,
    client: Client
  ): Promise<PackageMetadata> {
    const { data, error } = await RegistryContract_Query.getPackage(
      {
        connection: input.connection,
        address: input.address,
        packageId: input.packageId,
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract call`);
    }

    return data;
  }

  async packageExists(
    input: Query.Input_packageExists,
    client: Client
  ): Promise<boolean> {
    const { data, error } = await RegistryContract_Query.packageExists(
      {
        connection: input.connection,
        address: input.address,
        packageId: input.packageId,
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract call`);
    }

    return data;
  }

  async packageOrganizationId(
    input: Query.Input_packageOrganizationId,
    client: Client
  ): Promise<string> {
    const { data, error } = await RegistryContract_Query.packageOrganizationId(
      {
        connection: input.connection,
        address: input.address,
        packageId: input.packageId,
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract call`);
    }

    return data;
  }

  async packageOwner(
    input: Query.Input_packageOwner,
    client: Client
  ): Promise<string> {
    const { data, error } = await RegistryContract_Query.packageOwner(
      {
        connection: input.connection,
        address: input.address,
        packageId: input.packageId,
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract call`);
    }

    return data;
  }

  async packageController(
    input: Query.Input_packageController,
    client: Client
  ): Promise<string> {
    const { data, error } = await RegistryContract_Query.packageController(
      {
        connection: input.connection,
        address: input.address,
        packageId: input.packageId,
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract call`);
    }

    return data;
  }

  async version(
    input: Query.Input_version,
    client: Client
  ): Promise<VersionInfo> {
    const nodeId = calculateVersionNodeId(
      input.packageId,
      input.partialVersion
    );

    const { data, error } = await RegistryContract_Query.version(
      {
        connection: input.connection,
        address: input.address,
        nodeId: nodeId.toString(),
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract call`);
    }

    return data;
  }

  async versionExists(
    input: Query.Input_versionExists,
    client: Client
  ): Promise<boolean> {
    const nodeId = calculateVersionNodeId(
      input.packageId,
      input.partialVersion
    );

    const { data, error } = await RegistryContract_Query.versionExists(
      {
        connection: input.connection,
        address: input.address,
        nodeId: nodeId.toString(),
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract call`);
    }

    return data;
  }

  async versionMetadata(
    input: Query.Input_versionMetadata,
    client: Client
  ): Promise<VersionNodeMetadata> {
    const nodeId = calculateVersionNodeId(
      input.packageId,
      input.partialVersion
    );

    const { data, error } = await RegistryContract_Query.versionMetadata(
      {
        connection: input.connection,
        address: input.address,
        nodeId: nodeId.toString(),
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract call`);
    }

    return data;
  }

  async versionBuildMetadata(
    input: Query.Input_versionBuildMetadata,
    client: Client
  ): Promise<string> {
    const nodeId = calculateVersionNodeId(input.packageId, input.version);

    const { data, error } = await RegistryContract_Query.versionBuildMetadata(
      {
        connection: input.connection,
        address: input.address,
        nodeId: nodeId.toString(),
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract call`);
    }

    return data;
  }

  async versionLocation(
    input: Query.Input_versionLocation,
    client: Client
  ): Promise<string> {
    const nodeId = calculateVersionNodeId(input.packageId, input.version);

    const { data, error } = await RegistryContract_Query.versionLocation(
      {
        connection: input.connection,
        address: input.address,
        nodeId: nodeId.toString(),
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract call`);
    }

    return data;
  }

  async calculatePackageInfo(
    input: Query.Input_calculatePackageInfo
  ): Promise<PackageInfo> {
    const domainRegistryNode = namehash(input.domainName);

    const organizationId = solidityKeccak256(
      ["bytes32", "bytes32"],
      [formatBytes32String(input.domainRegistry), domainRegistryNode]
    );
    const packageId = solidityKeccak256(
      ["bytes32", "bytes32"],
      [organizationId, formatBytes32String(input.packageName)]
    );

    return {
      organizationId,
      packageId,
      packageName: input.packageName,
    } as PackageInfo;
  }

  async calculateOrganizationId(
    input: Query.Input_calculateOrganizationId
  ): Promise<string> {
    return calculateOrganizationId(
      input.domainRegistry,
      input.domainName
    ).toString();
  }

  async calculatePackageId(
    input: Query.Input_calculatePackageId
  ): Promise<string> {
    return calculatePackageId(
      input.domainRegistry,
      input.domainName,
      input.packageName
    ).toString();
  }

  async calculateVersionNodeId(
    input: Query.Input_calculateVersionNodeId
  ): Promise<string> {
    return calculateVersionNodeId(
      input.packageId,
      input.partialVersion
    ).toString();
  }

  async calculatePatchNodeId(
    input: Query.Input_calculatePatchNodeId
  ): Promise<string> {
    return calculatePatchNodeId(
      input.packageId,
      input.partialVersion
    ).toString();
  }

  async claimOrganizationOwnership(
    input: Mutation.Input_claimOrganizationOwnership,
    client: Client
  ): Promise<Ethereum_TxResponse> {
    const domainRegistryNode = namehash(input.domainName);

    const {
      data,
      error,
    } = await RegistryContract_Mutation.claimOrganizationOwnership(
      {
        connection: input.connection,
        address: input.address,
        domainRegistry: formatBytes32String(input.domainRegistry),
        domainRegistryNode,
        newOwner: input.newOwner,
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract transaction`);
    }

    return data;
  }

  async publishVersion(
    input: Mutation.Input_publishVersion,
    client: Client
  ): Promise<Ethereum_TxResponse> {
    const buildMetadata = parseVersionString(input.version).buildMetadata;
    const versionBytes = calculateVersionBytes(input.version);

    const { data, error } = await RegistryContract_Mutation.publishVersion(
      {
        connection: input.connection,
        address: input.address,
        packageId: input.packageId,
        versionBytes: versionBytes,
        buildMetadata: formatBytes32String(buildMetadata),
        location: input.location,
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract transaction`);
    }

    return data;
  }

  async transferOrganizationOwnership(
    input: Mutation.Input_transferOrganizationOwnership,
    client: Client
  ): Promise<Ethereum_TxResponse> {
    const {
      data,
      error,
    } = await RegistryContract_Mutation.transferOrganizationOwnership(
      {
        connection: input.connection,
        address: input.address,
        organizationId: input.organizationId,
        newOwner: input.newOwner,
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract transaction`);
    }

    return data;
  }

  async setOrganizationController(
    input: Mutation.Input_setOrganizationController,
    client: Client
  ): Promise<Ethereum_TxResponse> {
    const {
      data,
      error,
    } = await RegistryContract_Mutation.setOrganizationController(
      {
        connection: input.connection,
        address: input.address,
        organizationId: input.organizationId,
        newController: input.newController,
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract transaction`);
    }

    return data;
  }

  async transferOrganizationControl(
    input: Mutation.Input_transferOrganizationControl,
    client: Client
  ): Promise<Ethereum_TxResponse> {
    const {
      data,
      error,
    } = await RegistryContract_Mutation.transferOrganizationControl(
      {
        connection: input.connection,
        address: input.address,
        organizationId: input.organizationId,
        newController: input.newController,
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract transaction`);
    }

    return data;
  }

  async registerPackage(
    input: Mutation.Input_registerPackage,
    client: Client
  ): Promise<Ethereum_TxResponse> {
    const { data, error } = await RegistryContract_Mutation.registerPackage(
      {
        connection: input.connection,
        address: input.address,
        organizationId: input.organizationId,
        packageName: formatBytes32String(input.packageName),
        packageOwner: input.packageOwner,
        packageController: input.packageController,
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract transaction`);
    }

    return data;
  }

  async setPackageOwner(
    input: Mutation.Input_setPackageOwner,
    client: Client
  ): Promise<Ethereum_TxResponse> {
    const { data, error } = await RegistryContract_Mutation.setPackageOwner(
      {
        connection: input.connection,
        address: input.address,
        packageId: input.packageId,
        newOwner: input.newOwner,
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract transaction`);
    }

    return data;
  }

  async transferPackageOwnership(
    input: Mutation.Input_transferPackageOwnership,
    client: Client
  ): Promise<Ethereum_TxResponse> {
    const {
      data,
      error,
    } = await RegistryContract_Mutation.transferPackageOwnership(
      {
        connection: input.connection,
        address: input.address,
        packageId: input.packageId,
        newOwner: input.newOwner,
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract transaction`);
    }

    return data;
  }

  async setPackageController(
    input: Mutation.Input_setPackageController,
    client: Client
  ): Promise<Ethereum_TxResponse> {
    const {
      data,
      error,
    } = await RegistryContract_Mutation.setPackageController(
      {
        connection: input.connection,
        address: input.address,
        packageId: input.packageId,
        newController: input.newController,
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract transaction`);
    }

    return data;
  }

  async transferPackageControl(
    input: Mutation.Input_transferPackageControl,
    client: Client
  ): Promise<Ethereum_TxResponse> {
    const {
      data,
      error,
    } = await RegistryContract_Mutation.transferPackageControl(
      {
        connection: input.connection,
        address: input.address,
        packageId: input.packageId,
        newController: input.newController,
      },
      client
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error(`No data returned from contract transaction`);
    }

    return data;
  }

  public setAddresses(addresses: Addresses): void {
    this._config.addresses = {};

    for (const network of Object.keys(addresses)) {
      this._config.addresses[network] = getAddress(addresses[network]);
    }
  }

  private getRegistryAddress(): string {
    return RegistryPlugin.defaultRegistryAddress;
  }
}

export const registryPlugin: PluginFactory<PluginConfig> = (
  opts: PluginConfig
) => {
  return {
    factory: () => new RegistryPlugin(opts),
    manifest: manifest,
  };
};
export const plugin = registryPlugin;
