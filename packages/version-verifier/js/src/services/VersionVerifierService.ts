import { BytesLike, ethers } from "ethers";
import { Web3ApiClient } from "@web3api/client-js";
import { SchemaComparisonService } from "./SchemaComparisonService";
import { SchemaRetrievalService } from "./SchemaRetrievalService";
import { Logger } from "winston";
import { handleError, traceFunc } from "@polywrap/registry-js";
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

    const [
      isValid,
      proposedVersionSchema,
      reasonForInvalid,
    ] = await this.validatePackage(`ipfs/${packageLocation}`);

    let isVersionApproved = false;
    let prevMinorNodeId: BytesLike = ethers.constants.HashZero;
    let nextMinorNodeId: BytesLike = ethers.constants.HashZero;
    let reason: string | undefined;

    if (!isValid) {
      this.logger.info(reasonForInvalid);
      return {
        prevMinorNodeId,
        nextMinorNodeId,
        approved: false,
        reason: reasonForInvalid,
      };
    }

    if (isPatch) {
      this.logger.debug(`Version is patch`);
      const result = await this.verifyPatchVersion(
        proposedVersionSchema as string,
        patchNodeId
      );

      isVersionApproved = result as boolean;
      reason = !isVersionApproved
        ? "Schema isn't compatible for patch release"
        : undefined;
    } else {
      this.logger.debug(`Version is minor`);
      const verifyVersionInfo = await this.verifyMinorVersion(
        proposedVersionSchema as string,
        patchNodeId
      );

      isVersionApproved = verifyVersionInfo.approved;
      prevMinorNodeId = verifyVersionInfo.prevMinorNodeId;
      nextMinorNodeId = verifyVersionInfo.nextMinorNodeId;
      reason = !isVersionApproved
        ? "Schema isn't compatible for minor release"
        : undefined;
    }

    return {
      prevMinorNodeId,
      nextMinorNodeId,
      reason,
      approved: isVersionApproved,
    };
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

    let approved =
      prevMinorNodeId === ethers.constants.HashZero ||
      this.schemaComparisonService.areSchemasBacwardCompatible(
        prevSchema,
        proposedVersionSchema
      );
    approved &&=
      nextMinorNodeId === ethers.constants.HashZero ||
      this.schemaComparisonService.areSchemasBacwardCompatible(
        proposedVersionSchema,
        nextSchema
      );

    return {
      prevMinorNodeId,
      nextMinorNodeId,
      approved,
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
    if (!minorVersionSchema) return false;
    const approved = this.schemaComparisonService.areSchemasFunctionallyIdentical(
      proposedVersionSchema,
      minorVersionSchema
    );
    return approved;
  }

  @traceFunc("version-verifier-service:validate-package")
  private async validatePackage(
    packageLocation: string
  ): Promise<[isValid: boolean, schema?: string, reason?: string]> {
    const [manifestError, manifest] = await handleError(() =>
      this.polywrapClient.getManifest(`${packageLocation}`, {
        type: "web3api",
      })
    )();
    if (manifestError && manifest) {
      this.logger.info(`Error: ${manifestError.message}`);
      return [false, undefined, "Package is missing manifest file"];
    }

    const [schemaError, schema] = await handleError(() =>
      this.polywrapClient.getSchema(`${packageLocation}`)
    )();
    if (schemaError) {
      this.logger.info(`Error: ${schemaError.message}`);
      return [false, undefined, "Package is missing schema file"];
    }

    return [true, schema, undefined];
  }
}
