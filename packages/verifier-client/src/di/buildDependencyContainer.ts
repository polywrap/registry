import * as awilix from "awilix";
import { ethers } from "ethers";
import { SchemaComparisonService } from "../services/SchemaComparisonService";
import { VersionVerifierService } from "../services/VersionVerifierService";
import { VersionProcessingService } from "../services/VersionProcessingService";
import { VotingService } from "../services/VotingService";
import { SchemaRetrievalService } from "../services/SchemaRetrievalService";
import { VerifierStateManager } from "../services/VerifierStateManager";
import { VerifierClient } from "../services/VerifierClient";
import { NameAndRegistrationPair } from "awilix";
import { setupWeb3ApiClient } from "../web3Api/setupClient";
import { PolywrapVotingSystem, RegistryContracts } from "@polywrap/registry-js";

export const buildDependencyContainer = (
  extensionsAndOverrides?: NameAndRegistrationPair<any>
): awilix.AwilixContainer<any> => {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
  });

  container.register({
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
    verifierSigner: awilix.asFunction(({ ethersProvider }) => {
      return new ethers.Wallet(process.env.CLIENT_PRIVATE_KEY!, ethersProvider);
    }),
    verifierStateManager: awilix.asFunction(() => {
      const state = VerifierStateManager.load();
      return new VerifierStateManager(state);
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
          RegistryContracts.fromTestnet(ethersProvider)
        );
      }
    ),
    ...extensionsAndOverrides,
  });

  return container;
};
