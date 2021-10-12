import { EnsDomain, PackageOwner } from "@polywrap/registry-js";

export const updateOwnership = async (
  domain: EnsDomain,
  packageOwner: PackageOwner
): Promise<void> => {
  await packageOwner.updateOwnership(domain);
};
