import "./VersionPublishComponent.scss";
import { useEffect, useState } from "react";
import {
  EnsDomain,
  handleContractError,
  handleError,
  ProposedVersion,
  VerificationProof,
} from "@polywrap/registry-js";
import { usePolywrapRegistry } from "../../hooks/usePolywrapRegistry";
import VerificationStatusComponent from "./VerificationStatusComponent";
import { VersionVerificationStatusInfo } from "../../types/VersionVerificationStatusInfo";
import { VersionVerificationStatus } from "../../types/VersionVerificationStatus";
import { ethers } from "ethers";
import { DetailedVersionInfo } from "../../types/DetailedVersionInfo";
import { useWeb3Context } from "../../hooks/useWeb3Context";
import NetworkSpecificView from "../network-specific-view/NetworkSpecificView";
import { VersionNumber } from "../../types/VersionNumber";
import { useToasts } from "react-toast-notifications";

type VerificationProofWithLocation = VerificationProof & {
  packageLocation: string;
};

const VersionPublishComponent: React.FC<{
  defaultDomainName?: string;
  defaultVersionNumber?: string;
}> = ({ defaultDomainName, defaultVersionNumber }) => {
  const [web3] = useWeb3Context();
  const { packageOwner } = usePolywrapRegistry();
  const { addToast } = useToasts();

  const [domainName, setDomainName] = useState(defaultDomainName ?? "");
  const [versionNumberText, setVersionNumberText] = useState(
    defaultVersionNumber ?? ""
  );

  const [versionNumber, setVersionNumber] = useState<
    VersionNumber | undefined
  >();

  const [versionStatusInfo, setVersionStatusInfo] = useState<
    VersionVerificationStatusInfo | undefined
  >();

  const [verificationProof, setVerificationProof] = useState<
    VerificationProofWithLocation | undefined
  >();

  useEffect(() => {
    setVersionStatusInfo(undefined);
  }, [web3, web3?.networkName]);

  const getProposedVersionStatus = (
    proposedVersion: ProposedVersion
  ): VersionVerificationStatus => {
    let verificationStatus: VersionVerificationStatus =
      VersionVerificationStatus.Published;

    if (proposedVersion.patchNodeId === ethers.constants.HashZero) {
      verificationStatus = VersionVerificationStatus.Unproposed;
    } else if (!proposedVersion.decided && !proposedVersion.votingStarted) {
      verificationStatus = VersionVerificationStatus.Queued;
    } else if (!proposedVersion.decided && proposedVersion.votingStarted) {
      verificationStatus = VersionVerificationStatus.Verifying;
    } else if (proposedVersion.decided && proposedVersion.verified) {
      verificationStatus = VersionVerificationStatus.Verified;
    } else if (proposedVersion.decided && !proposedVersion.verified) {
      verificationStatus = VersionVerificationStatus.Rejected;
    } else {
      throw "Proposed version is in an invalid state";
    }

    return verificationStatus;
  };

  const _reloadVersionStatusInfo = handleError(async () => {
    if (!versionNumber) {
      return;
    }

    const domain = new EnsDomain(domainName);
    const patchNodeId = packageOwner.calculatePatchNodeId(
      domain,
      versionNumber.major,
      versionNumber.minor,
      versionNumber.patch
    );

    const [nodeInfoError, nodeInfo] = await handleContractError(() =>
      packageOwner.getVersionNodeInfo(
        domain,
        versionNumber.major,
        versionNumber.minor,
        versionNumber.patch
      )
    )();

    if (nodeInfoError) {
      addToast(nodeInfoError.revertMessage, {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }

    if (!nodeInfo) {
      addToast("Error: Unable to fetch nodeInfo!", {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }

    if (!nodeInfo.created && web3?.networkName === "rinkeby") {
      setVersionStatusInfo({
        proposedVersion: {
          patchNodeId: patchNodeId.toString(),
          domain,
          versionNumber: versionNumber,
          packageLocation: nodeInfo.location,
        },
        status: VersionVerificationStatus.Unproposed,
      });
      return;
    }

    let versionInfo: DetailedVersionInfo;
    let verificationStatus: VersionVerificationStatus;

    if (nodeInfo.created) {
      verificationStatus = VersionVerificationStatus.Published;
      versionInfo = {
        patchNodeId: patchNodeId.toString(),
        domain,
        versionNumber: versionNumber,
        packageLocation: nodeInfo.location,
      };
    } else {
      const [
        proposedVersionError,
        proposedVersion,
      ] = await handleContractError(() =>
        packageOwner.getProposedVersion(patchNodeId)
      )();

      if (proposedVersionError) {
        addToast(proposedVersionError.revertMessage, {
          appearance: "error",
          autoDismiss: true,
        });
        return;
      }
      if (!proposedVersion) {
        addToast("Error: Unable to fetch proposedVersion!", {
          appearance: "error",
          autoDismiss: true,
        });
        return;
      }

      versionInfo = {
        patchNodeId: patchNodeId.toString(),
        domain,
        versionNumber: versionNumber,
        packageLocation: proposedVersion.packageLocation,
      };

      verificationStatus = getProposedVersionStatus(proposedVersion);
    }

    setVersionStatusInfo({
      proposedVersion: versionInfo,
      status: verificationStatus,
    });
  });

  const reloadVersionStatusInfo = async () => {
    const [error] = await _reloadVersionStatusInfo();
    if (error) {
      addToast(error.message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const _publishVersion = handleError(async () => {
    if (!verificationProof) {
      throw "Verification proof is not defined";
    }

    if (!versionStatusInfo) {
      throw "Verification status is not defined";
    }

    const domain = new EnsDomain(domainName);

    const [publishVersionError, tx] = await handleContractError(() =>
      packageOwner.publishVersion(
        domain,
        verificationProof.packageLocation,
        versionStatusInfo.proposedVersion.versionNumber.major,
        versionStatusInfo.proposedVersion.versionNumber.minor,
        versionStatusInfo.proposedVersion.versionNumber.patch,
        verificationProof
      )
    )();
    if (publishVersionError) {
      addToast(publishVersionError.revertMessage, {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }
    if (tx) {
      addToast(
        `Version published successfully with transaction hash: ${tx.transactionHash}`,
        {
          appearance: "success",
          autoDismiss: true,
        }
      );

      return;
    }

    await reloadVersionStatusInfo();
  });

  const publishVersion = async () => {
    const [error] = await _publishVersion();
    if (error) {
      addToast(error.message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const _fetchAndCalculateVerificationProof = handleError(async () => {
    if (!versionStatusInfo) {
      throw "Verification status is not defined";
    }

    const domain = new EnsDomain(domainName);

    const [
      proposedVersionError,
      proposedVersion,
    ] = await handleContractError(() =>
      packageOwner.getProposedVersion(
        versionStatusInfo.proposedVersion.patchNodeId
      )
    )();

    if (proposedVersionError) {
      addToast(proposedVersionError.revertMessage, {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }
    if (!proposedVersion) {
      addToast("Error: Unable to fetch proposedVersion!", {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }

    const [proofError, proof] = await handleContractError(() =>
      packageOwner.fetchAndCalculateVerificationProof(
        domain,
        versionStatusInfo.proposedVersion.versionNumber.major,
        versionStatusInfo.proposedVersion.versionNumber.minor,
        versionStatusInfo.proposedVersion.versionNumber.patch
      )
    )();

    if (proofError) {
      addToast(proofError.revertMessage, {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }
    if (!proof) {
      addToast("Error: Unable to fetch proof!", {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }

    setVerificationProof({
      ...proof,
      packageLocation: proposedVersion.packageLocation,
    });
  });

  const fetchAndCalculateVerificationProof = async () => {
    const [error] = await _fetchAndCalculateVerificationProof();
    if (error) {
      addToast(error.message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  return (
    <div className="VersionPublishComponent">
      <select value="ens">
        <option value="ens">ENS</option>
      </select>
      <input
        type="text"
        value={domainName}
        placeholder="Domain..."
        onChange={async (e) => {
          setDomainName(e.target.value);
        }}
      />
      <input
        type="text"
        value={versionNumberText}
        placeholder="Version number (eg. 1.0.0)..."
        onChange={(e) => {
          setVersionNumberText(e.target.value);
          setVersionNumber(VersionNumber.fromString(e.target.value));
        }}
      />
      <button onClick={reloadVersionStatusInfo}>Get status</button>
      <div className="verification-status">
        <NetworkSpecificView network="rinkeby">
          {versionStatusInfo &&
          versionStatusInfo.status === VersionVerificationStatus.Published ? (
            <VerificationStatusComponent
              domainName={domainName}
              versionStatusInfo={versionStatusInfo}
              reloadVersionStatusInfo={reloadVersionStatusInfo}
            />
          ) : (
            <></>
          )}

          {versionStatusInfo &&
          versionStatusInfo.status === VersionVerificationStatus.Unproposed ? (
            <div>
              <div className="version-not-published">
                Version not published to this network.
              </div>

              {verificationProof ? (
                <button onClick={publishVersion}>Publish to Rinkeby</button>
              ) : (
                <div>
                  Switch to xDAI to propose and get your version verified. Then
                  get the verification proof and switch back.
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
        </NetworkSpecificView>

        <NetworkSpecificView network="xdai">
          {versionStatusInfo ? (
            <>
              <VerificationStatusComponent
                domainName={domainName}
                versionStatusInfo={versionStatusInfo}
                reloadVersionStatusInfo={reloadVersionStatusInfo}
                verificationProof={verificationProof}
              />

              {versionStatusInfo.status ===
                VersionVerificationStatus.Verified ||
              versionStatusInfo.status ===
                VersionVerificationStatus.Published ? (
                <div className="proof-section">
                  {verificationProof ? (
                    <div>Proof acquired</div>
                  ) : (
                    <button
                      className="calc-proof-btn"
                      onClick={fetchAndCalculateVerificationProof}
                    >
                      Fetch and calculate proof
                    </button>
                  )}
                </div>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
        </NetworkSpecificView>
      </div>
    </div>
  );
};

export default VersionPublishComponent;
