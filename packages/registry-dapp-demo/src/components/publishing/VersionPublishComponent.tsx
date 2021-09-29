import "./VersionPublishComponent.scss";
import { useState } from "react";
import { VersionVerificationStatus } from "../../types/VersionVerificationStatus";
import { VersionInfo } from "../../types/VersionInfo";
import { EnsDomain, ProposedVersion } from "@polywrap/registry-js";
import { usePolywrapRegistry } from "../../hooks/usePolywrapRegistry";
import VerificationStatusComponent from "./VerificationStatusComponent";

const VersionPublishComponent: React.FC<{
  defaultDomainName?: string;
  defaultVersionNumber?: string;
}> = ({ defaultDomainName, defaultVersionNumber }) => {
  const { packageOwner } = usePolywrapRegistry();

  const [domainName, setDomainName] = useState(defaultDomainName ?? "");
  const [versionNumber, setVersionNumber] = useState(
    defaultVersionNumber ?? ""
  );
  const [proposedVersion, setProposedVersion] = useState<
    ProposedVersion | undefined
  >();

  const reloadProposedVersion = async () => {
    const domain = new EnsDomain(domainName);
    const patchNodeId = packageOwner.calculatePatchNodeId(domain, 1, 0, 0);

    const proposedVersion = await packageOwner.getProposedVersion(patchNodeId);
    setProposedVersion(proposedVersion);
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
          await reloadProposedVersion();
        }}
      >
        Get status
      </button>
      <div className="verification-status">
        {proposedVersion ? (
          <VerificationStatusComponent
            domainName={domainName}
            proposedVersion={proposedVersion}
            reloadProposedVersion={reloadProposedVersion}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default VersionPublishComponent;
