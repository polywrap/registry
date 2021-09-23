import { EnsDomain } from "@polywrap/registry-js";
import { ethers } from "ethers";
import { PolywrapperInfo } from "../types/PolywrapperInfo";

export const fetchPolywrapperInfo = async (
  domain: EnsDomain
): Promise<PolywrapperInfo> => {
  // const [polywrapOwner, domainPolywrapOwner] = await Promise.all([
  //   packageOwner.getPolywrapOwner(domain),
  //   packageOwner.getDomainPolywrapOwner(domain),
  // ]);

  const [polywrapOwner, domainPolywrapOwner] = await Promise.resolve([
    ethers.constants.HashZero,
    ethers.constants.HashZero,
  ]);

  return {
    domain,
    polywrapOwner,
    domainPolywrapOwner,
  };
};
