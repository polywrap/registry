import { BytesLike } from "ethers";

export type ProposedVersionEventArgs = {
  packageId: BytesLike;
  patchNodeId: BytesLike;
  majorVersion: number;
  minorVersion: number;
  patchVersion: number;
  packageLocation: string;
  proposer: string;
  isPatch: boolean;
};
