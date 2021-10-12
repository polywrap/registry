import { ethers, Signer } from "ethers";
import { BlockchainsWithRegistry } from ".";
import {
  contractAddressesDefaultLocalhostL1,
  contractAddressesDefaultLocalhostL2,
  contractAddressesTestnet,
} from "./constants";
import {
  EnsLink,
  EnsLink__factory,
  PackageOwnershipManager,
  PackageOwnershipManager__factory,
  PolywrapRegistrar,
  PolywrapRegistrar__factory,
  PolywrapRegistry,
  PolywrapRegistry__factory,
  VerificationRootRelayer,
  VerificationRootRelayer__factory,
  VerificationTreeManager,
  VerificationTreeManager__factory,
  VersionVerificationManager,
  VersionVerificationManager__factory,
  VotingMachine,
  VotingMachine__factory,
} from "./typechain";

export class RegistryContracts {
  registry: PolywrapRegistry;
  packageOwnershipManager: PackageOwnershipManager;
  versionVerificationManager: VersionVerificationManager;
  verificationTreeManager?: VerificationTreeManager;
  verificationRootRelayer?: VerificationRootRelayer;
  registrar?: PolywrapRegistrar;
  votingMachine?: VotingMachine;
  ensLink?: EnsLink;

  constructor(contracts: {
    registry: PolywrapRegistry;
    packageOwnershipManager: PackageOwnershipManager;
    versionVerificationManager: VersionVerificationManager;
    verificationTreeManager?: VerificationTreeManager;
    verificationRootRelayer?: VerificationRootRelayer;
    registrar?: PolywrapRegistrar;
    votingMachine?: VotingMachine;
    ensLink?: EnsLink;
  }) {
    this.registry = contracts.registry;
    this.packageOwnershipManager = contracts.packageOwnershipManager;
    this.versionVerificationManager = contracts.versionVerificationManager;
    this.verificationTreeManager = contracts.verificationTreeManager;
    this.verificationRootRelayer = contracts.verificationRootRelayer;
    this.registrar = contracts.registrar;
    this.votingMachine = contracts.votingMachine;
    this.ensLink = contracts.ensLink;
  }

  connect(signer: Signer): RegistryContracts {
    this.registry = this.registry.connect(signer);
    this.packageOwnershipManager = this.packageOwnershipManager.connect(signer);
    this.versionVerificationManager = this.versionVerificationManager.connect(
      signer
    );
    this.verificationTreeManager = this.verificationTreeManager?.connect(
      signer
    );
    this.verificationRootRelayer = this.verificationRootRelayer?.connect(
      signer
    );
    this.registrar = this.registrar?.connect(signer);
    this.votingMachine = this.votingMachine?.connect(signer);
    this.ensLink = this.ensLink?.connect(signer);

    return this;
  }

  static fromAddresses(
    addresses: {
      registry: string;
      packageOwnershipManager: string;
      versionVerificationManager: string;
      registrar?: string;
      verificationTreeManager?: string;
      verificationRootRelayer?: string;
      votingMachine?: string;
      ensLink?: string;
    },
    provider: ethers.providers.Provider
  ): RegistryContracts {
    return new RegistryContracts({
      registry: PolywrapRegistry__factory.connect(addresses.registry, provider),
      versionVerificationManager: VersionVerificationManager__factory.connect(
        addresses.versionVerificationManager,
        provider
      ),
      packageOwnershipManager: PackageOwnershipManager__factory.connect(
        addresses.packageOwnershipManager,
        provider
      ),
      registrar: addresses.registrar
        ? PolywrapRegistrar__factory.connect(addresses.registrar, provider)
        : undefined,
      verificationTreeManager: addresses.verificationTreeManager
        ? VerificationTreeManager__factory.connect(
            addresses.verificationTreeManager,
            provider
          )
        : undefined,
      verificationRootRelayer: addresses.verificationRootRelayer
        ? VerificationRootRelayer__factory.connect(
            addresses.verificationRootRelayer,
            provider
          )
        : undefined,
      votingMachine: addresses.votingMachine
        ? VotingMachine__factory.connect(addresses.votingMachine, provider)
        : undefined,
      ensLink: addresses.ensLink
        ? EnsLink__factory.connect(addresses.ensLink, provider)
        : undefined,
    });
  }

  static fromTestnet(provider: ethers.providers.Provider): RegistryContracts {
    return RegistryContracts.fromAddresses(contractAddressesTestnet, provider);
  }

  static fromDefaultLocalhost(
    provider: ethers.providers.Provider,
    networkName: BlockchainsWithRegistry
  ): RegistryContracts {
    switch (networkName) {
      case "ethereum":
        throw "Not implemented";
      case "l2-chain-name":
        return RegistryContracts.fromAddresses(
          contractAddressesDefaultLocalhostL1,
          provider
        );
      case "rinkeby":
        return RegistryContracts.fromAddresses(
          contractAddressesDefaultLocalhostL1,
          provider
        );
      case "xdai":
        return RegistryContracts.fromAddresses(
          contractAddressesDefaultLocalhostL2,
          provider
        );
      default:
        throw "Network not supported";
    }
  }
}
