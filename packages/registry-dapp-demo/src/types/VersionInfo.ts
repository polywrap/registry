import { EnsDomain } from "@polywrap/registry-js";
import { VersionNumber } from "./VersionNumber";

export type VersionInfo = {
  patchNodeId: string;
  number: VersionNumber;
  packageLocation: string;
  domain: EnsDomain;
};
