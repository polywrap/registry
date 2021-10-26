import * as EnsRegistryL1 from "./deployments/localhost/EnsRegistryL1.json";
import * as TestEthRegistrarL1 from "./deployments/localhost/TestEthRegistrarL1.json";
import * as TestPublicResolverL1 from "./deployments/localhost/TestPublicResolverL1.json";

export const POLYWRAP_OWNER_RECORD_NAME = "polywrap-owner";

export const ensContractAddressesTestnet = {
  ensRegistryL1: EnsRegistryL1.address,
  testEthRegistrarL1: TestEthRegistrarL1.address,
  testPublicResolverL1: TestPublicResolverL1.address,
};
