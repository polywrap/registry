import { BytesLike } from "ethers";
import { PolywrapVotingSystem } from "@polywrap/registry-js";

export class VotingService {
  private polywrapVotingSystem: PolywrapVotingSystem;

  constructor(deps: { polywrapVotingSystem: PolywrapVotingSystem }) {
    this.polywrapVotingSystem = deps.polywrapVotingSystem;
  }

  async voteOnVersion(
    patchNodeId: BytesLike,
    prevMinorNodeId: BytesLike,
    nextMinorNodeId: BytesLike,
    approved: boolean
  ) {
    const voteTx = await this.polywrapVotingSystem.vote([
      {
        prevMinorNodeId,
        nextMinorNodeId,
        patchNodeId,
        approved: approved,
      },
    ]);

    const receipt = await voteTx.wait(
      +process.env.NUM_OF_CONFIRMATIONS_TO_WAIT!
    );

    console.log(
      `Voted on proposed version ${patchNodeId}, approved: ${approved}`
    );
  }
}
