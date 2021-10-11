import { CallOverrides, ContractReceipt, Overrides, Signer } from "ethers";
import { BytesLike } from "ethers/lib/utils";
import { RegistryContracts } from "./RegistryContracts";
import {
  PrevAndNextMinorPackageLocations,
  ProposedVersion,
  VersionVotingStartedEvent,
} from "./types";

export const CanVoteOnVersionReverts = [
  "Voting has not started",
  "Voting for this version has ended",
  "You already voted",
] as const;
export type CanVoteOnVersionRevert = typeof CanVoteOnVersionReverts[number];

export const ValidMinorVersionPlacementReverts = [
  "Previous version number is not less than the current one",
  "Previous version does not point to the next version",
  "Previous version does not belong to the same major version",
  "Next version number is not greater than the current one",
  "Next version does not point to the previous version",
  "Next version does not belong to the same major version",
] as const;
export type ValidMinorVersionPlacementRevert = typeof ValidMinorVersionPlacementReverts[number];

export const PrevPatchPackageLocationReverts = CanVoteOnVersionReverts;
export type PrevPatchPackageLocationRevert = typeof PrevPatchPackageLocationReverts[number];

export const PrevAndNextMinorPackageLocationsReverts = CanVoteOnVersionReverts;
export type PrevAndNextMinorPackageLocationsRevert = typeof PrevAndNextMinorPackageLocationsReverts[number];

export const VoteReverts = [
  ...CanVoteOnVersionReverts,
  ...ValidMinorVersionPlacementReverts,
] as const;
export type VoteRevert = typeof VoteReverts[number];

export class PolywrapVotingSystem {
  constructor(signer: Signer, registryContracts: RegistryContracts) {
    this.signer = signer;
    this.registryContracts = registryContracts.connect(signer);
  }

  signer: Signer;
  private registryContracts: RegistryContracts;

  async vote(
    votes: {
      patchNodeId: BytesLike;
      prevMinorNodeId: BytesLike;
      nextMinorNodeId: BytesLike;
      approved: boolean;
    }[],
    numOfConfirmationsToWait: number,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractReceipt> {
    const tx = await (overrides
      ? this.registryContracts.votingMachine.vote(votes, overrides)
      : this.registryContracts.votingMachine.vote(votes));
    const receipt = await tx.wait(numOfConfirmationsToWait);
    return receipt;
  }

  async getPrevPatchPackageLocation(
    patchNodeId: BytesLike,
    overrides?: CallOverrides
  ): Promise<string> {
    return await (overrides
      ? this.registryContracts.votingMachine.getPrevPatchPackageLocation(
          patchNodeId,
          overrides
        )
      : this.registryContracts.votingMachine.getPrevPatchPackageLocation(
          patchNodeId
        ));
  }

  async getPrevAndNextMinorPackageLocations(
    patchNodeId: BytesLike,
    overrides?: CallOverrides
  ): Promise<PrevAndNextMinorPackageLocations> {
    return await (overrides
      ? this.registryContracts.votingMachine.getPrevAndNextMinorPackageLocations(
          patchNodeId,
          overrides
        )
      : this.registryContracts.votingMachine.getPrevAndNextMinorPackageLocations(
          patchNodeId
        ));
  }

  async getProposedVersion(patchNodeId: BytesLike): Promise<ProposedVersion> {
    return await this.registryContracts.votingMachine.proposedVersions(
      patchNodeId
    );
  }

  async queryVersionVotingStarted(
    blockNumber: number
  ): Promise<VersionVotingStartedEvent[]> {
    const result = await this.registryContracts.votingMachine.queryFilter(
      this.registryContracts.votingMachine.filters.VersionVotingStarted(),
      blockNumber
    );

    return (result as unknown) as VersionVotingStartedEvent[];
  }
}
