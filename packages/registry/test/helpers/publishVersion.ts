import { BytesLike, ContractTransaction } from "ethers";
import { PolywrapRegistryV1 } from "../../typechain-types";
import { publishVersionWithPromise } from "./publishVersionWithPromise";

export const publishVersion = async (
  registryV1: PolywrapRegistryV1,
  packageId: BytesLike,
  version: string,
  packageLocation: string
): Promise<{
  versionId: BytesLike;
  patchNodeId: BytesLike;
  packageLocation: string;
  tx: ContractTransaction;
}> => {
  const result = await publishVersionWithPromise(
    registryV1,
    packageId,
    version,
    packageLocation
  );

  const tx = await result.txPromise;

  await tx.wait();

  return {
    ...result,
    tx,
  };
};
