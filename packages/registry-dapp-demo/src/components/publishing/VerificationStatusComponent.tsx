import "./VersionPublishComponent.scss";
import { VersionVerificationStatus } from "../../types/VersionVerificationStatus";
import { EnsDomain } from "@polywrap/registry-js";
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
}> = ({ domainName, versionStatusInfo, reloadVersionStatusInfo }) => {
  let status = <></>;
  switch (versionStatusInfo.status) {
    case VersionVerificationStatus.Unproposed:
      status = (
        <UnproposedStatusView
          domainName={domainName}
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
          majorNumber={versionStatusInfo.proposedVersion.majorVersion}
          minorNumber={versionStatusInfo.proposedVersion.minorVersion}
          patchNumber={versionStatusInfo.proposedVersion.patchVersion}
          packageLocation={versionStatusInfo.proposedVersion.packageLocation}
          reloadVersionStatusInfo={reloadVersionStatusInfo}
        ></VerifiedStatusView>
      );
      break;
    case VersionVerificationStatus.Rejected:
      status = <RejectedStatusView></RejectedStatusView>;
      break;
    case VersionVerificationStatus.Published:
      status = (
        <PublishedStatusView
          versionInfo={{
            domain: new EnsDomain(domainName),
            packageLocation: versionStatusInfo.proposedVersion.packageLocation,
            number: "1.0.0",
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
