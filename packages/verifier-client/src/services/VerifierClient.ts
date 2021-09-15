import { VersionProcessingService } from "./VersionProcessingService";
import { VerifierStateManager } from "./VerifierStateManager";
import { ProposedVersionEventArgs } from "../events/ProposedVersionEventArgs";
import { VotingMachine } from "../typechain";

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
  private votingMachine: VotingMachine;
  private verifierStateManager: VerifierStateManager;

  constructor(deps: {
    votingMachine: VotingMachine;
    versionProcessingService: VersionProcessingService;
    verifierStateManager: VerifierStateManager;
  }) {
    this.votingMachine = deps.votingMachine;
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
    const proposedVersionEvents = await this.votingMachine.queryFilter(
      this.votingMachine.filters.VersionVotingStarted(),
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
