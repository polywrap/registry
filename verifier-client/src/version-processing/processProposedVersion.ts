import { BytesLike } from "ethers";
import { IPFSHTTPClient } from "ipfs-http-client";
import { VotingMachine } from "../typechain";
import { verifyVersion } from "../version-verification/verifyVersion";
import { ProposedVersionEventArgs } from "./ProposedVersionEventArgs";
import { voteOnVersion } from "./voteOnVersion";

export const processProposedVersion = async (
  votingMachine: VotingMachine,
  client: IPFSHTTPClient,
  proposedVersion: ProposedVersionEventArgs
) => {
  const {
    packageId,
    patchNodeId,
    majorVersion,
    minorVersion,
    patchVersion,
    packageLocation,
    proposer,
    isPatch
  } = proposedVersion;

  console.log(`Version proposed: ${patchNodeId}, ${majorVersion}, ${minorVersion}, ${patchVersion}`);

  const {
    prevMinorNodeId,
    nextMinorNodeId,
    approved
  } = await verifyVersion(
    votingMachine,
    client,
    packageId, 
    patchNodeId,
    majorVersion,
    minorVersion,
    patchVersion,
    packageLocation,
    isPatch);

  await voteOnVersion(votingMachine, patchNodeId, prevMinorNodeId, nextMinorNodeId, approved);
};