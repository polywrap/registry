import { Logger } from "winston";
import { BytesLike, errors } from "ethers";
import { Web3ApiClient } from "@web3api/client-js";
import {
  ContractCallResult,
  PolywrapVotingSystem,
  traceFunc,
} from "@polywrap/registry-js";

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
  ): Promise<ContractCallResult<string>> {
    const locationResult = await this.polywrapVotingSystem.getPrevPatchPackageLocation(
      patchNodeId
    );
    if (locationResult.error) {
      if (
        locationResult.error.reason in
        this.polywrapVotingSystem.prevPatchPackageLocationReverts
      ) {
        return {
          data: null,
          error: locationResult.error,
        };
      } else {
        process.exit(1);
      }
    }
    const location = locationResult.data as string;
    const minorVersionSchema = await this.polywrapClient.getSchema(
      `ipfs/${location}`
    );
    return {
      data: minorVersionSchema,
      error: null,
    };
  }

  @traceFunc("schema-retrieval-service:get_previous_and_next_version_schema")
  async getPreviousAndNextVersionSchema(
    patchNodeId: BytesLike
  ): Promise<
    ContractCallResult<{
      prevMinorNodeId: BytesLike;
      prevSchema: string | undefined;
      nextMinorNodeId: BytesLike;
      nextSchema: string | undefined;
    }>
  > {
    const result = await this.polywrapVotingSystem.getPrevAndNextMinorPackageLocations(
      patchNodeId
    );
    if (result.error) {
      if (
        result.error.reason in
        this.polywrapVotingSystem.prevAndNextMinorPackageLocationsReverts
      ) {
        return {
          data: null,
          error: result.error,
        };
      } else {
        process.exit(1);
      }
    }

    const {
      prevMinorNodeId,
      prevPackageLocation,
      nextMinorNodeId,
      nextPackageLocation,
    } = result.data;

    const prevSchema = prevPackageLocation
      ? await this.polywrapClient.getSchema(`ipfs/${prevPackageLocation}`)
      : undefined;

    const nextSchema = nextPackageLocation
      ? await this.polywrapClient.getSchema(`ipfs/${nextPackageLocation}`)
      : undefined;

    return {
      data: {
        prevMinorNodeId,
        prevSchema,
        nextMinorNodeId,
        nextSchema,
      },
      error: null,
    };
  }
}
