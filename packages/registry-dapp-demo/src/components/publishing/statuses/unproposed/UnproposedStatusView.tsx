import { EnsDomain } from "@polywrap/registry-js";
import { useState } from "react";
import { usePolywrapRegistry } from "../../../../hooks/usePolywrapRegistry";
import "./UnproposedStatusView.scss";

const UnproposedStatusView: React.FC<{
  domainName: string;
}> = ({ domainName }) => {
  const { packageOwner } = usePolywrapRegistry();

  const [ipfsHash, setIpfsHash] = useState("");

  return (
    <div className="UnproposedStatusView">
      <div>Status: Unproposed</div>

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
          }}
        >
          Propose version
        </button>
      </div>
    </div>
  );
};

export default UnproposedStatusView;
