import { Logger } from "winston";
import { BytesLike } from "ethers";
import { Web3ApiClient } from "@web3api/client-js";
import { PolywrapVotingSystem, traceFunc } from "@polywrap/registry-js";

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

  @traceFunc("SchemaRetrievalService:getMinorVersionSchema")
  async getMinorVersionSchema(patchNodeId: BytesLike): Promise<string> {
    const location = await this.polywrapVotingSystem.getPrevPatchPackageLocation(
      patchNodeId
    );
    const minorVersionSchema = await this.polywrapClient.getSchema(
      `ipfs/${location}`
    );
    return minorVersionSchema;
  }

  @traceFunc("SchemaRetrievalService:getPreviousAndNextVersionSchema")
  async getPreviousAndNextVersionSchema(
    patchNodeId: BytesLike
  ): Promise<{
    prevMinorNodeId: BytesLike;
    prevSchema: string | undefined;
    nextMinorNodeId: BytesLike;
    nextSchema: string | undefined;
  }> {
    const {
      prevMinorNodeId,
      prevPackageLocation,
      nextMinorNodeId,
      nextPackageLocation,
    } = await this.polywrapVotingSystem.getPrevAndNextMinorPackageLocations(
      patchNodeId
    );

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
