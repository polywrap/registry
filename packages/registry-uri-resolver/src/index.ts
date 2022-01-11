/* eslint-disable import/no-extraneous-dependencies */
import { query } from "./resolvers";
import { manifest, Query, Ethereum_Query } from "./w3";

import {
  Client,
  Plugin,
  PluginPackageManifest,
  PluginFactory,
} from "@web3api/core-js";
import { ethers } from "ethers";
import { getAddress } from "@ethersproject/address";
import {
  calculatePackageId,
  calculateVersionNodeId,
} from "@polywrap/registry-js";

export type Address = string;

export interface Addresses {
  [network: string]: Address;
}

export interface PluginConfig {
  addresses?: Addresses;
}

export class RegistryUriResolverPlugin extends Plugin {
  public static defaultRegistryAddress =
    "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";

  constructor(private _config: PluginConfig) {
    super();
  }

  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public static isENSDomain(domain: string): boolean {
    return ethers.utils.isValidName(domain) && domain.indexOf(".eth") !== -1;
  }

  public getModules(
    client: Client
  ): {
    query: Query.Module;
  } {
    return {
      query: query(this, client),
    };
  }

  public setAddresses(addresses: Addresses): void {
    this._config.addresses = {};

    for (const network of Object.keys(addresses)) {
      this._config.addresses[network] = getAddress(addresses[network]);
    }
  }

  public async resolveToCID(domain: string, client: Client): Promise<string> {
    const registryAbi = {
      latestPrereleaseLocation:
        "function latestPrereleaseLocation(bytes32 versionNodeId) external view returns (string location)",
    };

    let registryAddress = RegistryUriResolverPlugin.defaultRegistryAddress;

    // Remove the ENS URI scheme & authority
    domain = domain.replace("w3://", "");
    domain = domain.replace("ens/", "");

    // Check for non-default network
    let network = "mainnet";
    const hasNetwork = /^[A-Za-z0-9]+\//i.exec(domain);
    if (hasNetwork) {
      network = domain.substring(0, domain.indexOf("/"));

      // Remove the network from the domain URI's path
      domain = domain.replace(network + "/", "");

      // Lowercase only
      network = network.toLowerCase();

      // Check if we have a custom address configured
      // for this network
      if (this._config.addresses && this._config.addresses[network]) {
        registryAddress = this._config.addresses[network];
        console.log("gbbbbbb", registryAddress);
      }
    }

    const callContractView = async (
      address: string,
      method: string,
      args: string[],
      networkNameOrChainId?: string
    ): Promise<string> => {
      const { data, error } = await Ethereum_Query.callContractView(
        {
          address,
          method,
          args,
          connection: networkNameOrChainId
            ? {
                networkNameOrChainId,
              }
            : undefined,
        },
        client
      );

      if (error) {
        throw error;
      }

      if (data) {
        if (typeof data !== "string") {
          throw Error(
            `Malformed data returned from Ethereum.callContractView: ${data}`
          );
        }

        return data;
      }

      throw Error(
        `Ethereum.callContractView returned nothing.\nData: ${data}\nError: ${error}`
      );
    };

    const match = /^@([^/]+)\/([^/]+)\/([^/]+)/g.exec(domain);
    if (!match || match.length !== 4) {
      throw Error();
    }

    const organizationName = match[1];
    const packageName = match[2];
    const partialVersion = match[3];

    const packageId = calculatePackageId("ens", organizationName, packageName);

    const nodeId = calculateVersionNodeId(packageId, partialVersion).toString();

    // Get the CID stored at this domain
    let hash;
    try {
      hash = await callContractView(
        registryAddress,
        registryAbi.latestPrereleaseLocation,
        [nodeId],
        network
      );
      console.log("hash", hash);
      return hash;
    } catch (e) {
      console.log("nodeId", e);
      throw Error();
    }
  }
}

export const registryUriResolverPlugin: PluginFactory<PluginConfig> = (
  opts: PluginConfig
) => {
  return {
    factory: () => new RegistryUriResolverPlugin(opts),
    manifest: manifest,
  };
};
export const plugin = registryUriResolverPlugin;
