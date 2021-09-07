import { BytesLike } from "ethers";
import { IPFSHTTPClient } from "ipfs-http-client";
import { getSchemaFileFromIpfs } from "../ipfs/getSchemaFileFromIpfs";
import { areSchemasFunctionallyIdentical } from "../schema-comparison/areSchemasFunctionallyIdentical";
import { VotingMachine } from "../typechain";
import { getMinorVersionSchema } from "../schema-retrieval/getMinorVersionSchema";

export const verifyPatchVersion = async (
  votingMachine: VotingMachine,
  client: IPFSHTTPClient,
  proposedVersionSchema: string,
  patchNodeId: BytesLike,
): Promise<boolean> => {
  // return true;

  const minorVersionSchema = await getMinorVersionSchema(
    votingMachine,
    client,
    patchNodeId,
  );

  return areSchemasFunctionallyIdentical(proposedVersionSchema, minorVersionSchema);
};
