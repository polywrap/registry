import { VersionVerificationStatus } from "./VersionVerificationStatus";
import { ProposedVersion } from "@polywrap/registry-js";

export type VersionVerificationStatusInfo = {
  proposedVersion: ProposedVersion;
  status: VersionVerificationStatus;
};
