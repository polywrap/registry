import { DetailedVersionInfo } from "./DetailedVersionInfo";
import { VersionVerificationStatus } from "./VersionVerificationStatus";

export type VersionVerificationStatusInfo = {
  proposedVersion: DetailedVersionInfo;
  status: VersionVerificationStatus;
};
