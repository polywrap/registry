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
  prevSchema: string,
  nextMinorNodeId: BytesLike, 
  nextSchema: string
}> => {
  const { prevMinorNodeId, prevPackageLocation, nextMinorNodeId, nextPackageLocation } = await votingMachine.getPrevAndNextMinorPackageLocations(patchNodeId);
 
  const prevSchema = await getSchemaFileFromIpfs(client, prevPackageLocation);
  const nextSchema = await getSchemaFileFromIpfs(client, nextPackageLocation);

  return {
    prevMinorNodeId, 
    prevSchema,
    nextMinorNodeId, 
    nextSchema
  }; 
};