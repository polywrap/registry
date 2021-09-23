import { EnsDomain, PackageOwner } from "@polywrap/registry-js";
import { BigNumber } from "ethers";
import { VersionInfo } from "../types/VersionInfo";

export const getLatestVersionInfo = async (
  domain: EnsDomain,
  packageOwner: PackageOwner
): Promise<VersionInfo> => {
  // const versionInfo = await packageOwner.getLatestVersionInfo(domain.packageId);

  const versionInfo = {
    majorVersion: BigNumber.from(1),
    minorVersion: BigNumber.from(0),
    patchVersion: BigNumber.from(0),
    location: "sadd",
  };

  return {
    patchNodeId: packageOwner
      .calculatePatchNodeId(
        domain,
        versionInfo.majorVersion.toNumber(),
        versionInfo.minorVersion.toNumber(),
        versionInfo.patchVersion.toNumber()
      )
      .toString(),
    number: `${versionInfo.majorVersion}.${versionInfo.minorVersion}.${versionInfo.patchVersion}`,
    packageLocation: versionInfo.location,
  };
};
