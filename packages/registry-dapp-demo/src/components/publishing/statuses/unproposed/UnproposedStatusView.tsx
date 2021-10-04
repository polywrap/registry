import { EnsDomain } from "@polywrap/registry-js";
import { useState } from "react";
import { usePolywrapRegistry } from "../../../../hooks/usePolywrapRegistry";
import "./UnproposedStatusView.scss";

const UnproposedStatusView: React.FC<{
  domainName: string;
  reloadVersionStatusInfo: () => Promise<void>;
}> = ({ domainName, reloadVersionStatusInfo }) => {
  const { packageOwner } = usePolywrapRegistry();

  const [ipfsHash, setIpfsHash] = useState(
    "bafybeidftvdnn4wzpuipdfwqwkegmcm4ktnqrrch3p3web67mtmhu2d6ei"
  );

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
        <button
          onClick={async () => {
            const domain = new EnsDomain(domainName);

            await packageOwner.proposeVersion(domain, 1, 0, 0, ipfsHash);

            await reloadVersionStatusInfo();
          }}
        >
          Propose version
        </button>
      </div>
    </div>
  );
};

export default UnproposedStatusView;
