import { EnsDomain } from "@polywrap/registry-js";
import { usePolywrapRegistry } from "../../../../hooks/usePolywrapRegistry";
import "./VerifiedStatusView.scss";

const VerifiedStatusView: React.FC<{
  domainName: string;
  majorNumber: number;
  minorNumber: number;
  patchNumber: number;
  packageLocation: string;
  reloadVersionStatusInfo: () => Promise<void>;
}> = ({
  domainName,
  majorNumber,
  minorNumber,
  patchNumber,
  packageLocation,
  reloadVersionStatusInfo,
}) => {
  const { packageOwner } = usePolywrapRegistry();

  return (
    <div className="VerifiedStatusView">
      <div className="status">Status: Verified</div>
      <div>
        <div className="publish-buttons"></div>
        <button
          onClick={async () => {
            const domain = new EnsDomain(domainName);

            await packageOwner.publishVersion(
              domain,
              packageLocation,
              majorNumber,
              minorNumber,
              patchNumber
            );

            await reloadVersionStatusInfo();
          }}
        >
          Publish to xDAI
        </button>
        <button>Publish to Ethereum</button>
        <div>
          <button>Fetch and calculate proof</button>
          <input type="text" disabled placeholder="Proof..." />
          <button>Copy to clipboard</button>
        </div>
      </div>
    </div>
  );
};

export default VerifiedStatusView;
