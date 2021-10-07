import { EnsDomain } from "@polywrap/registry-js";
import { usePolywrapRegistry } from "../../../../hooks/usePolywrapRegistry";
import ChainSpecificView from "../../../chain-specific-view/ChainSpecificView";
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
        <ChainSpecificView chainName="xdai">
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

          <div>
            <button>Fetch and calculate proof</button>
            <input type="text" disabled placeholder="Proof..." />
            <button>Copy to clipboard</button>
          </div>
        </ChainSpecificView>

        <ChainSpecificView chainName="rinkeby">
          <button>Publish to Ethereum</button>
        </ChainSpecificView>
      </div>
    </div>
  );
};

export default VerifiedStatusView;
