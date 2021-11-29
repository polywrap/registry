import { BigNumber } from "ethers";
import { BytesLike } from "ethers/lib/utils";

export type VersionInfo = {
  exists: boolean;
  leaf: boolean;
  level: number;
  latestPrereleaseVersion: BigNumber;
  latestReleaseVersion: BigNumber;
  buildMetadata: BytesLike;
  location: string;
};
