import { BytesLike, ethers } from "ethers";
import { Web3ApiClient } from "@web3api/client-js";
import { SchemaComparisonService } from "./SchemaComparisonService";
import { SchemaRetrievalService } from "./SchemaRetrievalService";
import { Logger } from "winston";
import { handleError, traceFunc } from "@polywrap/registry-js";
import { toPrettyHex } from "../helpers/toPrettyHex";
import { VerifyVersionInfo } from "../types/VerifyVersionInfo";
import { ValidPackage } from "../types/ValidPackage";

export class VersionVerifierService {
  private logger: Logger;
  private polywrapClient: Web3ApiClient;
  private schemaRetrievalService: SchemaRetrievalService;
  private schemaComparisonService: SchemaComparisonService;
  private getSchema: any;
  private getManifest: any;

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
    this.getSchema = handleError(this.polywrapClient.getSchema);
    this.getManifest = handleError(this.polywrapClient.getManifest);
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

    const [isValid, proposedVersionSchema] = await this.validatePackage(
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

      isVersionApproved = verifyVersionInfo.approved && isValid;
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
  ): Promise<ValidPackage> {
    const [schema, schemaError] = await this.getSchema(
      `ipfs/${packageLocation}`
    );
    if (schemaError) {
      return [false, undefined];
    }

    const [manifest, manifestError] = await this.getManifest(
      `ipfs/${packageLocation}`
    );
    if (manifestError && manifest) {
      return [false, schema];
    }
  }
}
