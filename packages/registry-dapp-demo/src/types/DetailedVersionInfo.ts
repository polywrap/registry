import { EnsDomain } from "@polywrap/registry-js";
import { VersionNumber } from "./VersionNumber";

export type DetailedVersionInfo = {
  patchNodeId: string;
  packageLocation: string;
  domain: EnsDomain;
  versionNumber: VersionNumber;
};
