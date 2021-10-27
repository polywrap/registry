import { EnsDomain } from "@polywrap/registry-js";
import { useState } from "react";
import { useToasts } from "react-toast-notifications";
import { usePolywrapRegistry } from "../../../../hooks/usePolywrapRegistry";
import { useVersionVerifier } from "../../../../hooks/useVersionVerifier";
import { VersionNumber } from "../../../../types/VersionNumber";
import "./UnproposedStatusView.scss";

const UnproposedStatusView: React.FC<{
  domainName: string;
  versionNumber: VersionNumber;
  reloadVersionStatusInfo: () => Promise<void>;
}> = ({ domainName, versionNumber, reloadVersionStatusInfo }) => {
  const { packageOwner } = usePolywrapRegistry();
  const { versionVerifierService } = useVersionVerifier();

  const [ipfsHash, setIpfsHash] = useState(
    "bafybeidftvdnn4wzpuipdfwqwkegmcm4ktnqrrch3p3web67mtmhu2d6ei"
  );

  const [isPatch, setIsPatch] = useState(false);
  const { addToast } = useToasts();

  const proposeVersion = async () => {
    const domain = new EnsDomain(domainName);

    const patchNodeId = packageOwner.calculatePatchNodeId(
      domain,
      versionNumber.major,
      versionNumber.minor,
      versionNumber.patch
    );

    const { approved } = await versionVerifierService.verifyVersion(
      domain.packageId,
      patchNodeId,
      versionNumber.major,
      versionNumber.minor,
      versionNumber.patch,
      ipfsHash,
      isPatch
    );

    if (!approved) {
      addToast(
        "Proposed version does not match the requirements for a valid version",
        {
          appearance: "error",
          autoDismiss: true,
        }
      );
      return;
    }

    await packageOwner.proposeVersion(
      domain,
      versionNumber.major,
      versionNumber.minor,
      versionNumber.patch,
      ipfsHash
    );

    await reloadVersionStatusInfo();
  };

  return (
    <div className="UnproposedStatusView">
      <div className="status">Status: Unproposed</div>

      <div>
        <input
          type="text"
          value={ipfsHash}
          placeholder="IPFS hash..."
          onChange={async (e) => {
            setIpfsHash(e.target.value);
          }}
        />
        <button onClick={proposeVersion}>Propose version</button>
      </div>
    </div>
  );
};

export default UnproposedStatusView;
