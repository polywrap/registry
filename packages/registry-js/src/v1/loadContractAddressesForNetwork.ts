import { RegistryContractAddresses } from "./RegistryContractAddresses";
import * as PolywrapRegistryV1 from "./deployments/localhost/PolywrapRegistryV1.json";

export const loadContractAddressesForNetwork = (
  networkName: string
): RegistryContractAddresses => {
  switch (networkName) {
    case "ethereum":
      throw Error("Not Implemented");
    case "rinkeby":
      return {
        polywrapRegistry: PolywrapRegistryV1.address,
      };
    default:
      throw Error("Network not supported");
  }
};
