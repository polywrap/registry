import { BytesLike, ethers } from "ethers";
import { create, IPFSHTTPClient } from "ipfs-http-client";
import { getSchemaFileFromIpfs } from "../ipfs/getSchemaFileFromIpfs";
import { areSchemasFunctionallyIdentical } from "../schema-comparison/areSchemasFunctionallyIdentical";
import { VotingMachine } from "../typechain";
import { verifyMinorVersion } from "./verifyMinorVersion";
import { verifyPatchVersion } from "./verifyPatchVersion";

export const verifyVersion = async (
  votingMachine: VotingMachine,
  client: IPFSHTTPClient,
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
}> => {
  console.log(`Verifying proposed version: ${packageId}, v${majorVersion}.${minorVersion}.${patchVersion}`);

  const proposedVersionSchema = await getSchemaFileFromIpfs(client, packageLocation);

  let isVersionApproved = false;
  let prevMinorNodeId: BytesLike = ethers.constants.HashZero;
  let nextMinorNodeId: BytesLike = ethers.constants.HashZero;

  if (isPatch) {
    isVersionApproved = await verifyPatchVersion(
      votingMachine,
      client,
      proposedVersionSchema,
      patchNodeId,
    );
  } else {
    const result = await verifyMinorVersion(
      votingMachine,
      client,
      proposedVersionSchema,
      patchNodeId,
    );

    prevMinorNodeId = result.prevMinorNodeId;
    nextMinorNodeId = result.nextMinorNodeId;
  }

  return {
    prevMinorNodeId,
    nextMinorNodeId,
    approved: isVersionApproved
  };
};