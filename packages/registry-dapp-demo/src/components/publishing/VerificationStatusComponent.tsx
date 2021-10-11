import "./VersionPublishComponent.scss";
import { VersionVerificationStatus } from "../../types/VersionVerificationStatus";
import { EnsDomain, VerificationProof } from "@polywrap/registry-js";
import UnproposedStatusView from "./statuses/unproposed/UnproposedStatusView";
import QueuedStatusView from "./statuses/queued/QueuedStatusView";
import VerifyingStatusView from "./statuses/verifying/VerifyingStatusView";
import VerifiedStatusView from "./statuses/verified/VerifiedStatusView";
import RejectedStatusView from "./statuses/rejected/RejectedStatusView";
import { VersionVerificationStatusInfo } from "../../types/VersionVerificationStatusInfo";
import PublishedStatusView from "./statuses/published/PublishedStatusView";

const VerificationStatusComponent: React.FC<{
  domainName: string;
  versionStatusInfo: VersionVerificationStatusInfo;
  reloadVersionStatusInfo: () => Promise<void>;
  verificationProof?: VerificationProof;
}> = ({
  domainName,
  versionStatusInfo,
  reloadVersionStatusInfo,
  verificationProof,
}) => {
  let status = <></>;
  switch (versionStatusInfo.status) {
    case VersionVerificationStatus.Unproposed:
      status = (
        <UnproposedStatusView
          domainName={domainName}
          versionNumber={versionStatusInfo.proposedVersion.versionNumber}
          reloadVersionStatusInfo={reloadVersionStatusInfo}
        ></UnproposedStatusView>
      );
      break;
    case VersionVerificationStatus.Queued:
      status = <QueuedStatusView></QueuedStatusView>;
      break;
    case VersionVerificationStatus.Verifying:
      status = (
        <VerifyingStatusView
          patchNodeId={versionStatusInfo.proposedVersion.patchNodeId}
          packageLocation={versionStatusInfo.proposedVersion.packageLocation}
          reloadVersionStatusInfo={reloadVersionStatusInfo}
        ></VerifyingStatusView>
      );
      break;
    case VersionVerificationStatus.Verified:
      status = (
        <VerifiedStatusView
          domainName={domainName}
          majorNumber={versionStatusInfo.proposedVersion.versionNumber.major}
          minorNumber={versionStatusInfo.proposedVersion.versionNumber.minor}
          patchNumber={versionStatusInfo.proposedVersion.versionNumber.patch}
          packageLocation={versionStatusInfo.proposedVersion.packageLocation}
          reloadVersionStatusInfo={reloadVersionStatusInfo}
          verificationProof={verificationProof}
        ></VerifiedStatusView>
      );
      break;
    case VersionVerificationStatus.Rejected:
      status = (
        <RejectedStatusView
          patchNodeId={versionStatusInfo.proposedVersion.patchNodeId}
        ></RejectedStatusView>
      );
      break;
    case VersionVerificationStatus.Published:
      status = (
        <PublishedStatusView
          versionInfo={{
            domain: new EnsDomain(domainName),
            packageLocation: versionStatusInfo.proposedVersion.packageLocation,
            number: versionStatusInfo.proposedVersion.versionNumber,
            patchNodeId: versionStatusInfo.proposedVersion.patchNodeId,
          }}
        ></PublishedStatusView>
      );
      break;
    default:
      status = <div>Loading...</div>;
      break;
  }

  return <>{status}</>;
};

export default VerificationStatusComponent;
