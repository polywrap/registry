import { BytesLike, ethers } from "ethers";
import { Web3ApiClient } from "@web3api/client-js";
import { SchemaComparisonService } from "./SchemaComparisonService";
import { SchemaRetrievalService } from "./SchemaRetrievalService";
import { Logger } from "winston";
import { ContractCallResult, traceFunc } from "@polywrap/registry-js";
import { toPrettyHex } from "../helpers/toPrettyHex";
import { VerifyVersionInfo } from "../helpers/VerifyVersionInfo";
import { PreviousAndNextVersionSchema } from "../helpers/PreviousAndNextVersionSchema";

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
  ): Promise<ContractCallResult<VerifyVersionInfo>> {
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
      if (result.error) {
        return {
          data: null,
          error: result.error,
        };
      }

      isVersionApproved = result.data as boolean;
    } else {
      const result = await this.verifyMinorVersion(
        proposedVersionSchema,
        patchNodeId
      );

      if (result.error) {
        return {
          data: null,
          error: result.error,
        };
      }

      const data = result.data as VerifyVersionInfo;

      isVersionApproved = data.approved;
      prevMinorNodeId = data.prevMinorNodeId;
      nextMinorNodeId = data.nextMinorNodeId;
    }

    return {
      data: { prevMinorNodeId, nextMinorNodeId, approved: isVersionApproved },
      error: null,
    };
  }

  @traceFunc("version-verifier-service:verify_minor_version")
  private async verifyMinorVersion(
    proposedVersionSchema: string,
    patchNodeId: BytesLike
  ): Promise<ContractCallResult<VerifyVersionInfo>> {
    const result = await this.schemaRetrievalService.getPreviousAndNextVersionSchema(
      patchNodeId
    );

    if (result.error) {
      return {
        data: null,
        error: result.error,
      };
    }

    const {
      prevMinorNodeId,
      prevSchema,
      nextMinorNodeId,
      nextSchema,
    } = result.data as PreviousAndNextVersionSchema;

    const data = {
      prevMinorNodeId,
      nextMinorNodeId,
      approved: true,
      // approved: areSchemasBacwardCompatible(prevSchema, proposedVersionSchema) &&
      //   areSchemasBacwardCompatible(proposedVersionSchema, nextSchema)
    };
    return {
      data: data,
      error: null,
    };
  }

  @traceFunc("version-verifier-service:verify_minor_version")
  private async verifyPatchVersion(
    proposedVersionSchema: string,
    patchNodeId: BytesLike
  ): Promise<ContractCallResult<boolean>> {
    // return true;

    const result = await this.schemaRetrievalService.getMinorVersionSchema(
      patchNodeId
    );

    if (result.error) {
      return {
        data: null,
        error: result.error,
      };
    }

    const data = this.schemaComparisonService.areSchemasFunctionallyIdentical(
      proposedVersionSchema,
      result.data as string
    );
    return {
      data: data,
      error: null,
    };
  }
}
