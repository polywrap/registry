import { ProposedVersionEventArgs } from "../types/ProposedVersionEventArgs";
import { VerifierStateInfo } from "../types/VerifierStateInfo";
import { VersionVerifierService } from "@polywrap/version-verifier-js";
import { VotingService } from "./VotingService";
import { Logger } from "winston";
import {
  handleContractError,
  PolywrapVotingSystem,
  ProposedVersion,
  traceFunc,
} from "@polywrap/registry-js";
import { toPrettyHex } from "@polywrap/version-verifier-js";
import { IgnorableRevert, IgnorableReverts } from "../types/IgnorableRevert";
import { VerifierStateManager } from "../services/VerifierStateManager";
import { TypedEvent } from "../types/TypedEvent";

export class VersionProcessingService {
  private logger: Logger;
  private votingService: VotingService;
  private versionVerifierService: VersionVerifierService;
  private polywrapVotingSystem: PolywrapVotingSystem;
  private verifierStateManager: VerifierStateManager;

  constructor(deps: {
    logger: Logger;
    votingService: VotingService;
    versionVerifierService: VersionVerifierService;
    polywrapVotingSystem: PolywrapVotingSystem;
    verifierStateManager: VerifierStateManager;
  }) {
    this.logger = deps.logger;
    this.votingService = deps.votingService;
    this.versionVerifierService = deps.versionVerifierService;
    this.verifierStateManager = deps.verifierStateManager;
    this.polywrapVotingSystem = deps.polywrapVotingSystem;
  }

  @traceFunc("verifier-client:query_and_verify_versions")
  async queryAndVerifyVersions(): Promise<number> {
    const proposedVersionEvents = await this.polywrapVotingSystem.queryVersionVotingStarted(
      this.verifierStateManager.state.currentlyProcessingBlock
    );

    if (proposedVersionEvents.length) {
      this.logger.info(
        `Found ${proposedVersionEvents.length} VotingStarted events.`
      );
    }

    for (const event of proposedVersionEvents) {
      const typedEvent: TypedEvent = (event as unknown) as TypedEvent;

      await this.processProposedVersionEvent(
        this.verifierStateManager.state,
        typedEvent
      );

      this.verifierStateManager.save();
    }

    return proposedVersionEvents.length;
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

    const [contractError] = await handleContractError(() =>
      this.processProposedVersion(event.args)
    )();

    if (contractError) {
      const revertMessage = contractError.revertMessage as IgnorableRevert;
      if (revertMessage && IgnorableReverts.includes(revertMessage)) {
        this.logger.warn(`Error: ${contractError.revertMessage}`);
      } else {
        this.logger.error(`Critical Error: ${contractError.error.message}`);
        process.exit(1);
      }
    }

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

    const latestProposedVersion = await this.votingService.getProposedVersion(
      patchNodeId
    );

    const {
      packageId,
      majorVersion,
      minorVersion,
      patchVersion,
      packageLocation,
      decided,
    } = latestProposedVersion as ProposedVersion;

    if (decided) {
      this.logger.info(`Version is already decided.`);
      return;
    }

    this.logger.info(
      `Version proposed: ${toPrettyHex(
        patchNodeId.toString()
      )}, ${majorVersion}, ${minorVersion}, ${patchVersion}`
    );

    const verifyVersion = await this.versionVerifierService.verifyVersion(
      packageId,
      patchNodeId,
      majorVersion.toNumber(),
      minorVersion.toNumber(),
      patchVersion.toNumber(),
      packageLocation,
      isPatch
    );

    const { prevMinorNodeId, nextMinorNodeId, approved } = verifyVersion;

    await this.votingService.voteOnVersion(
      patchNodeId,
      prevMinorNodeId,
      nextMinorNodeId,
      approved
    );
  }
}
