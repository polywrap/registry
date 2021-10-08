import { EnsDomain } from "@polywrap/registry-js";

export type DetailedVersionInfo = {
  patchNodeId: string;
  packageLocation: string;
  domain: EnsDomain;
  majorVersion: number;
  minorVersion: number;
  patchVersion: number;
};
