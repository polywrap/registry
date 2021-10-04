import "./VersionPublishComponent.scss";
import { useEffect, useState } from "react";
import { EnsDomain, ProposedVersion } from "@polywrap/registry-js";
import { usePolywrapRegistry } from "../../hooks/usePolywrapRegistry";
import VerificationStatusComponent from "./VerificationStatusComponent";
import { VersionVerificationStatusInfo } from "../../types/VersionVerificationStatusInfo";
import { VersionVerificationStatus } from "../../types/VersionVerificationStatus";
import { ethers } from "ethers";

const VersionPublishComponent: React.FC<{
  defaultDomainName?: string;
  defaultVersionNumber?: string;
}> = ({ defaultDomainName, defaultVersionNumber }) => {
  const { packageOwner } = usePolywrapRegistry();

  const [domainName, setDomainName] = useState(defaultDomainName ?? "");
  const [versionNumber, setVersionNumber] = useState(
    defaultVersionNumber ?? ""
  );
  const [versionStatusInfo, setVersionStatusInfo] = useState<
    VersionVerificationStatusInfo | undefined
  >();

  useEffect(() => {
    if (defaultDomainName && defaultVersionNumber) {
      (async () => {
        await reloadVersionStatusInfo();
      })();
    }
  }, []);

  const getProposedVersionStatus = async (
    proposedVersion: ProposedVersion
  ): Promise<VersionVerificationStatus> => {
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
      const domain = new EnsDomain(domainName);

      const nodeInfo = await packageOwner.getVersionNodeInfo(domain, 1, 0, 0);

      if (nodeInfo.created) {
        verificationStatus = VersionVerificationStatus.Published;
      }
    } else if (proposedVersion.decided && !proposedVersion.verified) {
      verificationStatus = VersionVerificationStatus.Rejected;
    } else {
      throw "";
    }

    return verificationStatus;
  };

  const reloadVersionStatusInfo = async () => {
    const domain = new EnsDomain(domainName);
    const patchNodeId = packageOwner.calculatePatchNodeId(domain, 1, 0, 0);

    const proposedVersion = await packageOwner.getProposedVersion(patchNodeId);
    setVersionStatusInfo({
      proposedVersion,
      status: await getProposedVersionStatus(proposedVersion),
    });
  };

  return (
    <div className="VersionPublishComponent">
      <select value="ens">
        <option value="ens">ENS</option>
      </select>
      <input
        type="text"
        value={domainName}
        placeholder="Domain..."
        onChange={async (e) => {
          setDomainName(e.target.value);
        }}
      />
      <input
        type="text"
        value={versionNumber}
        placeholder="Version number (eg. 1.0.0)..."
        onChange={async (e) => {
          setVersionNumber(e.target.value);
        }}
      />
      <button
        onClick={async () => {
          await reloadVersionStatusInfo();
        }}
      >
        Get status
      </button>
      <div className="verification-status">
        {versionStatusInfo ? (
          <VerificationStatusComponent
            domainName={domainName}
            versionStatusInfo={versionStatusInfo}
            reloadVersionStatusInfo={reloadVersionStatusInfo}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default VersionPublishComponent;
