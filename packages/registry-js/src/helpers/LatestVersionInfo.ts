import { BigNumber } from "ethers";

export type LatestVersionInfo = {
  majorVersion: BigNumber;
  minorVersion: BigNumber;
  patchVersion: BigNumber;
  location: string;
};
