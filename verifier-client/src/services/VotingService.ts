import { BytesLike } from "ethers";
import { VotingMachine } from "../typechain";

export class VotingService {
  private votingMachine: VotingMachine;

  constructor(deps: {
    votingMachine: VotingMachine,
  }) {
    this.votingMachine = deps.votingMachine;
  }

  async voteOnVersion(
    patchNodeId: BytesLike,
    prevMinorNodeId: BytesLike,
    nextMinorNodeId: BytesLike,
    approved: boolean
  ) {
    const voteTx = await this.votingMachine.vote([
      {
        prevMinorNodeId,
        nextMinorNodeId,
        patchNodeId,
        approved: approved
      }
    ], {
      gasLimit: 200000
    });

    const receipt = await voteTx.wait(+process.env.NUM_OF_CONFIRMATIONS_TO_WAIT!);

    console.log(`Voted on proposed version ${patchNodeId}, approved: ${approved}`);
  }
}