import { VersionProcessingService } from "./VersionProcessingService";
import { VerifierStateManager } from "./VerifierStateManager";
import { ProposedVersionEventArgs } from "../events/ProposedVersionEventArgs";
import {
  handleContractError,
  PolywrapVotingSystem,
  traceFunc,
} from "@polywrap/registry-js";
import { VerifierClientConfig } from "../config/VerifierClientConfig";
import { Logger } from "winston";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface TypedEvent {
  blockNumber: number;
  transactionIndex: number;
  logIndex: number;
  args: ProposedVersionEventArgs;
}

export class VerifierClient {
  private logger: Logger;
  private versionProcessingService: VersionProcessingService;
  private polywrapVotingSystem: PolywrapVotingSystem;
  private verifierStateManager: VerifierStateManager;
  private verifierClientConfig: VerifierClientConfig;

  constructor(deps: {
    logger: Logger;
    polywrapVotingSystem: PolywrapVotingSystem;
    versionProcessingService: VersionProcessingService;
    verifierStateManager: VerifierStateManager;
    verifierClientConfig: VerifierClientConfig;
  }) {
    this.logger = deps.logger;
    this.polywrapVotingSystem = deps.polywrapVotingSystem;
    this.versionProcessingService = deps.versionProcessingService;
    this.verifierStateManager = deps.verifierStateManager;
    this.verifierClientConfig = deps.verifierClientConfig;
  }

  @traceFunc("verifier-client:run")
  async run(): Promise<void> {
    this.logger.info(`Listening for VotingStarted events.`);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const [processedEvents, error] = await handleContractError(
        this.queryAndVerifyVersions
      )();

      this.logger.info(`${processedEvents} proposed version events processed.`);

      if (error) {
        this.logger.error(error.message);
        process.exit(1);
      }

      await delay(this.verifierClientConfig.pauseTimeInMiliseconds);
    }
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

      await this.versionProcessingService.processProposedVersionEvent(
        this.verifierStateManager.state,
        typedEvent
      );

      this.verifierStateManager.save();
    }

    return proposedVersionEvents.length;
  }
}
