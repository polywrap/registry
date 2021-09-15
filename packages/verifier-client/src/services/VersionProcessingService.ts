import { ProposedVersionEventArgs } from "../events/ProposedVersionEventArgs";
import { VerifierStateInfo } from "../VerifierStateInfo";
import { VersionVerifierService } from "./VersionVerifierService";
import { VotingService } from "./VotingService";

export class VersionProcessingService {
  private votingService: VotingService;
  private versionVerifierService: VersionVerifierService;

  constructor(deps: {
    votingService: VotingService,
    versionVerifierService: VersionVerifierService,
  }) {
    this.votingService = deps.votingService;
    this.versionVerifierService = deps.versionVerifierService;
  }

  async processProposedVersionEvent(
    stateInfo: VerifierStateInfo,
    event: {
      blockNumber: number,
      transactionIndex: number,
      logIndex: number,
      args: ProposedVersionEventArgs
    }
  ): Promise<void> {
    if (event.blockNumber < stateInfo.currentlyProcessingBlock) {
      return;
    }
    else if (event.blockNumber > stateInfo.currentlyProcessingBlock) {
      stateInfo.lastProcessedBlock = stateInfo.currentlyProcessingBlock;
      stateInfo.currentlyProcessingBlock = event.blockNumber;

      stateInfo.lastProcessedTransactionIndex = -1;
      stateInfo.lastProcessedLogIndex = -1;
    }
    else {
      if (event.transactionIndex < stateInfo.lastProcessedTransactionIndex) {
        return;
      }
      else if (event.transactionIndex > stateInfo.lastProcessedTransactionIndex) {
        stateInfo.lastProcessedLogIndex = -1;
      }
      else {
        if (event.logIndex <= stateInfo.lastProcessedLogIndex) {
          return;
        }
      }
    }

    await this.processProposedVersion(event.args);

    stateInfo.lastProcessedTransactionIndex = event.transactionIndex;
    stateInfo.lastProcessedLogIndex = event.logIndex;
  }

  async processProposedVersion(
    proposedVersion: ProposedVersionEventArgs
  ) {
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
    } = await this.versionVerifierService.verifyVersion(
      packageId,
      patchNodeId,
      majorVersion,
      minorVersion,
      patchVersion,
      packageLocation,
      isPatch);

    await this.votingService.voteOnVersion(patchNodeId, prevMinorNodeId, nextMinorNodeId, approved);
  }
}