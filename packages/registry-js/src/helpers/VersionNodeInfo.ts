import { BigNumber } from "ethers";

export type VersionNodeInfo = {
  leaf: boolean;
  latestSubVersion: BigNumber;
  created: boolean;
  location: string;
};
