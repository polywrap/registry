import { EnsDomain } from "@polywrap/registry-core-js";
import { formatBytes32String, solidityKeccak256 } from "ethers/lib/utils";

export type PolywrapPackage = {
  organizationId: string;
  packageId: string;
  packageName: string;
};
