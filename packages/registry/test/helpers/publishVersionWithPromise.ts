import { BytesLike, ContractTransaction } from "ethers";
import { formatBytes32String } from "ethers/lib/utils";
import { PolywrapRegistryV1 } from "../../typechain-types";
import { calculatePatchNodeId } from "./calculatePatchNodeId";
import { calculateVersionBytes } from "./calculateVersionBytes";
import { calculateVersionNodeId } from "./calculateVersionNodeId";
import { parseVersionString } from "./parseVersionString";

export const publishVersionWithPromise = async (
  registryV1: PolywrapRegistryV1,
  packageId: BytesLike,
  version: string,
  packageLocation: string
): Promise<{
  versionId: BytesLike;
  patchNodeId: BytesLike;
  packageLocation: string;
  txPromise: Promise<ContractTransaction>;
}> => {
  const buildMetadata = parseVersionString(version).buildMetadata;
  const versionBytes = calculateVersionBytes(version);

  const txPromise = registryV1.publishVersion(
    packageId,
    versionBytes,
    formatBytes32String(buildMetadata),
    packageLocation
  );

  return {
    versionId: calculateVersionNodeId(packageId, version),
    patchNodeId: calculatePatchNodeId(packageId, version),
    packageLocation,
    txPromise,
  };
};
