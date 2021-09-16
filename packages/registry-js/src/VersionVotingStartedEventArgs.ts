import { BytesLike } from "ethers/lib/utils";

export type VersionVotingStartedEventArgs = {
  packageId: BytesLike;
  patchNodeId: BytesLike;
  majorVersion: number;
  minorVersion: number;
  patchVersion: number;
  packageLocation: string;
  proposer: string;
  isPatch: boolean;
};
