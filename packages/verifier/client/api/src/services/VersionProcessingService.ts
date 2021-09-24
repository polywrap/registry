import { ProposedVersionEventArgs } from "../events/ProposedVersionEventArgs";
import { VerifierStateInfo } from "../VerifierStateInfo";
import { VersionVerifierService } from "./VersionVerifierService";
import { VotingService } from "./VotingService";
import { Logger } from "winston";
import { traceFunc } from "@polywrap/registry-js";

export class VersionProcessingService {
  private logger: Logger;
  private votingService: VotingService;
  private versionVerifierService: VersionVerifierService;

  constructor(deps: {
    logger: Logger;
    votingService: VotingService;
    versionVerifierService: VersionVerifierService;
  }) {
    this.logger = deps.logger;
    this.votingService = deps.votingService;
    this.versionVerifierService = deps.versionVerifierService;
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
    const {
      packageId,
      patchNodeId,
      majorVersion,
      minorVersion,
      patchVersion,
      packageLocation,
      proposer,
      isPatch,
    } = proposedVersion;

    this.logger.info(
      `Version proposed: ${patchNodeId}, ${majorVersion}, ${minorVersion}, ${patchVersion}`
    );

    const {
      prevMinorNodeId,
      nextMinorNodeId,
      approved,
    } = await this.versionVerifierService.verifyVersion(
      packageId,
      patchNodeId,
      majorVersion,
      minorVersion,
      patchVersion,
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
