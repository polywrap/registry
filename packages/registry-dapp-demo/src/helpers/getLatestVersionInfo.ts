import { EnsDomain, PackageOwner } from "@polywrap/registry-js";
import { VersionInfo } from "../types/VersionInfo";

export const getLatestVersionInfo = async (
  domain: EnsDomain,
  packageOwner: PackageOwner
): Promise<VersionInfo> => {
  const versionInfo = await packageOwner.getLatestVersionInfo(domain.packageId);

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