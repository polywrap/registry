import { RegistryContractAddresses } from "./types/RegistryContractAddresses";

export const getContractAddressesForNetwork = (
  networkName: string
): RegistryContractAddresses => {
  switch (networkName) {
    case "ethereum":
      throw Error("Not Implemented");
    case "rinkeby":
      return {
        polywrapRegistry: "",
      };
    default:
      throw Error("Network not supported");
  }
};
