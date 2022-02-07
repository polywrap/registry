import {
  BlockchainsWithRegistry,
  RegistryContracts,
} from "@polywrap/registry-js";
import { ethers } from "ethers";
import process from "process";

export const getPolywrapRegistryContracts = (
  provider: ethers.providers.Provider,
  networkName: BlockchainsWithRegistry
): RegistryContracts => {
  if (process.env.NODE_ENV === "production") {
    return RegistryContracts.fromTestnet(provider);
  } else {
    return RegistryContracts.fromDefaultLocalhost(provider, networkName);
  }
};

export type SupportedNetwork = "xdai" | "rinkeby";

export const hasDomainRegistry = (networkName: SupportedNetwork): boolean => {
  return networksWithDomainRegistries.includes(networkName);
};

export const networksWithDomainRegistries: SupportedNetwork[] = ["rinkeby"];
