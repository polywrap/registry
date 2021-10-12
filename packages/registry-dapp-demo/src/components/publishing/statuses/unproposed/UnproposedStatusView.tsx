import { EnsDomain } from "@polywrap/registry-js";
import { useState } from "react";
import { usePolywrapRegistry } from "../../../../hooks/usePolywrapRegistry";
import { VersionNumber } from "../../../../types/VersionNumber";
import "./UnproposedStatusView.scss";

const UnproposedStatusView: React.FC<{
  domainName: string;
  versionNumber: VersionNumber;
  reloadVersionStatusInfo: () => Promise<void>;
}> = ({ domainName, versionNumber, reloadVersionStatusInfo }) => {
  const { packageOwner } = usePolywrapRegistry();

  const [ipfsHash, setIpfsHash] = useState(
    "bafybeidftvdnn4wzpuipdfwqwkegmcm4ktnqrrch3p3web67mtmhu2d6ei"
  );

  const proposeVersion = async () => {
    const domain = new EnsDomain(domainName);

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
