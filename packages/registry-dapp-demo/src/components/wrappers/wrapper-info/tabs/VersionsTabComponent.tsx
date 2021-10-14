import { useState } from "react";
import { VersionInfo } from "../../../../types/VersionInfo";
import { PolywrapperInfo } from "../../../../types/PolywrapperInfo";
import { usePolywrapRegistry } from "../../../../hooks/usePolywrapRegistry";
import { getLatestVersionInfo } from "../../../../helpers/getLatestVersionInfo";
import VersionInfoComponent from "../../../versions/VersionInfoComponent";
import { handleContractError, handleError } from "@polywrap/registry-js";
import { useToasts } from "react-toast-notifications";

const VersionsTabComponent: React.FC<{
  polywrapperInfo: PolywrapperInfo;
}> = ({ polywrapperInfo }) => {
  const { packageOwner } = usePolywrapRegistry();

  const [versionNumberText, setVersionNumberText] = useState("");
  const [latestVersion, setLatestVersion] = useState<VersionInfo | undefined>();
  const { addToast } = useToasts();

  const onFindLatest = async () => {
    const [error] = await handleError(async () => {
      const [error, latestVersionInfo] = await handleContractError(() =>
        getLatestVersionInfo(polywrapperInfo.domain, packageOwner)
      )();
      if (error) {
        addToast(error.revertMessage, {
          appearance: "error",
          autoDismiss: true,
        });
        return;
      }
      if (!latestVersionInfo) {
        addToast("Error: unable to fetch latestVersionInfo", {
          appearance: "error",
          autoDismiss: true,
        });
        return;
      }
      setLatestVersion(latestVersionInfo);
    })();
    if (error) {
      addToast(error.message, {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }
  };

  return (
    <div className="VersionsTab">
      <h3>Versions</h3>
      <input
        type="text"
        value={versionNumberText}
        placeholder="Version number (eg. 1.0)..."
        onChange={async (e) => {
          setVersionNumberText(e.target.value);
        }}
      />
      <button className="find-btn" onClick={onFindLatest}>
        Find latest
      </button>
      <div className="version-info">
        {latestVersion ? (
          <VersionInfoComponent
            versionInfo={latestVersion}
          ></VersionInfoComponent>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default VersionsTabComponent;
