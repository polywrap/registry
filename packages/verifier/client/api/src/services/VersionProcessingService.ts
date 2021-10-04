import { ProposedVersionEventArgs } from "../events/ProposedVersionEventArgs";
import { VerifierStateInfo } from "../VerifierStateInfo";
import { VersionVerifierService } from "./VersionVerifierService";
import { VotingService } from "./VotingService";
import { Logger } from "winston";
import { PolywrapVotingSystem, traceFunc } from "@polywrap/registry-js";
import { toPrettyHex } from "../helpers/toPrettyHex";

export class VersionProcessingService {
  private logger: Logger;
  private votingService: VotingService;
  private versionVerifierService: VersionVerifierService;
  private polywrapVotingSystem: PolywrapVotingSystem;

  constructor(deps: {
    logger: Logger;
    votingService: VotingService;
    versionVerifierService: VersionVerifierService;
    polywrapVotingSystem: PolywrapVotingSystem;
  }) {
    this.logger = deps.logger;
    this.votingService = deps.votingService;
    this.versionVerifierService = deps.versionVerifierService;
    this.polywrapVotingSystem = deps.polywrapVotingSystem;
  }

  @traceFunc("version-processing-service:process_proposed_version_event")
  async processProposedVersionEvent(
    stateInfo: VerifierStateInfo,
    event: {
      blockNumber: number;
      transactionIndex: number;
      logIndex: number;
      args: ProposedVersionEventArgs;
    }
  ): Promise<void> {
    if (event.blockNumber < stateInfo.currentlyProcessingBlock) {
      return;
    } else if (event.blockNumber > stateInfo.currentlyProcessingBlock) {
      stateInfo.lastProcessedBlock = stateInfo.currentlyProcessingBlock;
      stateInfo.currentlyProcessingBlock = event.blockNumber;

      stateInfo.lastProcessedTransactionIndex = -1;
      stateInfo.lastProcessedLogIndex = -1;
    } else {
      if (event.transactionIndex < stateInfo.lastProcessedTransactionIndex) {
        return;
      } else if (
        event.transactionIndex > stateInfo.lastProcessedTransactionIndex
      ) {
        stateInfo.lastProcessedLogIndex = -1;
      } else {
        if (event.logIndex <= stateInfo.lastProcessedLogIndex) {
          return;
        }
      }
    }

    await this.processProposedVersion(event.args);

    stateInfo.lastProcessedTransactionIndex = event.transactionIndex;
    stateInfo.lastProcessedLogIndex = event.logIndex;
  }

  @traceFunc("version-processing-service:process_proposed_version")
  async processProposedVersion(
    proposedVersion: ProposedVersionEventArgs
  ): Promise<void> {
    const { patchNodeId, isPatch } = proposedVersion;

    this.logger.info(
      `Processing ${toPrettyHex(patchNodeId.toString())} version.`
    );

    const _proposedVersion = await this.polywrapVotingSystem.getProposedVersion(
      patchNodeId
    );

    const {
      packageId,
      majorVersion,
      minorVersion,
      patchVersion,
      packageLocation,
      decided,
    } = _proposedVersion;

    if (decided) {
      this.logger.info(`Version is already decided.`);
      return;
    }

    this.logger.info(
      `Version proposed: ${toPrettyHex(
        patchNodeId.toString()
      )}, ${majorVersion}, ${minorVersion}, ${patchVersion}`
    );

    const {
      prevMinorNodeId,
      nextMinorNodeId,
      approved,
    } = await this.versionVerifierService.verifyVersion(
      packageId,
      patchNodeId,
      majorVersion.toNumber(),
      minorVersion.toNumber(),
      patchVersion.toNumber(),
      packageLocation,
      isPatch
    );

    await this.votingService.voteOnVersion(
      patchNodeId,
      prevMinorNodeId,
      nextMinorNodeId,
      approved
    );
  }
}
