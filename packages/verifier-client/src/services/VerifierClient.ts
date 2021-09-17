import { VersionProcessingService } from "./VersionProcessingService";
import { VerifierStateManager } from "./VerifierStateManager";
import { ProposedVersionEventArgs } from "../events/ProposedVersionEventArgs";
import { PolywrapVotingSystem } from "@polywrap/registry-js";

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
  private versionProcessingService: VersionProcessingService;
  private polywrapVotingSystem: PolywrapVotingSystem;
  private verifierStateManager: VerifierStateManager;

  constructor(deps: {
    polywrapVotingSystem: PolywrapVotingSystem;
    versionProcessingService: VersionProcessingService;
    verifierStateManager: VerifierStateManager;
  }) {
    this.polywrapVotingSystem = deps.polywrapVotingSystem;
    this.versionProcessingService = deps.versionProcessingService;
    this.verifierStateManager = deps.verifierStateManager;
  }

  async run(): Promise<void> {
    let processedEventCnt = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      processedEventCnt = await this.queryAndVerifyVersions();

      console.log(`Processed ${processedEventCnt} events.`);

      await delay(+process.env.PAUSE_TIME!);
    }
  }

  async queryAndVerifyVersions(): Promise<number> {
    const proposedVersionEvents = await this.polywrapVotingSystem.queryVersionVotingStarted(
      this.verifierStateManager.state.currentlyProcessingBlock
    );

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
