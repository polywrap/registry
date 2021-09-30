import * as awilix from "awilix";
import { NameAndRegistrationPair } from "awilix";
import { EnsApi } from "../../../../helpers/EnsApi";
import { PackageOwner, PolywrapVotingSystem } from "@polywrap/registry-js";
import { Signer } from "ethers";
import { VerifierStateManager } from "../../../../services/VerifierStateManager";
import { VerifierStateInfo } from "../../../../VerifierStateInfo";
import { RegistryContracts, RegistryAuthority } from "@polywrap/registry-js";
import { IpfsPublisher } from "./IpfsPublisher";
import winston from "winston";

export const buildHelpersDependencyExtensions = (
  signers: {
    registryAuthoritySigner: Signer;
    verifierSigner: Signer;
    packageOwnerSigner: Signer;
  },
  registryContractAddresses: {
    versionVerificationManagerL2: string;
    packageOwnershipManagerL1: string;
    registrar: string;
    verificationTreeManager: string;
    registryL1: string;
    registryL2: string;
    votingMachine: string;
    ensLinkL1: string;
  },
  testEnsContractAddresses: {
    ensRegistryL1: string;
    testEthRegistrarL1: string;
    testPublicResolverL1: string;
  }
): NameAndRegistrationPair<any> => {
  return {
    logger: awilix.asFunction(() => {
      const format = winston.format.printf(({ level, message, timestamp }) => {
        return `${timestamp} - ${level} - ${message}`;
      });
      return winston.createLogger({
        level: "debug",
        transports: [
          new winston.transports.Console(),
          new winston.transports.File({ filename: "test_verifier_client.log" }),
        ],
        format: winston.format.combine(
          winston.format.simple(),
          winston.format.timestamp(),
          format
        ),
      });
    }),
    registryContracts: awilix.asFunction(({ ethersProvider }) => {
      return RegistryContracts.fromAddresses(
        registryContractAddresses,
        ethersProvider
      );
    }),
    ipfsPublisher: awilix.asClass(IpfsPublisher),
    verifierSigner: awilix.asFunction(() => {
      return signers.verifierSigner;
    }),
    registryAuthoritySigner: awilix.asFunction(() => {
      return signers.registryAuthoritySigner;
    }),
    registryAuthority: awilix.asFunction(
      ({ registryAuthoritySigner, registryContracts, logger }) => {
        return new RegistryAuthority(
          registryAuthoritySigner,
          registryContracts.votingMachine.address,
          logger
        );
      }
    ),
    packageOwnerSigner: awilix.asFunction(() => {
      return signers.packageOwnerSigner;
    }),
    verifierStateManager: awilix.asFunction(({ verifierClientConfig }) => {
      const state: VerifierStateInfo = {
        lastProcessedBlock: -1,
        lastProcessedTransactionIndex: -1,
        lastProcessedLogIndex: -1,
        currentlyProcessingBlock: 0,
      };

      return new VerifierStateManager(verifierClientConfig, state, {
        memoryOnly: true,
      });
    }),
    ensApi: awilix.asFunction(({ ethersProvider }) => {
      return new EnsApi(testEnsContractAddresses, ethersProvider);
    }),
    packageOwner: awilix.asFunction(
      ({ packageOwnerSigner, registryContracts, logger }) => {
        return new PackageOwner(packageOwnerSigner, registryContracts, logger);
      }
    ),
    polywrapVotingSystem: awilix.asFunction(
      ({ verifierSigner, registryContracts, logger }) => {
        return new PolywrapVotingSystem(
          verifierSigner,
          registryContracts,
          logger
        );
      }
    ),
  };
};
