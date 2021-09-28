import "./VersionPublishComponent.scss";
import { useState } from "react";
import { VersionVerificationStatus } from "../../types/VersionVerificationStatus";
import { EnsDomain, ProposedVersion } from "@polywrap/registry-js";
import { usePolywrapRegistry } from "../../hooks/usePolywrapRegistry";
import { ethers } from "ethers";
import UnproposedStatusView from "./statuses/unproposed/UnproposedStatusView";
import QueuedStatusView from "./statuses/queued/QueuedStatusView";
import VerifyingStatusView from "./statuses/verifying/VerifyingStatusView";
import VerifiedStatusView from "./statuses/verified/VerifiedStatusView";
import RejectedStatusView from "./statuses/rejected/RejectedStatusView";

const VerificationStatusComponent: React.FC<{
  domainName: string;
  proposedVersion: ProposedVersion;
  reloadProposedVersion: () => Promise<void>;
}> = ({ domainName, proposedVersion, reloadProposedVersion }) => {
  let verificationStatus: VersionVerificationStatus =
    VersionVerificationStatus.Published;

  if (proposedVersion.patchNodeId === ethers.constants.HashZero) {
    verificationStatus = VersionVerificationStatus.Unproposed;
  } else if (!proposedVersion.decided && !proposedVersion.votingStarted) {
    verificationStatus = VersionVerificationStatus.Queued;
  } else if (!proposedVersion.decided && proposedVersion.votingStarted) {
    verificationStatus = VersionVerificationStatus.Verifying;
  } else if (proposedVersion.decided && proposedVersion.verified) {
    verificationStatus = VersionVerificationStatus.Verified;
  } else if (proposedVersion.decided && !proposedVersion.verified) {
    verificationStatus = VersionVerificationStatus.Rejected;
  } else {
    throw "";
  }

  let status = <></>;
  switch (verificationStatus) {
    case VersionVerificationStatus.Unproposed:
      status = (
        <UnproposedStatusView
          domainName={domainName}
          reloadProposedVersion={reloadProposedVersion}
        ></UnproposedStatusView>
      );
      break;
    case VersionVerificationStatus.Queued:
      status = <QueuedStatusView></QueuedStatusView>;
      break;
    case VersionVerificationStatus.Verifying:
      status = (
        <VerifyingStatusView
          patchNodeId={proposedVersion.patchNodeId}
          packageLocation={proposedVersion.packageLocation}
          reloadProposedVersion={reloadProposedVersion}
        ></VerifyingStatusView>
      );
      break;
    case VersionVerificationStatus.Verified:
      status = <VerifiedStatusView></VerifiedStatusView>;
      break;
    case VersionVerificationStatus.Rejected:
      status = <RejectedStatusView></RejectedStatusView>;
      break;
    // case VersionVerificationStatus.Published:
    //   status = <div>Published</div>;
    //   break;
    default:
      status = <div>Loading...</div>;
      break;
  }

  return <>{status}</>;
};

export default VerificationStatusComponent;
