import { Logger } from "winston";
import { BytesLike, errors } from "ethers";
import { Web3ApiClient } from "@web3api/client-js";
import {
  ContractCallResult,
  handleContractError,
  PolywrapVotingSystem,
  PrevAndNextMinorPackageLocations,
  traceFunc,
} from "@polywrap/registry-js";
import { PreviousAndNextVersionSchema } from "../types/PreviousAndNextVersionSchema";

export class SchemaRetrievalService {
  private logger: Logger;
  private polywrapVotingSystem: PolywrapVotingSystem;
  private polywrapClient: Web3ApiClient;

  constructor(deps: {
    logger: Logger;
    polywrapVotingSystem: PolywrapVotingSystem;
    polywrapClient: Web3ApiClient;
  }) {
    this.logger = deps.logger;
    this.polywrapVotingSystem = deps.polywrapVotingSystem;
    this.polywrapClient = deps.polywrapClient;
  }

  @traceFunc("schema-retrieval-service:get_minor_version_schema")
  async getMinorVersionSchema(patchNodeId: BytesLike): Promise<string> {
    const location = await this.polywrapVotingSystem.getPrevPatchPackageLocation(
      patchNodeId
    );

    const minorVersionSchema = await this.polywrapClient.getSchema(
      `ipfs/${location}`
    );
    return minorVersionSchema;
  }

  @traceFunc("schema-retrieval-service:get_previous_and_next_version_schema")
  async getPreviousAndNextVersionSchema(
    patchNodeId: BytesLike
  ): Promise<PreviousAndNextVersionSchema> {
    const result = await this.polywrapVotingSystem.getPrevAndNextMinorPackageLocations(
      patchNodeId
    );

    const {
      prevMinorNodeId,
      prevPackageLocation,
      nextMinorNodeId,
      nextPackageLocation,
    } = result as PrevAndNextMinorPackageLocations;

    const prevSchema = prevPackageLocation
      ? await this.polywrapClient.getSchema(`ipfs/${prevPackageLocation}`)
      : undefined;

    const nextSchema = nextPackageLocation
      ? await this.polywrapClient.getSchema(`ipfs/${nextPackageLocation}`)
      : undefined;

    return {
      prevMinorNodeId,
      prevSchema,
      nextMinorNodeId,
      nextSchema,
    };
  }
}
