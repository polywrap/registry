import * as awilix from "awilix";
import { ethers } from "ethers";
import { NameAndRegistrationPair } from "awilix";
import { create } from "ipfs-http-client";
import {
  ENSRegistry__factory,
  PackageOwnershipManager__factory,
  PolywrapRegistrar__factory,
  TestEthRegistrar__factory,
  TestPublicResolver__factory,
  VerificationTreeManager__factory,
  VersionVerificationManager__factory,
  VotingMachine__factory,
} from "../../typechain";
import * as EnsRegistryL1 from "../../deployments/localhost/EnsRegistryL1.json";
import * as TestEthRegistrarL1 from "../../deployments/localhost/TestEthRegistrarL1.json";
import * as TestPublicResolverL1 from "../../deployments/localhost/TestPublicResolverL1.json";
import { EnsApi } from "./ens/EnsApi";
import * as VersionVerificationManagerL2 from "../../deployments/localhost/VersionVerificationManagerL2.json";
import * as PackageOwnershipManagerL1 from "../../deployments/localhost/PackageOwnershipManagerL1.json";
import * as PolywrapRegistrar from "../../deployments/localhost/PolywrapRegistrar.json";
import * as VerificationTreeManager from "../../deployments/localhost/PolywrapRegistrar.json";
import * as VotingMachine from "../../deployments/localhost/VotingMachine.json";
import {
  PackageOwner,
  RegistryAuthority,
  RegistryContracts,
} from "@polywrap/registry-js";
import { IpfsConfig } from "../../config/IpfsConfig";

export const buildHelpersDependencyExtensions = (): NameAndRegistrationPair<any> => {
  return {
    ipfsConfig: awilix.asFunction(() => {
      return new IpfsConfig();
    }),
    registryContracts: awilix.asFunction(({ ethersProvider }) => {
      return RegistryContracts.fromTestnet(ethersProvider);
    }),
    ipfsClient: awilix.asFunction(({ ipfsConfig }) => {
      return create({
        url: ipfsConfig.ipfsProvider,
      });
    }),
    verifierSigner: awilix.asFunction(({ ethersProvider }) => {
      return new ethers.Wallet(
        process.env.VERIFIER_PRIVATE_KEY!,
        ethersProvider
      );
    }),
    registryAuthoritySigner: awilix.asFunction(({ ethersProvider }) => {
      return new ethers.Wallet(
        process.env.REGISTRY_AUTHORITY_PRIVATE_KEY!,
        ethersProvider
      );
    }),
    registryAuthority: awilix.asFunction(
      ({ registryAuthoritySigner, registryContracts }) => {
        return new RegistryAuthority(
          registryAuthoritySigner,
          registryContracts.votingMachine.address
        );
      }
    ),
    ensApi: awilix.asClass(EnsApi),
    packageOwnerSigner: awilix.asFunction(({ ethersProvider }) => {
      return new ethers.Wallet(
        process.env.PACKAGE_OWNER_PRIVATE_KEY!,
        ethersProvider
      );
    }),
    packageOwner: awilix.asFunction(
      ({ packageOwnerSigner, registryContracts }) => {
        return new PackageOwner(packageOwnerSigner, registryContracts);
      }
    ),
    versionVerificationManagerL2: awilix.asFunction(
      ({ packageOwnerSigner }) => {
        return VersionVerificationManager__factory.connect(
          VersionVerificationManagerL2.address,
          packageOwnerSigner
        );
      }
    ),
    packageOwnershipManagerL1: awilix.asFunction(({ packageOwnerSigner }) => {
      return PackageOwnershipManager__factory.connect(
        PackageOwnershipManagerL1.address,
        packageOwnerSigner
      );
    }),
    registrar: awilix.asFunction(({ packageOwnerSigner }) => {
      return PolywrapRegistrar__factory.connect(
        PolywrapRegistrar.address,
        packageOwnerSigner
      );
    }),
    verificationTreeManager: awilix.asFunction(({ packageOwnerSigner }) => {
      return VerificationTreeManager__factory.connect(
        VerificationTreeManager.address,
        packageOwnerSigner
      );
    }),
    ensRegistryL1: awilix.asFunction(({ registryAuthoritySigner }) => {
      return ENSRegistry__factory.connect(
        EnsRegistryL1.address,
        registryAuthoritySigner
      );
    }),
    testEthRegistrarL1: awilix.asFunction(({ registryAuthoritySigner }) => {
      return TestEthRegistrar__factory.connect(
        TestEthRegistrarL1.address,
        registryAuthoritySigner
      );
    }),
    testPublicResolverL1: awilix.asFunction(({ registryAuthoritySigner }) => {
      return TestPublicResolver__factory.connect(
        TestPublicResolverL1.address,
        registryAuthoritySigner
      );
    }),
    votingMachine: awilix.asFunction(({ verifierSigner }) => {
      return VotingMachine__factory.connect(
        VotingMachine.address,
        verifierSigner
      );
    }),
  };
};
