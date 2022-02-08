import {
  SchemaComparisonService,
  SchemaRetrievalService,
  VersionVerifierService,
} from "@polywrap/version-verifier-js";
import { useWeb3ApiClient } from "@web3api/react";
import React from "react";
import { LoggerContext } from "../providers/loggerContext";
import { PolywrapRegistryContext } from "../providers/PolywrapRegistryContext";

export const useVersionVerifier = (): {
  versionVerifierService: VersionVerifierService;
} => {
  const registry = React.useContext(PolywrapRegistryContext);
  const logger = React.useContext(LoggerContext);
  const polywrapClient = useWeb3ApiClient();

  if (!registry) {
    throw "Registry not defined";
  }

  if (!logger) {
    throw "Logger not defined";
  }

  if (!polywrapClient) {
    throw "Polywrap Client not defined";
  }
  const polywrapVotingSystem = registry.polywrapVotingSystem;
  const schemaRetrievalService = new SchemaRetrievalService({
    logger,
    polywrapVotingSystem,
    polywrapClient,
  });

  const schemaComparisonService = new SchemaComparisonService();

  const versionVerifierService = new VersionVerifierService({
    logger,
    polywrapClient,
    schemaRetrievalService,
    schemaComparisonService,
  });

  return { versionVerifierService };
};
