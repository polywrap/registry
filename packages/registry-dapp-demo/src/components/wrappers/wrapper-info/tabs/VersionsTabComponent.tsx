import { useState } from "react";
import { VersionInfo } from "../../../../types/VersionInfo";
import { PolywrapperInfo } from "../../../../types/PolywrapperInfo";
import { usePolywrapRegistry } from "../../../../hooks/usePolywrapRegistry";
import { getLatestVersionInfo } from "../../../../helpers/getLatestVersionInfo";
import { toPrettyHex } from "../../../../helpers/toPrettyHex";

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
          setLatestVersion(
            await getLatestVersionInfo(polywrapperInfo.domain, packageOwner)
          );
        }}
      >
        Find latest
      </button>
      {latestVersion ? (
        <table className="polywrapper-table">
          <tbody>
            <tr>
              <td colSpan={2}>Latest version</td>
            </tr>
            <tr>
              <td>Id</td>
              <td>{toPrettyHex(latestVersion.patchNodeId)}</td>
            </tr>
            <tr>
              <td>Number</td>
              <td>{latestVersion.number}</td>
            </tr>
            <tr>
              <td> IPFS</td>
              <td>
                <a href={`https://dweb.link/ipfs/{latestVersion.number}`}>
                  ipfs://{latestVersion.packageLocation}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <></>
      )}
    </div>
  );
};

export default VersionsTabComponent;
