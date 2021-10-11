import { BigNumber } from "ethers";

export type NodeInfo = {
  leaf: boolean;
  latestSubVersion: BigNumber;
  created: boolean;
  location: string;
};
