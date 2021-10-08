import { Logger } from "winston";
import { BytesLike } from "ethers";
import { Web3ApiClient } from "@web3api/client-js";
import {
  handleError,
  PolywrapVotingSystem,
  PrevAndNextMinorPackageLocations,
  traceFunc,
} from "@polywrap/registry-js";
import { PreviousAndNextVersionSchema } from "../types/PreviousAndNextVersionSchema";

export class SchemaRetrievalService {
  private logger: Logger;
  private polywrapVotingSystem: PolywrapVotingSystem;
  private polywrapClient: Web3ApiClient;
  private getSchema: any;

  constructor(deps: {
    logger: Logger;
    polywrapVotingSystem: PolywrapVotingSystem;
    polywrapClient: Web3ApiClient;
  }) {
    this.logger = deps.logger;
    this.polywrapVotingSystem = deps.polywrapVotingSystem;
    this.polywrapClient = deps.polywrapClient;
    this.getSchema = handleError(this.polywrapClient.getSchema);
  }

  @traceFunc("schema-retrieval-service:get_minor_version_schema")
  async getMinorVersionSchema(
    patchNodeId: BytesLike
  ): Promise<string | undefined> {
    const location = await this.polywrapVotingSystem.getPrevPatchPackageLocation(
      patchNodeId
    );
    const [minorVersionSchema, error] = await this.getSchema(
      `ipfs/${location}`
    );

    if (error) {
      return undefined;
    }
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

    const [prevSchema, prevSchemaError] = prevPackageLocation
      ? await this.getSchema(`ipfs/${prevPackageLocation}`)
      : undefined;
    if (prevSchemaError) {
      return undefined;
    }

    const [nextSchema, nextSchemaError] = nextPackageLocation
      ? await this.getSchema(`ipfs/${nextPackageLocation}`)
      : undefined;
    if (nextSchemaError) {
      return undefined;
    }

    return {
      prevMinorNodeId,
      prevSchema,
      nextMinorNodeId,
      nextSchema,
    };
  }
}
