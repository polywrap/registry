import { BytesLike } from "ethers";
import {
  ContractCallResult,
  PolywrapVotingSystem,
  ProposedVersion,
  traceFunc,
  TransactionError,
} from "@polywrap/registry-js";
import { VerifierClientConfig } from "../config/VerifierClientConfig";
import { Logger } from "winston";
import { toPrettyHex } from "../helpers/toPrettyHex";

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
    const result = await this.polywrapVotingSystem.vote(
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

    if (result.error) {
      const txError = result.error as TransactionError;
      if (
        txError.revertMessage &&
        txError.revertMessage in this.polywrapVotingSystem.voteReverts
      ) {
        return;
      } else {
        process.exit(1);
      }
    } else {
      this.logger.info(
        `Voted on proposed version ${patchNodeId}, approved: ${approved}`
      );
    }
  }

  @traceFunc("voting-service:is_decided")
  async getProposedVersion(
    patchNodeId: BytesLike
  ): Promise<ContractCallResult<ProposedVersion>> {
    return this.polywrapVotingSystem.getProposedVersion(patchNodeId);
  }
}
