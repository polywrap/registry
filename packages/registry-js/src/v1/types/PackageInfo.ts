import { BytesLike } from "ethers";

export type PackageInfo = {
  exists: boolean;
  owner: string;
  controller: string;
  organizationId: BytesLike;
};
