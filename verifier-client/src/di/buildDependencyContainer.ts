import * as awilix from 'awilix';
import { ethers } from 'ethers';
import { VotingMachine__factory } from "../typechain";
import * as VotingMachine from "../deployments/localhost/VotingMachine.json"
import { create } from "ipfs-http-client";
import { SchemaComparisonService } from '../services/SchemaComparisonService';
import { VersionVerifierService } from '../services/VersionVerifierService';
import { VersionProcessingService } from '../services/VersionProcessingService';
import { VotingService } from '../services/VotingService';
import { SchemaRetrievalService } from '../services/SchemaRetrievalService';
import { VerifierStateManager } from '../services/VerifierStateManager';
import { VerifierClient } from '../services/VerifierClient';

export const buildDependencyContainer = (): awilix.AwilixContainer<any> => {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY
  });

  container.register({
    ipfsClient: awilix.asFunction(() => {
      return create({
        url: process.env.IPFS_URI
      });
    }),
    ethersProvider: awilix.asFunction(() => {
      return ethers.providers.getDefaultProvider(`${process.env.PROVIDER_NETWORK}`);
    }),
    verifierSigner: awilix.asFunction(({ ethersProvider }) => {
      return new ethers.Wallet(process.env.CLIENT_PRIVATE_KEY!, ethersProvider);
    }),
    votingMachine: awilix.asFunction(({ verifierSigner }) => {
      return VotingMachine__factory.connect(VotingMachine.address, verifierSigner);
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
    schemaComparisonService: awilix.asClass(SchemaComparisonService)
  });

  return container;
};