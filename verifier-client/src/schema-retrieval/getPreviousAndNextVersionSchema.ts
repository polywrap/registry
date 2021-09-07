import { BytesLike } from "ethers";
import { IPFSHTTPClient } from "ipfs-http-client";
import { getSchemaFileFromIpfs } from "../ipfs/getSchemaFileFromIpfs";
import { VotingMachine } from "../typechain";

export const getPreviousAndNextVersionSchema = async (
  votingMachine: VotingMachine, 
  client: IPFSHTTPClient, 
  patchNodeId: BytesLike,
): Promise<{
  prevMinorNodeId: BytesLike, 
  prevSchema: string | undefined,
  nextMinorNodeId: BytesLike, 
  nextSchema: string | undefined
}> => {
  const { prevMinorNodeId, prevPackageLocation, nextMinorNodeId, nextPackageLocation } = await votingMachine.getPrevAndNextMinorPackageLocations(patchNodeId);
 
  const prevSchema = prevPackageLocation
    ? await getSchemaFileFromIpfs(client, prevPackageLocation)
    : undefined;

  const nextSchema = nextPackageLocation
    ? await getSchemaFileFromIpfs(client, nextPackageLocation)
    : undefined;

  return {
    prevMinorNodeId, 
    prevSchema,
    nextMinorNodeId, 
    nextSchema
  }; 
};