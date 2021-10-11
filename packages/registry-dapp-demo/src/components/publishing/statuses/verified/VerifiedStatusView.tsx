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
  verificationProof: VerificationProof | undefined;
}> = ({
  domainName,
  majorNumber,
  minorNumber,
  patchNumber,
  packageLocation,
  reloadVersionStatusInfo,
  verificationProof,
}) => {
  const { packageOwner } = usePolywrapRegistry();

  return (
    <div className="VerifiedStatusView">
      <div className="status">Status: Verified</div>
      <div>
        <ChainSpecificView chainName="xdai">
          {verificationProof ? (
            <>
              <button
                className="publish-btn"
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

              <div>or switch to Rinkeby and publish</div>
            </>
          ) : (
            <></>
          )}
        </ChainSpecificView>
      </div>
    </div>
  );
};

export default VerifiedStatusView;
