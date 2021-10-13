import { PolywrapVotingSystem, RegistryContracts } from "@polywrap/registry-js";
import {
  SchemaComparisonService,
  SchemaRetrievalService,
  VerifierClient,
  VerifierStateManager,
  VersionProcessingService,
  VersionVerifierService,
  VotingService,
} from "@polywrap/version-verifier-node";
import * as awilix from "awilix";
import { NameAndRegistrationPair } from "awilix";
import { ethers } from "ethers";
import winston from "winston";
import { ApiServerConfig } from "../config/ApiServerConfig";
import { EthersConfig } from "../config/EthersConfig";
import { IpfsConfig } from "../config/IpfsConfig";
import { LoggerConfig } from "../config/loggerConfig";
import { PolywrapClientConfig } from "../config/PolywrapClientConfig";
import { VerifierClientConfig } from "../config/VerifierClientConfig";
import { WebUiServerConfig } from "../config/WebUiServerConfig";
import { setupWeb3ApiClient } from "@polywrap/version-verifier-node";

export const buildDependencyContainer = (
  extensionsAndOverrides?: NameAndRegistrationPair<unknown>
): awilix.AwilixContainer<any> => {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
  });

  container.register({
    ipfsConfig: awilix.asClass(IpfsConfig).singleton(),
    verifierClientConfig: awilix.asClass(VerifierClientConfig).singleton(),
    ethersConfig: awilix.asClass(EthersConfig).singleton(),
    polywrapClientConfig: awilix.asClass(PolywrapClientConfig).singleton(),
    apiServerConfig: awilix.asClass(ApiServerConfig).singleton(),
    webUiServerConfig: awilix.asClass(WebUiServerConfig).singleton(),
    loggerConfig: awilix.asClass(LoggerConfig).singleton(),
    registryContracts: awilix
      .asFunction(({ ethersProvider }) => {
        return RegistryContracts.fromDefaultLocalhost(ethersProvider, "xdai");
      })
      .singleton(),
    ethersProvider: awilix
      .asFunction(({ ethersConfig }) => {
        return ethers.providers.getDefaultProvider(
          ethersConfig.providerNetwork
        );
      })
      .singleton(),
    logger: awilix
      .asFunction(({ loggerConfig }) => {
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
    polywrapClient: awilix
      .asFunction(({ polywrapClientConfig, ethersProvider }) => {
        return setupWeb3ApiClient({
          ethersProvider: ethersProvider,
          ipfsProvider: polywrapClientConfig.ipfsProvider,
        });
      })
      .singleton(),
    verifierSigner: awilix
      .asFunction(({ verifierClientConfig, ethersProvider }) => {
        return new ethers.Wallet(
          verifierClientConfig.verifierPrivateKey,
          ethersProvider
        );
      })
      .singleton(),
    verifierStateManager: awilix.asFunction(({ verifierClientConfig }) => {
      const state = VerifierStateManager.load(verifierClientConfig);
      return new VerifierStateManager(verifierClientConfig, state);
    }),
    verifierClient: awilix.asClass(VerifierClient),
    versionProcessingService: awilix.asClass(VersionProcessingService),
    versionVerifierService: awilix.asClass(VersionVerifierService),
    votingService: awilix.asClass(VotingService),
    schemaRetrievalService: awilix.asClass(SchemaRetrievalService),
    schemaComparisonService: awilix.asClass(SchemaComparisonService),
    polywrapVotingSystem: awilix.asFunction(
      ({ verifierSigner, ethersProvider }) => {
        return new PolywrapVotingSystem(
          verifierSigner,
          RegistryContracts.fromDefaultLocalhost(ethersProvider, "xdai")
        );
      }
    ),
    ...extensionsAndOverrides,
  });

  return container;
};
