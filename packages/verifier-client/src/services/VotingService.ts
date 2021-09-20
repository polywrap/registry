import { BytesLike } from "ethers";
import { PolywrapVotingSystem } from "@polywrap/registry-js";
import { VerifierClientConfig } from "../config/VerifierClientConfig";
import { Logger } from "winston";

export class VotingService {
  private logger: Logger;
  private polywrapVotingSystem: PolywrapVotingSystem;
  private verifierClientConfig: VerifierClientConfig;

  constructor(deps: {
    polywrapVotingSystem: PolywrapVotingSystem;
    verifierClientConfig: VerifierClientConfig;
  }) {
  constructor(deps: {
    logger: Logger;
    polywrapVotingSystem: PolywrapVotingSystem;
  }) {
    this.logger = deps.logger;
    this.polywrapVotingSystem = deps.polywrapVotingSystem;
    this.verifierClientConfig = deps.verifierClientConfig;
  }

  async voteOnVersion(
    patchNodeId: BytesLike,
    prevMinorNodeId: BytesLike,
    nextMinorNodeId: BytesLike,
    approved: boolean
  ): Promise<void> {
    const voteTx = await this.polywrapVotingSystem.vote([
      {
        prevMinorNodeId,
        nextMinorNodeId,
        patchNodeId,
        approved: approved,
      },
    ]);

    await voteTx.wait(this.verifierClientConfig.numOfConfirmationsToWait);

    this.logger.info(
      `Voted on proposed version ${patchNodeId}, approved: ${approved}`
    );
  }
}
