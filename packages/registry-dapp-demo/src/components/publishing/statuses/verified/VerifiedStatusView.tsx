import { EnsDomain } from "@polywrap/registry-js";
import { VerificationProof } from "@polywrap/registry-js";
import { useState } from "react";
import { usePolywrapRegistry } from "../../../../hooks/usePolywrapRegistry";
import NetworkSpecificView from "../../../network-specific-view/NetworkSpecificView";
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

  const publishVersion = async () => {
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
  };

  return (
    <div className="VerifiedStatusView">
      <div className="status">Status: Verified</div>
      <div>
        <NetworkSpecificView network="xdai">
          {verificationProof ? (
            <>
              <button className="publish-btn" onClick={publishVersion}>
                Publish to xDAI
              </button>

              <div>or switch to Rinkeby and publish</div>
            </>
          ) : (
            <></>
          )}
        </NetworkSpecificView>
      </div>
    </div>
  );
};

export default VerifiedStatusView;
