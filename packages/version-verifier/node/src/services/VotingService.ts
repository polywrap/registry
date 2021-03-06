import { BytesLike } from "ethers";
import {
  PolywrapVotingSystem,
  ProposedVersion,
  traceFunc,
} from "@polywrap/registry-js";
import { VerifierClientConfig } from "../config/VerifierClientConfig";
import { Logger } from "winston";
import { toPrettyHex } from "@polywrap/version-verifier-js";

export class VotingService {
  private logger: Logger;
  private polywrapVotingSystem: PolywrapVotingSystem;
  private verifierClientConfig: VerifierClientConfig;

  constructor(deps: {
    logger: Logger;
    polywrapVotingSystem: PolywrapVotingSystem;
    verifierClientConfig: VerifierClientConfig;
  }) {
    this.logger = deps.logger;
    this.polywrapVotingSystem = deps.polywrapVotingSystem;
    this.verifierClientConfig = deps.verifierClientConfig;
  }

  @traceFunc("voting-service:vote_on_version")
  async voteOnVersion(
    patchNodeId: BytesLike,
    prevMinorNodeId: BytesLike,
    nextMinorNodeId: BytesLike,
    approved: boolean
  ): Promise<void> {
    await this.polywrapVotingSystem.vote(
      [
        {
          prevMinorNodeId,
          nextMinorNodeId,
          patchNodeId,
          approved: approved,
        },
      ],
      this.verifierClientConfig.numOfConfirmationsToWait
    );

    this.logger.info(
      `Voted on proposed version ${toPrettyHex(
        patchNodeId.toString()
      )}, approved: ${approved}`
    );
  }

  @traceFunc("voting-service:is_decided")
  async getProposedVersion(patchNodeId: BytesLike): Promise<ProposedVersion> {
    return this.polywrapVotingSystem.getProposedVersion(patchNodeId);
  }
}
