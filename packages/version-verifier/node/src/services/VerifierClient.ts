import {
  handleError,
  PolywrapVotingSystem,
  traceFunc,
} from "@polywrap/registry-js";
import { Logger } from "winston";
import { VerifierClientConfig } from "../config/VerifierClientConfig";
import { VerifierStateManager } from "./VerifierStateManager";
import { VersionProcessingService } from "./VersionProcessingService";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class VerifierClient {
  private logger: Logger;
  private versionProcessingService: VersionProcessingService;
  private verifierClientConfig: VerifierClientConfig;

  constructor(deps: {
    logger: Logger;
    polywrapVotingSystem: PolywrapVotingSystem;
    versionProcessingService: VersionProcessingService;
    verifierStateManager: VerifierStateManager;
    verifierClientConfig: VerifierClientConfig;
  }) {
    this.logger = deps.logger;
    this.versionProcessingService = deps.versionProcessingService;
    this.verifierClientConfig = deps.verifierClientConfig;
  }

  @traceFunc("verifier-client:run")
  async run(): Promise<void> {
    this.logger.info(`Listening for VotingStarted events.`);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const [error, processedEvents] = await handleError(() =>
        this.versionProcessingService.queryAndVerifyVersions()
      )();

      if (error) {
        this.logger.error(`Critical Error: ${error.message}`);
        process.exit(1);
      } else {
        this.logger.info(
          `${processedEvents} proposed version events processed.`
        );

        await delay(this.verifierClientConfig.pauseTimeInMiliseconds);
      }
    }
  }
}
