import { ethers, Signer } from "ethers";
import { contractAddressesTestnet } from "./constants";
import {
  PackageOwnershipManager,
  PackageOwnershipManager__factory,
  PolywrapRegistrar,
  PolywrapRegistrar__factory,
  PolywrapRegistry,
  PolywrapRegistry__factory,
  VerificationTreeManager,
  VerificationTreeManager__factory,
  VersionVerificationManager,
  VersionVerificationManager__factory,
  VotingMachine,
  VotingMachine__factory,
} from "./typechain";

export class RegistryContracts {
  versionVerificationManagerL2: VersionVerificationManager;
  packageOwnershipManagerL1: PackageOwnershipManager;
  registryL1: PolywrapRegistry;
  registryL2: PolywrapRegistry;
  verificationTreeManager: VerificationTreeManager;
  registrar: PolywrapRegistrar;
  votingMachine: VotingMachine;

  constructor(contracts: {
    versionVerificationManagerL2: VersionVerificationManager;
    packageOwnershipManagerL1: PackageOwnershipManager;
    registryL1: PolywrapRegistry;
    registryL2: PolywrapRegistry;
    verificationTreeManager: VerificationTreeManager;
    registrar: PolywrapRegistrar;
    votingMachine: VotingMachine;
  }) {
    this.versionVerificationManagerL2 = contracts.versionVerificationManagerL2;
    this.packageOwnershipManagerL1 = contracts.packageOwnershipManagerL1;
    this.registryL1 = contracts.registryL1;
    this.registryL2 = contracts.registryL2;
    this.verificationTreeManager = contracts.verificationTreeManager;
    this.registrar = contracts.registrar;
    this.votingMachine = contracts.votingMachine;
  }

  connect(signer: Signer): RegistryContracts {
    this.versionVerificationManagerL2 = this.versionVerificationManagerL2.connect(
      signer
    );
    this.packageOwnershipManagerL1 = this.packageOwnershipManagerL1.connect(
      signer
    );
    this.registryL1 = this.registryL1.connect(signer);
    this.registryL2 = this.registryL2.connect(signer);
    this.verificationTreeManager = this.verificationTreeManager.connect(signer);
    this.registrar = this.registrar.connect(signer);
    this.votingMachine = this.votingMachine.connect(signer);

    return this;
  }

  static fromAddresses(
    addresses: {
      versionVerificationManagerL2: string;
      packageOwnershipManagerL1: string;
      registrar: string;
      verificationTreeManager: string;
      registryL1: string;
      registryL2: string;
      votingMachine: string;
    },
    provider: ethers.providers.BaseProvider
  ): RegistryContracts {
    return new RegistryContracts({
      versionVerificationManagerL2: VersionVerificationManager__factory.connect(
        addresses.versionVerificationManagerL2,
        provider
      ),
      packageOwnershipManagerL1: PackageOwnershipManager__factory.connect(
        addresses.packageOwnershipManagerL1,
        provider
      ),
      registrar: PolywrapRegistrar__factory.connect(
        addresses.registrar,
        provider
      ),
      verificationTreeManager: VerificationTreeManager__factory.connect(
        addresses.verificationTreeManager,
        provider
      ),
      registryL1: PolywrapRegistry__factory.connect(
        addresses.registryL1,
        provider
      ),
      registryL2: PolywrapRegistry__factory.connect(
        addresses.registryL2,
        provider
      ),
      votingMachine: VotingMachine__factory.connect(
        addresses.votingMachine,
        provider
      ),
    });
  }

  static fromTestnet(
    provider: ethers.providers.BaseProvider
  ): RegistryContracts {
    return RegistryContracts.fromAddresses(contractAddressesTestnet, provider);
  }
}