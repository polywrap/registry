import { BytesLike, ethers } from "ethers";
import { Web3ApiClient } from "@web3api/client-js";
import { SchemaComparisonService } from "./SchemaComparisonService";
import { SchemaRetrievalService } from "./SchemaRetrievalService";
import { Logger } from "winston";
import { traceFunc } from "@polywrap/registry-js";
import { toPrettyHex } from "../helpers/toPrettyHex";
import { VerifyVersionInfo } from "../types/VerifyVersionInfo";

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

  @traceFunc("version-verifier-service:verify_version")
  async verifyVersion(
    packageId: BytesLike,
    patchNodeId: BytesLike,
    majorVersion: number,
    minorVersion: number,
    patchVersion: number,
    packageLocation: string,
    isPatch: boolean
  ): Promise<VerifyVersionInfo> {
    this.logger.info(
      `Verifying proposed version: ${toPrettyHex(
        patchNodeId.toString()
      )}, v${majorVersion}.${minorVersion}.${patchVersion}`
    );

    const proposedVersionSchema = await this.polywrapClient.getSchema(
      `ipfs/${packageLocation}`
    );

    let isVersionApproved = false;
    let prevMinorNodeId: BytesLike = ethers.constants.HashZero;
    let nextMinorNodeId: BytesLike = ethers.constants.HashZero;

    if (isPatch) {
      const result = await this.verifyPatchVersion(
        proposedVersionSchema,
        patchNodeId
      );

      isVersionApproved = result as boolean;
    } else {
      const verifyVersionInfo = await this.verifyMinorVersion(
        proposedVersionSchema,
        patchNodeId
      );

      isVersionApproved = verifyVersionInfo.approved;
      prevMinorNodeId = verifyVersionInfo.prevMinorNodeId;
      nextMinorNodeId = verifyVersionInfo.nextMinorNodeId;
    }

    return { prevMinorNodeId, nextMinorNodeId, approved: isVersionApproved };
  }

  @traceFunc("version-verifier-service:verify_minor_version")
  private async verifyMinorVersion(
    proposedVersionSchema: string,
    patchNodeId: BytesLike
  ): Promise<VerifyVersionInfo> {
    const previousAndNextVersionSchema = await this.schemaRetrievalService.getPreviousAndNextVersionSchema(
      patchNodeId
    );

    const {
      prevMinorNodeId,
      prevSchema,
      nextMinorNodeId,
      nextSchema,
    } = previousAndNextVersionSchema;

    if (prevSchema === undefined || nextSchema === undefined) {
      return {
        prevMinorNodeId,
        nextMinorNodeId,
        approved: false,
      };
    }
    return {
      prevMinorNodeId,
      nextMinorNodeId,
      approved: true,
      // approved: areSchemasBacwardCompatible(prevSchema, proposedVersionSchema) &&
      //   areSchemasBacwardCompatible(proposedVersionSchema, nextSchema)
    };
  }

  @traceFunc("version-verifier-service:verify_minor_version")
  private async verifyPatchVersion(
    proposedVersionSchema: string,
    patchNodeId: BytesLike
  ): Promise<boolean> {
    const minorVersionSchema = await this.schemaRetrievalService.getMinorVersionSchema(
      patchNodeId
    );
    if (minorVersionSchema) {
      const approved = this.schemaComparisonService.areSchemasFunctionallyIdentical(
        proposedVersionSchema,
        minorVersionSchema
      );
      return approved;
    }
    return false;
  }
}
