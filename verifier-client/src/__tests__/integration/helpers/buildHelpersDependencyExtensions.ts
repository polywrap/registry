import * as awilix from "awilix";
import { ethers } from "ethers";
import { NameAndRegistrationPair } from "awilix";
import { PackageOwner } from "./PackageOwner";
import { RegistryAuthority } from "./RegistryAuthority";
import { EnsApi } from "./ens/EnsApi";
import { create } from "ipfs-http-client";
import {
  PackageOwnershipManager__factory,
  PolywrapRegistrar__factory,
  VerificationTreeManager__factory,
  VersionVerificationManager__factory,
} from "../../../typechain";
import * as VersionVerificationManagerL2 from "../../../deployments/localhost/VersionVerificationManagerL2.json";
import * as PackageOwnershipManagerL1 from "../../../deployments/localhost/PackageOwnershipManagerL1.json";
import * as PolywrapRegistrar from "../../../deployments/localhost/PolywrapRegistrar.json";
import * as VerificationTreeManager from "../../../deployments/localhost/PolywrapRegistrar.json";
import { setupWeb3ApiClient } from "../../../web3Api/setupClient";

export const buildHelpersDependencyExtensions =
  (): NameAndRegistrationPair<any> => {
    return {
      ethersProvider: awilix.asFunction(() => {
        return ethers.providers.getDefaultProvider(
          `${process.env.PROVIDER_NETWORK}`
        );
      }),
      polywrapClient: awilix.asFunction(({ ethersProvider }) => {
        return setupWeb3ApiClient({
          ethersProvider: ethersProvider,
          ipfsProvider: process.env.IPFS_URI as string,
        });
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
      authority: awilix.asFunction(({ ethersProvider }) => {
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
    };
  };
