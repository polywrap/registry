import { EnsDomain } from "@polywrap/registry-js";
import { VerificationProof } from "@polywrap/registry-js";
import { useState } from "react";
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

  const [verificationProof, setVerificationProof] = useState<
    VerificationProof | undefined
  >(undefined);

  return (
    <div className="VerifiedStatusView">
      <div className="status">Status: Verified</div>
      <div>
        <ChainSpecificView chainName="xdai">
          <div className="proof-section">
            <button
              className="calc-proof-btn"
              onClick={async () => {
                const domain = new EnsDomain(domainName);

                const proof = await packageOwner.fetchAndCalculateVerificationProof(
                  domain,
                  majorNumber,
                  minorNumber,
                  patchNumber
                );

                setVerificationProof(proof);
              }}
            >
              Fetch and calculate proof
            </button>

            {verificationProof ? <div>Proof acquired</div> : <></>}
          </div>

          {verificationProof ? (
            <button
              onClick={async () => {
                if (!verificationProof) {
                  return;
                }

                const domain = new EnsDomain(domainName);

                await packageOwner.publishVersion(
                  domain,
                  packageLocation,
                  majorNumber,
                  minorNumber,
                  patchNumber,
                  verificationProof
                );

                await reloadVersionStatusInfo();
              }}
            >
              Publish to xDAI
            </button>
          ) : (
            <></>
          )}
        </ChainSpecificView>

        <ChainSpecificView chainName="rinkeby">
          {verificationProof ? (
            <button
              onClick={async () => {
                const domain = new EnsDomain(domainName);

                await packageOwner.publishVersion(
                  domain,
                  packageLocation,
                  majorNumber,
                  minorNumber,
                  patchNumber,
                  verificationProof
                );

                await reloadVersionStatusInfo();
              }}
            >
              Publish to Rinkeby
            </button>
          ) : (
            <div>Switch to xDAI and fetch verification proof</div>
          )}
        </ChainSpecificView>
      </div>
    </div>
  );
};

export default VerifiedStatusView;
