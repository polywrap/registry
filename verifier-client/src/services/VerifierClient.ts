import { VotingMachine } from "../typechain";
import { VersionProcessingService } from "./VersionProcessingService";
import { VerifierStateManager } from "./VerifierStateManager";
import { VersionVerifierService } from "./VersionVerifierService";
import { ProposedVersionEventArgs } from "../events/ProposedVersionEventArgs";

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class VerifierClient {
  private versionProcessingService: VersionProcessingService;
  private votingMachine: VotingMachine;
  private verifierStateManager: VerifierStateManager;

  constructor(deps: {
    votingMachine: VotingMachine,
    versionProcessingService: VersionProcessingService,
    verifierStateManager: VerifierStateManager
  }) {
    this.votingMachine = deps.votingMachine;
    this.versionProcessingService = deps.versionProcessingService;
    this.verifierStateManager = deps.verifierStateManager;
  }

  async run(): Promise<void> {
    let processedEventCnt = 0;

    while (true) {
      processedEventCnt = await this.queryAndVerifyVersions();

      console.log(`Processed ${processedEventCnt} events.`);

      await delay(+process.env.PAUSE_TIME!);
    }
  }

  async queryAndVerifyVersions(
  ): Promise<number> {
    const proposedVersionEvents = await this.votingMachine.queryFilter(
      this.votingMachine.filters.VersionVotingStarted(),
      this.verifierStateManager.state.currentlyProcessingBlock
    );

    for (let event of proposedVersionEvents) {
      //@ts-ignore
      const typedEvent: {
        blockNumber: number,
        transactionIndex: number,
        logIndex: number,
        args: ProposedVersionEventArgs
      } = event;

      await this.versionProcessingService.processProposedVersionEvent(this.verifierStateManager.state, typedEvent);

      this.verifierStateManager.save();
    }

    return proposedVersionEvents.length;
  }
}