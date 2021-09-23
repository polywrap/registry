import { RegistryContracts } from "@polywrap/registry-js";
import { ethers } from "ethers";
import process from "process";

export const getPolywrapRegistryContracts = (
  provider: ethers.providers.Provider
): RegistryContracts => {
  if (process.env.NODE_ENV === "production") {
    return RegistryContracts.fromTestnet(provider);
  } else {
    return RegistryContracts.fromAddresses(
      {
        versionVerificationManagerL2:
          "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        packageOwnershipManagerL1: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        registrar: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        verificationTreeManager: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        registryL1: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        registryL2: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        votingMachine: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
        ensLinkL1: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
      },
      provider
    );
  }
};
