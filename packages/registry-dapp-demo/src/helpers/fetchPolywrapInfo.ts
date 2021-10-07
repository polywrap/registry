import { EnsDomain, PackageOwner } from "@polywrap/registry-js";
import { PolywrapperInfo } from "../types/PolywrapperInfo";

export const fetchPolywrapperInfo = async (
  domain: EnsDomain,
  packageOwner: PackageOwner
): Promise<PolywrapperInfo> => {
  const [polywrapOwner, domainPolywrapOwner] = await Promise.all([
    packageOwner.getPolywrapOwner(domain),
    packageOwner.getDomainPolywrapOwner(domain),
  ]);

  return {
    domain,
    polywrapOwner,
    domainPolywrapOwner: domainPolywrapOwner as string,
  };
};
