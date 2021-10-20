import * as awilix from "awilix";
import { NameAndRegistrationPair } from "awilix";
import { EnsApi } from "../helpers/EnsApi";
import {
  ContractAddressesL1,
  ContractAddressesL2,
  PolywrapVotingSystem,
} from "@polywrap/registry-js";
import { Signer } from "ethers";
import { VerifierStateManager } from "../../../../services/VerifierStateManager";
import { VerifierStateInfo } from "../../../../types/VerifierStateInfo";
import { RegistryContracts, RegistryAuthority } from "@polywrap/registry-js";
import { IpfsPublisher } from "./IpfsPublisher";
import winston from "winston";

export const buildHelpersDependencyExtensions = (
  signers: {
    registryAuthoritySigner: Signer;
    verifierSigner: Signer;
    packageOwnerSigner: Signer;
  },
  registryContractAddressesL1: ContractAddressesL1,
  registryContractAddressesL2: ContractAddressesL2,
  testEnsContractAddresses: {
    ensRegistryL1: string;
    testEthRegistrarL1: string;
    testPublicResolverL1: string;
  },
  loggerConfig: {
    consoleLogLevel: string;
    fileLogLevel: string;
    logFileName: string;
  }
): NameAndRegistrationPair<any> => {
  return {
    logger: awilix
      .asFunction(() => {
        const consoleFormat = winston.format.printf(
          ({ level, message, timestamp }) =>
            `${new Date(timestamp)} - ${level} - ${message}`
        );
        const jsonFormat = winston.format.printf((object) =>
          JSON.stringify(object)
        );

        return winston.createLogger({
          transports: [
            new winston.transports.Console({
              level: loggerConfig.consoleLogLevel,
              format: winston.format.combine(
                winston.format.simple(),
                winston.format.colorize(),
                winston.format.timestamp(),
                consoleFormat
              ),
            }),
            new winston.transports.File({
              filename: loggerConfig.logFileName,
              level: loggerConfig.fileLogLevel,
              format: winston.format.combine(
                winston.format.json(),
                winston.format.timestamp(),
                jsonFormat
              ),
            }),
          ],
        });
      })
      .singleton(),
    registryContracts: awilix.asFunction(({ ethersProvider }) => {
      return RegistryContracts.fromAddresses(
        registryContractAddressesL2,
        ethersProvider
      );
    }),
    registryContractsL1: awilix.asFunction(({ ethersProvider }) => {
      return RegistryContracts.fromAddresses(
        registryContractAddressesL1,
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
      ({ registryAuthoritySigner, registryContracts }) => {
        return new RegistryAuthority(
          registryAuthoritySigner,
          registryContracts.votingMachine.address
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
    polywrapVotingSystem: awilix.asFunction(
      ({ verifierSigner, registryContracts }) => {
        return new PolywrapVotingSystem(verifierSigner, registryContracts);
      }
    ),
  };
};
