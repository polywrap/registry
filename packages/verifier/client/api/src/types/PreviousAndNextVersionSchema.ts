import { BytesLike } from "ethers";

export type PreviousAndNextVersionSchema = {
  prevMinorNodeId: BytesLike;
  prevSchema: string | undefined;
  nextMinorNodeId: BytesLike;
  nextSchema: string | undefined;
};
