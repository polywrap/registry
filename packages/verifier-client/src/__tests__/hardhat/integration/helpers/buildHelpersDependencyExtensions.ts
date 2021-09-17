import * as awilix from "awilix";
import { ethers } from "ethers";
import { NameAndRegistrationPair } from "awilix";
import { EnsApi } from "./ens/EnsApi";
import { PackageOwner, PolywrapVotingSystem } from "@polywrap/registry-js";
import { create } from "ipfs-http-client";
import { Signer } from "ethers";
import { VerifierStateManager } from "../../../../services/VerifierStateManager";
import { VerifierStateInfo } from "../../../../VerifierStateInfo";
import { RegistryContracts, RegistryAuthority } from "@polywrap/registry-js";

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
    registryContracts: awilix.asFunction(({ ethersProvider }) => {
      return RegistryContracts.fromAddresses(registryContractAddresses, ethersProvider);
    }),
    ipfsClient: awilix.asFunction(() => {
      return create({
        url: process.env.IPFS_URI,
      });
    }),
    verifierSigner: awilix.asFunction(() => {
      return signers.verifierSigner;
    }),
    registryAuthoritySigner: awilix.asFunction(() => {
      return signers.registryAuthoritySigner;
    }),
    registryAuthority: awilix.asFunction(({ registryAuthoritySigner, registryContracts }) => {
      return new RegistryAuthority(
        registryAuthoritySigner,
        registryContracts.votingMachine.address
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

      return new VerifierStateManager(state, { memoryOnly: true });
    }),
    ensApi: awilix.asFunction(({ ethersProvider }) => {
      return new EnsApi(testEnsContractAddresses, ethersProvider)
    }),
    packageOwner: awilix.asFunction(({ packageOwnerSigner, registryContracts }) => {
      return new PackageOwner(packageOwnerSigner, registryContracts)
    }),
    polywrapVotingSystem: awilix.asFunction(({ verifierSigner, registryContracts }) => {
      return new PolywrapVotingSystem(verifierSigner, registryContracts);
    })
  };
};
