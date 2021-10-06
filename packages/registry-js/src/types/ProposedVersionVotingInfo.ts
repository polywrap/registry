import { BigNumber } from "ethers";

export type ProposedVersionVotingInfo = {
  verifierCount: BigNumber;
  approvingVerifiers: BigNumber;
  rejectingVerifiers: BigNumber;
};
