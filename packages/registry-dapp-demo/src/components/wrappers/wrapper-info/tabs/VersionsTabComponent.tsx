import { useState } from "react";
import { VersionInfo } from "../../../../types/VersionInfo";
import { PolywrapperInfo } from "../../../../types/PolywrapperInfo";
import { usePolywrapRegistry } from "../../../../hooks/usePolywrapRegistry";

const VersionsTabComponent: React.FC<{
  polywrapperInfo: PolywrapperInfo;
}> = ({ polywrapperInfo }) => {
  const { packageOwner } = usePolywrapRegistry();

  const [versionNumber, setVersionNumber] = useState("");
  const [latestVersion, setLatestVersion] = useState<VersionInfo | undefined>();

  return (
    <div className="VersionsTab">
      <h3>Versions</h3>
      <input
        type="text"
        value={versionNumber}
        placeholder="Version number (eg. 1.0)..."
        onChange={async (e) => {
          setVersionNumber(e.target.value);
        }}
      />
      <button
        className="find-btn"
        onClick={async () => {
          const versionInfo = await packageOwner.getLatestVersionInfo(
            polywrapperInfo.domain.packageId
          );

          setLatestVersion(versionInfo);
        }}
      >
        Find latest
      </button>
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
      <button>Publishing</button>
    </div>
  );
};

export default VersionsTabComponent;
