import {
  solidityKeccak256,
  formatBytes32String,
  toUtf8Bytes,
} from "ethers/lib/utils";
import { ethers } from "hardhat";
import { EnsDomain } from "./EnsDomain";
import { PolywrapPackage } from "./PolywrapPackage";

export const buildPolywrapPackage = (
  domain: EnsDomain,
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
