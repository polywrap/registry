import { RegistryContracts } from "@polywrap/registry-js";
import { ethers } from "ethers";
import process from "process";

export const getPolywrapRegistryContracts = (
  provider: ethers.providers.Provider
): RegistryContracts => {
  if (process.env.NODE_ENV === "production") {
    return RegistryContracts.fromTestnet(provider);
  } else {
    return RegistryContracts.fromDefaultLocalhost(provider);
  }
};
