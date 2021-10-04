import * as VersionVerificationManagerL2 from "./deployments/localhost/VersionVerificationManagerL2.json";
import * as PackageOwnershipManagerL1 from "./deployments/localhost/PackageOwnershipManagerL1.json";
import * as PolywrapRegistrar from "./deployments/localhost/PolywrapRegistrar.json";
import * as VerificationTreeManager from "./deployments/localhost/VerificationTreeManager.json";
import * as VerificationRootRelayer from "./deployments/localhost/VerificationRootRelayer.json";
import * as VotingMachine from "./deployments/localhost/VotingMachine.json";
import * as EnsLinkL1 from "./deployments/localhost/EnsLinkL1.json";
import * as PolywrapRegistryL1 from "./deployments/localhost/PolywrapRegistryL1.json";
import * as PolywrapRegistryL2 from "./deployments/localhost/PolywrapRegistryL2.json";

export const contractAddressesTestnet = {
  versionVerificationManagerL2: "0x0",
  packageOwnershipManagerL1: "0x0",
  registrar: "0x0",
  verificationTreeManager: "0x0",
  verificationRootRelayer: "0x0",
  registryL1: "0x0",
  registryL2: "0x0",
  votingMachine: "0x0",
  ensLinkL1: "0x0",
};

export const contractAddressesDefaultLocalhost = {
  versionVerificationManagerL2: VersionVerificationManagerL2.address,
  packageOwnershipManagerL1: PackageOwnershipManagerL1.address,
  registrar: PolywrapRegistrar.address,
  verificationTreeManager: VerificationTreeManager.address,
  verificationRootRelayer: VerificationRootRelayer.address,
  registryL1: PolywrapRegistryL1.address,
  registryL2: PolywrapRegistryL2.address,
  votingMachine: VotingMachine.address,
  ensLinkL1: EnsLinkL1.address,
};
