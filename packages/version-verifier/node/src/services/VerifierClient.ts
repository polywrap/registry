import {
  BaseContractError,
  ContractError,
  handleError,
  PolywrapVotingSystem,
  traceFunc,
} from "@polywrap/registry-js";
import { Logger } from "winston";
import { providers } from "ethers";
import { sleep, waitForEthereumNode } from "../helpers";
import { VerifierClientConfig } from "../config/VerifierClientConfig";
import { VerifierStateManager } from "./VerifierStateManager";
import { VersionProcessingService } from "./VersionProcessingService";

export class VerifierClient {
  private logger: Logger;
  private ethersProvider: providers.Provider;
  private versionProcessingService: VersionProcessingService;
  private verifierClientConfig: VerifierClientConfig;

  constructor(deps: {
    logger: Logger;
    polywrapVotingSystem: PolywrapVotingSystem;
    versionProcessingService: VersionProcessingService;
    verifierStateManager: VerifierStateManager;
    verifierClientConfig: VerifierClientConfig;
    ethersProvider: providers.Provider;
  }) {
    this.logger = deps.logger;
    this.versionProcessingService = deps.versionProcessingService;
    this.verifierClientConfig = deps.verifierClientConfig;
    this.ethersProvider = deps.ethersProvider;
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
        const contractError = (error as unknown) as BaseContractError;
        if (contractError.code !== "NETWORK_ERROR") {
          this.logger.error(`Critical Error: ${error.message}`);
          process.exit(1);
        }

        // If it's ethereum network error, wait until it can reconnect
        await waitForEthereumNode(this.ethersProvider, this.logger);
      } else {
        this.logger.info(
          `${processedEvents} proposed version events processed.`
        );

        await sleep(this.verifierClientConfig.pauseTimeInMiliseconds);
      }
    }
  }
}
