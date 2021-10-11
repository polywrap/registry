import { BigNumber } from "ethers";

export type ProposedVersionVotingInfo = {
  verifierCount: BigNumber;
  approvingVerifierCount: BigNumber;
  rejectingVerifierCount: BigNumber;
};
