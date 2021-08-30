import { BytesLike } from "ethers";
import { IPFSHTTPClient } from "ipfs-http-client";
import { areSchemasBacwardCompatible } from "../schema-comparison/areSchemasBacwardCompatible";
import { getPreviousAndNextVersionSchema } from "../schema-retrieval/getPreviousAndNextVersionSchema";
import { VotingMachine } from "../typechain";

export const verifyMinorVersion = async (
  votingMachine: VotingMachine,
  client: IPFSHTTPClient, 
  proposedVersionSchema: string,
  patchNodeId: BytesLike
): Promise<{
  prevMinorNodeId: BytesLike,
  nextMinorNodeId: BytesLike,
  approved: boolean
}> => {
  const { prevMinorNodeId, prevSchema, nextMinorNodeId, nextSchema } = await getPreviousAndNextVersionSchema(
    votingMachine,
    client, 
    patchNodeId
  );

  return {
    prevMinorNodeId,
    nextMinorNodeId,
    approved: areSchemasBacwardCompatible(prevSchema, proposedVersionSchema) && 
    areSchemasBacwardCompatible(proposedVersionSchema, nextSchema)
  }
};