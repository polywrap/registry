import { BytesLike } from "ethers";

export type VerifyVersionInfo = {
  prevMinorNodeId: BytesLike;
  nextMinorNodeId: BytesLike;
  approved: boolean;
  reason?: string; // reason for not approving version
};
