import { BytesLike, ethers } from "ethers";
import { create, IPFSHTTPClient } from "ipfs-http-client";
import { getSchemaFileFromIpfs } from "../ipfs/getSchemaFileFromIpfs";
import { SchemaComparisonService } from "./SchemaComparisonService";
import { SchemaRetrievalService } from "./SchemaRetrievalService";

export class VersionVerifierService {
  private ipfsClient: IPFSHTTPClient;
  private schemaRetrievalService: SchemaRetrievalService;
  private schemaComparisonService: SchemaComparisonService

  constructor(deps: {
    ipfsClient: IPFSHTTPClient
    schemaRetrievalService: SchemaRetrievalService,
    schemaComparisonService: SchemaComparisonService
  }) {
    this.ipfsClient = deps.ipfsClient;
    this.schemaRetrievalService = deps.schemaRetrievalService;
    this.schemaComparisonService = deps.schemaComparisonService;
  }

  async verifyVersion(
    packageId: BytesLike,
    patchNodeId: BytesLike,
    majorVersion: number,
    minorVersion: number,
    patchVersion: number,
    packageLocation: string,
    isPatch: boolean
  ): Promise<{
    prevMinorNodeId: BytesLike,
    nextMinorNodeId: BytesLike,
    approved: boolean
  }> {
    console.log(`Verifying proposed version: ${packageId}, v${majorVersion}.${minorVersion}.${patchVersion}`);

    const proposedVersionSchema = await getSchemaFileFromIpfs(this.ipfsClient, packageLocation);

    let isVersionApproved = false;
    let prevMinorNodeId: BytesLike = ethers.constants.HashZero;
    let nextMinorNodeId: BytesLike = ethers.constants.HashZero;

    if (isPatch) {
      isVersionApproved = await this.verifyPatchVersion(
        proposedVersionSchema,
        patchNodeId,
      );
    } else {
      const result = await this.verifyMinorVersion(
        proposedVersionSchema,
        patchNodeId,
      );

      isVersionApproved = result.approved;
      prevMinorNodeId = result.prevMinorNodeId;
      nextMinorNodeId = result.nextMinorNodeId;
    }

    return {
      prevMinorNodeId,
      nextMinorNodeId,
      approved: isVersionApproved
    };
  }

  private async verifyMinorVersion(
    proposedVersionSchema: string,
    patchNodeId: BytesLike
  ): Promise<{
    prevMinorNodeId: BytesLike,
    nextMinorNodeId: BytesLike,
    approved: boolean
  }> {
    const { prevMinorNodeId, prevSchema, nextMinorNodeId, nextSchema } = await this.schemaRetrievalService.getPreviousAndNextVersionSchema(
      patchNodeId
    );

    return {
      prevMinorNodeId,
      nextMinorNodeId,
      approved: true
      // approved: areSchemasBacwardCompatible(prevSchema, proposedVersionSchema) &&
      //   areSchemasBacwardCompatible(proposedVersionSchema, nextSchema)
    };
  }

  private async verifyPatchVersion(
    proposedVersionSchema: string,
    patchNodeId: BytesLike,
  ): Promise<boolean> {
    // return true;

    const minorVersionSchema = await this.schemaRetrievalService.getMinorVersionSchema(
      patchNodeId,
    );

    return this.schemaComparisonService.areSchemasFunctionallyIdentical(proposedVersionSchema, minorVersionSchema);
  }
}