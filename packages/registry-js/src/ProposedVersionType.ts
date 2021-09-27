import { BigNumber } from "ethers";

export type ProposedVersion = {
  decided: boolean;
  verified: boolean;
  votingStarted: boolean;
  packageId: string;
  majorNodeId: string;
  minorNodeId: string;
  patchNodeId: string;
  packageLocation: string;
  majorVersion: BigNumber;
  minorVersion: BigNumber;
  patchVersion: BigNumber;
  proposer: string;
};
