import { BytesLike, ethers } from "ethers";
import {
  formatBytes32String,
  namehash,
  solidityKeccak256,
} from "ethers/lib/utils";

export const calculatePackageId = (
  domainRegistry: "ens",
  domain: string,
  packageName: string
): BytesLike => {
  const domainNode = namehash(domain);

  const organizationId = solidityKeccak256(
    ["bytes32", "bytes32"],
    [formatBytes32String(domainRegistry), domainNode]
  );
  const packageId = solidityKeccak256(
    ["bytes32", "bytes32"],
    [organizationId, formatBytes32String(packageName)]
  );

  return packageId;
};
