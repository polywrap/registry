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

export const buildHelpersDependencyExtensions = (): NameAndRegistrationPair<any> => {
  return {
    registryContracts: awilix.asFunction(({ ethersProvider }) => {
      return RegistryContracts.fromTestnet(ethersProvider);
    }),
    ipfsClient: awilix.asFunction(() => {
      return create({
        url: process.env.IPFS_URI,
      });
    }),
    verifierSigner: awilix.asFunction(({ ethersProvider }) => {
      return new ethers.Wallet(
        process.env.VERIFIER_PRIVATE_KEY!,
        ethersProvider
      );
    }),
    registryAuthority: awilix.asFunction(({ ethersProvider }) => {
      return new RegistryAuthority(
        ethersProvider,
        process.env.REGISTRY_AUTHORITY_PRIVATE_KEY!
      );
    }),
    ensApi: awilix.asClass(EnsApi),
    packageOwner: awilix.asClass(PackageOwner),
    packageOwnerSigner: awilix.asFunction(({ ethersProvider }) => {
      return new ethers.Wallet(
        process.env.PACKAGE_OWNER_PRIVATE_KEY!,
        ethersProvider
      );
    }),
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
    registryAutoritySigner: awilix.asFunction(({ ethersProvider }) => {
      return new ethers.Wallet(
        process.env.REGISTRY_AUTHORITY_PRIVATE_KEY!,
        ethersProvider
      );
    }),
    ensRegistryL1: awilix.asFunction(({ registryAutoritySigner }) => {
      return ENSRegistry__factory.connect(
        EnsRegistryL1.address,
        registryAutoritySigner
      );
    }),
    testEthRegistrarL1: awilix.asFunction(({ registryAutoritySigner }) => {
      return TestEthRegistrar__factory.connect(
        TestEthRegistrarL1.address,
        registryAutoritySigner
      );
    }),
    testPublicResolverL1: awilix.asFunction(({ registryAutoritySigner }) => {
      return TestPublicResolver__factory.connect(
        TestPublicResolverL1.address,
        registryAutoritySigner
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
