import { toPrettyHex } from "../../helpers/toPrettyHex";
import { VersionInfo } from "../../types/VersionInfo";

const VersionInfoComponent: React.FC<{
  versionInfo: VersionInfo;
}> = ({ versionInfo }) => {
  return (
    <div className="VersionInfoComponent">
      {versionInfo && !versionInfo.packageLocation ? (
        <div className="version-not-published">
          <div>
            Version not published. Click{" "}
            <a
              href={`/#/version-publish?domain=${versionInfo.domain.name}&version=${versionInfo.number}`}
            >
              here
            </a>{" "}
            to start the publish process.
          </div>
        </div>
      ) : (
        <></>
      )}
      {versionInfo && versionInfo.packageLocation ? (
        <table className="polywrapper-table widget">
          <tbody>
            <tr>
              <td>Id:</td>
              <td>{toPrettyHex(versionInfo.patchNodeId)}</td>
            </tr>
            <tr>
              <td>Number:</td>
              <td>{versionInfo.number.toString()}</td>
            </tr>
            <tr>
              <td> IPFS:</td>
              <td>
                <a
                  href={`https://dweb.link/ipfs/${versionInfo.packageLocation}`}
                >
                  ipfs://{toPrettyHex(versionInfo.packageLocation)}
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

export default VersionInfoComponent;
