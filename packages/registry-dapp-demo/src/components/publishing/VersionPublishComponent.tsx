import "./VersionPublishComponent.scss";
import { useState } from "react";
import { VersionVerificationStatus } from "../../types/VersionVerificationStatus";
import { VersionInfo } from "../../types/VersionInfo";

const VersionPublishComponent: React.FC = () => {
  const [domainName, setDomainName] = useState("");
  const [versionNumber, setVersionNumber] = useState("");
  const [latestVersion, setLatestVersion] = useState<VersionInfo | undefined>();

  let status = <></>;
  let verificationStatus: VersionVerificationStatus | undefined;

  switch (verificationStatus) {
    case VersionVerificationStatus.Unproposed:
      status = <div>Unproposed</div>;
      break;
    case VersionVerificationStatus.Queued:
      status = <div>Queued</div>;
      break;
    case VersionVerificationStatus.Verified:
      status = <div>Verified</div>;
      break;
    case VersionVerificationStatus.Rejected:
      status = <div>Rejected</div>;
      break;
    case VersionVerificationStatus.Published:
      status = <div>Published</div>;
      break;
    default:
      status = <div>Loading...</div>;
      break;
  }

  return (
    <>
      <h3>Version Publishing</h3>
      <select>
        <option selected value="ens">
          ENS
        </option>
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
        placeholder="Version number (eg. 1.0)..."
        onChange={async (e) => {
          setVersionNumber(e.target.value);
        }}
      />
      <input
        type="text"
        value={versionNumber}
        placeholder="IPFS hash..."
        onChange={async (e) => {
          setVersionNumber(e.target.value);
        }}
      />
      <button>Get status</button>
      <div>Latest version</div>
      {latestVersion ? (
        <>
          <div>Id: {latestVersion.patchNodeId}</div>
          <div>Number: {latestVersion.number}</div>
          <div>
            IPFS:{" "}
            <a href={`https://dweb.link/ipfs/{latestVersion.number}`}>
              ipfs://{latestVersion.packageLocation}
            </a>
          </div>
        </>
      ) : (
        <></>
      )}
      <div>{status}</div>
    </>
  );
};

export default VersionPublishComponent;
