import { BytesLike } from "ethers";
import { IPFSHTTPClient } from "ipfs-http-client";
import { getSchemaFileFromIpfs } from "../ipfs/getSchemaFileFromIpfs";
import { VotingMachine } from "../typechain";

export const getMinorVersionSchema = async (
  votingMachine: VotingMachine, 
  client: IPFSHTTPClient, 
  patchNodeId: BytesLike,
): Promise<string> => {
  const location = await votingMachine.getPrevPatchPackageLocation(patchNodeId);
  const minorVersionSchema = await getSchemaFileFromIpfs(client, location);

  return minorVersionSchema;
};