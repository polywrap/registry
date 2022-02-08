import { ethers } from "ethers";
import { solidityKeccak256 } from "ethers/lib/utils";
import { EnsDomainV1 } from "@polywrap/registry-core-js";
import { PolywrapPackage } from "./PolywrapPackage";

export const buildPolywrapPackage = (
  domain: EnsDomainV1,
  packageName: string
): PolywrapPackage => {
  const organizationId = solidityKeccak256(
    ["bytes32", "bytes32"],
    [domain.registryBytes32, domain.node]
  );
  const packageId = solidityKeccak256(
    ["bytes32", "bytes32"],
    [organizationId, ethers.utils.formatBytes32String(packageName)]
  );

  return {
    organizationId,
    packageId,
    packageName,
  };
};
