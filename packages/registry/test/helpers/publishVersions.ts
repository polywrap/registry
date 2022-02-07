import { BytesLike } from "ethers";
import { PolywrapRegistryV1 } from "../../typechain-types";
import { publishVersionWithPromise } from "./publishVersionWithPromise";

export const publishVersions = async (
  registryV1: PolywrapRegistryV1,
  packageId: BytesLike,
  versions: string[],
  packageLocation: string
): Promise<void> => {
  for (const version of versions) {
    const result = await publishVersionWithPromise(
      registryV1,
      packageId,
      version,
      packageLocation
    );

    await result.txPromise;
  }
};
