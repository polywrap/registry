import { BytesLike, ethers } from "ethers";
import { Web3ApiClient } from "@web3api/client-js";
import { SchemaComparisonService } from "./SchemaComparisonService";
import { SchemaRetrievalService } from "./SchemaRetrievalService";
import { Logger } from "winston";
import { traceFunc } from "@polywrap/registry-js";

export class VersionVerifierService {
  private logger: Logger;
  private polywrapClient: Web3ApiClient;
  private schemaRetrievalService: SchemaRetrievalService;
  private schemaComparisonService: SchemaComparisonService;

  constructor(deps: {
    logger: Logger;
    polywrapClient: Web3ApiClient;
    schemaRetrievalService: SchemaRetrievalService;
    schemaComparisonService: SchemaComparisonService;
  }) {
    this.logger = deps.logger;
    this.polywrapClient = deps.polywrapClient;
    this.schemaRetrievalService = deps.schemaRetrievalService;
    this.schemaComparisonService = deps.schemaComparisonService;
  }

  @traceFunc("VersionVerifierService:verifyVersion")
  async verifyVersion(
    packageId: BytesLike,
    patchNodeId: BytesLike,
    majorVersion: number,
    minorVersion: number,
    patchVersion: number,
    packageLocation: string,
    isPatch: boolean
  ): Promise<{
    prevMinorNodeId: BytesLike;
    nextMinorNodeId: BytesLike;
    approved: boolean;
  }> {
    this.logger.info(
      `Verifying proposed version: ${packageId}, v${majorVersion}.${minorVersion}.${patchVersion}`
    );

    const proposedVersionSchema = await this.polywrapClient.getSchema(
      `ipfs/${packageLocation}`
    );

    let isVersionApproved = false;
    let prevMinorNodeId: BytesLike = ethers.constants.HashZero;
    let nextMinorNodeId: BytesLike = ethers.constants.HashZero;

    if (isPatch) {
      isVersionApproved = await this.verifyPatchVersion(
        proposedVersionSchema,
        patchNodeId
      );
    } else {
      const result = await this.verifyMinorVersion(
        proposedVersionSchema,
        patchNodeId
      );

      isVersionApproved = result.approved;
      prevMinorNodeId = result.prevMinorNodeId;
      nextMinorNodeId = result.nextMinorNodeId;
    }

    return {
      prevMinorNodeId,
      nextMinorNodeId,
      approved: isVersionApproved,
    };
  }

  @traceFunc("VersionVerifierService:verifyMinorVersion")
  private async verifyMinorVersion(
    proposedVersionSchema: string,
    patchNodeId: BytesLike
  ): Promise<{
    prevMinorNodeId: BytesLike;
    nextMinorNodeId: BytesLike;
    approved: boolean;
  }> {
    const {
      prevMinorNodeId,
      prevSchema,
      nextMinorNodeId,
      nextSchema,
    } = await this.schemaRetrievalService.getPreviousAndNextVersionSchema(
      patchNodeId
    );

    return {
      prevMinorNodeId,
      nextMinorNodeId,
      approved: true,
      // approved: areSchemasBacwardCompatible(prevSchema, proposedVersionSchema) &&
      //   areSchemasBacwardCompatible(proposedVersionSchema, nextSchema)
    };
  }

  private async verifyPatchVersion(
    proposedVersionSchema: string,
    patchNodeId: BytesLike
  ): Promise<boolean> {
    // return true;

    const minorVersionSchema = await this.schemaRetrievalService.getMinorVersionSchema(
      patchNodeId
    );

    return this.schemaComparisonService.areSchemasFunctionallyIdentical(
      proposedVersionSchema,
      minorVersionSchema
    );
  }
}
