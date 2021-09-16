import * as awilix from "awilix";
import { ethers } from "ethers";
import { NameAndRegistrationPair } from "awilix";
import { EnsApi } from "./ens/EnsApi";
import { PackageOwner, PolywrapVotingSystem } from "registry-js";
import { create } from "ipfs-http-client";
import { Signer } from "ethers";
import { VerifierStateManager } from "../../../services/VerifierStateManager";
import { VerifierStateInfo } from "../../../VerifierStateInfo";
import { RegistryContracts, RegistryAuthority } from "registry-js";

export const buildHelpersDependencyExtensions = (
  signers: {
    registryAuthoritySigner: Signer,
    verifierSigner: Signer,
    packageOwnerSigner: Signer
  },
  registryContractAddresses: {
    versionVerificationManagerL2: string
    packageOwnershipManagerL1: string,
    registrar: string,
    verificationTreeManager: string,
    registryL1: string,
    registryL2: string,
    votingMachine: string
  },
  testEnsContractAddresses: {
    ensRegistryL1: string,
    testEthRegistrarL1: string,
    testPublicResolverL1: string,
  }
): NameAndRegistrationPair<any> => {
  return {
    ipfsClient: awilix.asFunction(() => {
      return create({
        url: process.env.IPFS_URI,
      });
    }),
    ethersProvider: awilix.asFunction(() => {
      return ethers.providers.getDefaultProvider();
    }),
    verifierSigner: awilix.asFunction(() => {
      return signers.verifierSigner;
    }),
    registryAuthoritySigner: awilix.asFunction(() => {
      return signers.registryAuthoritySigner;
    }),
    registryAuthority: awilix.asFunction(({ registryAuthoritySigner }) => {
      return new RegistryAuthority(
        registryAuthoritySigner,
        registryContractAddresses.votingMachine
      );
    }),
    packageOwnerSigner: awilix.asFunction(() => {
      return signers.packageOwnerSigner;
    }),
    verifierStateManager: awilix.asFunction(() => {
      const state: VerifierStateInfo = {
        lastProcessedBlock: -1,
        lastProcessedTransactionIndex: -1,
        lastProcessedLogIndex: -1,
        currentlyProcessingBlock: 0,
      };

      return new VerifierStateManager(state);
    }),
    ensApi: awilix.asFunction(({ ethersProvider }) => {
      return new EnsApi(testEnsContractAddresses, ethersProvider)
    }),
    packageOwner: awilix.asFunction(({ packageOwnerSigner, ethersProvider }) => {
      return new PackageOwner(packageOwnerSigner, RegistryContracts.fromAddresses(registryContractAddresses, ethersProvider))
    }),
    polywrapVotingSystem: awilix.asFunction(({ verifierSigner, ethersProvider }) => {
      return new PolywrapVotingSystem(verifierSigner, RegistryContracts.fromAddresses(registryContractAddresses, ethersProvider));
    })
  };
};
