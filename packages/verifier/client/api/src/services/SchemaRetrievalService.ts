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
  async getMinorVersionSchema(
    patchNodeId: BytesLike
  ): Promise<string | undefined> {
    const location = await this.polywrapVotingSystem.getPrevPatchPackageLocation(
      patchNodeId
    );
    const [error, minorVersionSchema] = await handleError(() =>
      this.polywrapClient.getSchema(`ipfs/${location}`)
    )();

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

    let prevSchema: string | undefined;
    let nextSchema: string | undefined;

    const {
      prevMinorNodeId,
      prevPackageLocation,
      nextMinorNodeId,
      nextPackageLocation,
    } = result as PrevAndNextMinorPackageLocations;

    if (prevPackageLocation) {
      const [_prevSchemaError, _prevSchema] = await handleError(() =>
        this.polywrapClient.getSchema(`ipfs/${prevPackageLocation}`)
      )();
      if (_prevSchemaError) {
        prevSchema = _prevSchema;
      }
    }

    if (nextPackageLocation) {
      const [_nextSchemaError, _nextSchema] = await handleError(() =>
        this.polywrapClient.getSchema(`ipfs/${nextPackageLocation}`)
      )();
      if (_nextSchemaError) {
        nextSchema = _nextSchema;
      }
    }

    return {
      prevMinorNodeId,
      prevSchema,
      nextMinorNodeId,
      nextSchema,
    };
  }
}
