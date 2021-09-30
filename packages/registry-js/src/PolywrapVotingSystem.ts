import { CallOverrides, ContractReceipt, Overrides, Signer } from "ethers";
import { BytesLike } from "ethers/lib/utils";
import { Logger } from "winston";
import { ContractCallResult } from "./helpers/contractResultTypes";
import { ErrorHandler } from "./errorHandler";
import { LogLevel } from "./logger";
import { PrevAndNextMinorPackageLocations } from "./helpers/PrevAndNextMinorPackageLocations";
import { ProposedVersion } from "./helpers/ProposedVersion";
import { RegistryContracts } from "./RegistryContracts";
import { VersionVotingStartedEvent } from "./helpers/VersionVotingStartedEvent";

export class PolywrapVotingSystem extends ErrorHandler {
  constructor(
    signer: Signer,
    registryContracts: RegistryContracts,
    logger: Logger
  ) {
    super();
    this.signer = signer;
    this.registryContracts = registryContracts.connect(signer);
    this.logger = logger;
  }

  logger: Logger;
  signer: Signer;
  private registryContracts: RegistryContracts;

  private requireCanVoteOnVersion: string[] = [
    "Voting has not started",
    "Voting for this version has ended",
    "You already voted",
  ];

  private requireValidMinorVersionPlacement: string[] = [
    "Previous version number is not less than the current one",
    "Previous version does not point to the next version",
    "Previous version does not belong to the same major version",
    "Next version number is not greater than the current one",
    "Next version does not point to the previous version",
    "Next version does not belong to the same major version",
  ];

  @PolywrapVotingSystem.errorHandler(LogLevel.warn)
  async vote(
    votes: {
      patchNodeId: BytesLike;
      prevMinorNodeId: BytesLike;
      nextMinorNodeId: BytesLike;
      approved: boolean;
    }[],
    numOfConfirmationsToWait: number,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractCallResult<ContractReceipt>> {
    const tx = await (overrides
      ? this.registryContracts.votingMachine.vote(votes, overrides)
      : this.registryContracts.votingMachine.vote(votes));
    const receipt = await tx.wait(numOfConfirmationsToWait);
    return {
      data: receipt,
      error: null,
    };
  }

  @PolywrapVotingSystem.errorHandler(LogLevel.warn)
  async getPrevPatchPackageLocation(
    patchNodeId: BytesLike,
    overrides?: CallOverrides
  ): Promise<ContractCallResult<string>> {
    const result = await (overrides
      ? this.registryContracts.votingMachine.getPrevPatchPackageLocation(
          patchNodeId,
          overrides
        )
      : this.registryContracts.votingMachine.getPrevPatchPackageLocation(
          patchNodeId
        ));
    return {
      data: result,
      error: null,
    };
  }

  @PolywrapVotingSystem.errorHandler(LogLevel.warn)
  async getPrevAndNextMinorPackageLocations(
    patchNodeId: BytesLike,
    overrides?: CallOverrides
  ): Promise<ContractCallResult<PrevAndNextMinorPackageLocations>> {
    const result = await (overrides
      ? this.registryContracts.votingMachine.getPrevAndNextMinorPackageLocations(
          patchNodeId,
          overrides
        )
      : this.registryContracts.votingMachine.getPrevAndNextMinorPackageLocations(
          patchNodeId
        ));
    return {
      data: result as PrevAndNextMinorPackageLocations,
      error: null,
    };
  }

  @PolywrapVotingSystem.errorHandler(LogLevel.warn)
  async getProposedVersion(
    patchNodeId: BytesLike
  ): Promise<ContractCallResult<ProposedVersion>> {
    const resp = await this.registryContracts.votingMachine.proposedVersions(
      patchNodeId
    );
    return {
      data: resp as ProposedVersion,
      error: null,
    };
  }

  async queryVersionVotingStarted(
    blockNumber: number
  ): Promise<VersionVotingStartedEvent[]> {
    const resp = await this.registryContracts.votingMachine.queryFilter(
      this.registryContracts.votingMachine.filters.VersionVotingStarted(),
      blockNumber
    );

    return (resp as unknown) as VersionVotingStartedEvent[];
  }

  get prevPatchPackageLocationReverts(): string[] {
    return this.requireCanVoteOnVersion;
  }

  get prevAndNextMinorPackageLocationsReverts(): string[] {
    return this.requireCanVoteOnVersion;
  }

  get voteReverts(): string[] {
    return [
      ...this.requireCanVoteOnVersion,
      ...this.requireValidMinorVersionPlacement,
    ];
  }
}
