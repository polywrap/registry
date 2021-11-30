import { BigNumber } from "ethers";

export type VersionNodeMetadata = {
  exists: boolean;
  leaf: boolean;
  level: number;
  latestPrereleaseVersion: BigNumber;
  latestReleaseVersion: BigNumber;
};
