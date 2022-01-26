import { BytesLike } from "ethers";
import {
  formatBytes32String,
  namehash,
  solidityKeccak256,
} from "ethers/lib/utils";

export const calculateOrganizationId = (
  domainRegistry: "ens",
  domain: string
): BytesLike => {
  const domainNode = namehash(domain);

  const organizationId = solidityKeccak256(
    ["bytes32", "bytes32"],
    [formatBytes32String(domainRegistry), domainNode]
  );

  return organizationId;
};
