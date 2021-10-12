import * as VersionVerificationManagerL1 from "./deployments/localhost/VersionVerificationManagerL1.json";
import * as VersionVerificationManagerL2 from "./deployments/localhost/VersionVerificationManagerL2.json";
import * as PackageOwnershipManagerL1 from "./deployments/localhost/PackageOwnershipManagerL1.json";
import * as PackageOwnershipManagerL2 from "./deployments/localhost/PackageOwnershipManagerL2.json";
import * as PolywrapRegistrar from "./deployments/localhost/PolywrapRegistrar.json";
import * as VerificationTreeManager from "./deployments/localhost/VerificationTreeManager.json";
import * as VerificationRootRelayer from "./deployments/localhost/VerificationRootRelayer.json";
import * as VotingMachine from "./deployments/localhost/VotingMachine.json";
import * as EnsLinkL1 from "./deployments/localhost/EnsLinkL1.json";
import * as PolywrapRegistryL1 from "./deployments/localhost/PolywrapRegistryL1.json";
import * as PolywrapRegistryL2 from "./deployments/localhost/PolywrapRegistryL2.json";

export const contractAddressesTestnet = {
  registry: "0x0",
  packageOwnershipManager: "0x0",
  versionVerificationManager: "0x0",

  registrar: "0x0",
  verificationTreeManager: "0x0",
  verificationRootRelayer: "0x0",

  ensLink: "0x0",
};

export const contractAddressesDefaultLocalhostL1: ContractAddressesL1 = {
  registry: PolywrapRegistryL1.address,
  packageOwnershipManager: PackageOwnershipManagerL1.address,
  versionVerificationManager: VersionVerificationManagerL1.address,

  ensLink: EnsLinkL1.address,
};

export const contractAddressesDefaultLocalhostL2: ContractAddressesL2 = {
  registry: PolywrapRegistryL2.address,
  packageOwnershipManager: PackageOwnershipManagerL2.address,
  versionVerificationManager: VersionVerificationManagerL2.address,

  registrar: PolywrapRegistrar.address,
  verificationTreeManager: VerificationTreeManager.address,
  verificationRootRelayer: VerificationRootRelayer.address,
  votingMachine: VotingMachine.address,
};

export type ContractAddressesL1 = {
  registry: string;
  packageOwnershipManager: string;
  versionVerificationManager: string;

  ensLink: string;
};

export type ContractAddressesL2 = {
  registry: string;
  packageOwnershipManager: string;
  versionVerificationManager: string;

  registrar: string;
  verificationTreeManager: string;
  verificationRootRelayer: string;
  votingMachine: string;
};