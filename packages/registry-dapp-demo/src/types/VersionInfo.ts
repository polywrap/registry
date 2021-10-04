import { EnsDomain } from "@polywrap/registry-js";

export type VersionInfo = {
  patchNodeId: string;
  number: string;
  packageLocation: string;
  domain: EnsDomain;
};
