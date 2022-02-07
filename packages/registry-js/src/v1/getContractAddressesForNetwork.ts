import { RegistryContractAddresses } from "./types/RegistryContractAddresses";

export const getContractAddressesForNetwork = (
  networkName: string
): RegistryContractAddresses => {
  switch (networkName) {
    case "ethereum":
      throw Error("Not Implemented");
    case "rinkeby":
      return {
        polywrapRegistry: "0x9b044e96F738c8c16Cc9a3Bbb167514C6203CB08",
      };
    default:
      throw Error("Network not supported");
  }
};
