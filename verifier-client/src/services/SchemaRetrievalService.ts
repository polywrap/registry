import { BytesLike } from "ethers";
import { IPFSHTTPClient } from "ipfs-http-client";
import { getSchemaFileFromIpfs } from "../ipfs/getSchemaFileFromIpfs";
import { VotingMachine } from "../typechain";

export class SchemaRetrievalService {
  private votingMachine: VotingMachine;
  private ipfsClient: IPFSHTTPClient;

  constructor(deps: {
    votingMachine: VotingMachine,
    ipfsClient: IPFSHTTPClient
  }) {
    this.votingMachine = deps.votingMachine;
    this.ipfsClient = deps.ipfsClient;
  }

  getMinorVersionSchema = async (
    patchNodeId: BytesLike,
  ): Promise<string> => {
    const location = await this.votingMachine.getPrevPatchPackageLocation(patchNodeId);
    const minorVersionSchema = await getSchemaFileFromIpfs(this.ipfsClient, location);

    return minorVersionSchema;
  }

  getPreviousAndNextVersionSchema = async (
    patchNodeId: BytesLike,
  ): Promise<{
    prevMinorNodeId: BytesLike,
    prevSchema: string | undefined,
    nextMinorNodeId: BytesLike,
    nextSchema: string | undefined
  }> => {
    const { prevMinorNodeId, prevPackageLocation, nextMinorNodeId, nextPackageLocation } = await this.votingMachine.getPrevAndNextMinorPackageLocations(patchNodeId);

    const prevSchema = prevPackageLocation
      ? await getSchemaFileFromIpfs(this.ipfsClient, prevPackageLocation)
      : undefined;

    const nextSchema = nextPackageLocation
      ? await getSchemaFileFromIpfs(this.ipfsClient, nextPackageLocation)
      : undefined;

    return {
      prevMinorNodeId,
      prevSchema,
      nextMinorNodeId,
      nextSchema
    };
  }
}