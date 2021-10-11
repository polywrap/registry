import "./VersionPublishComponent.scss";
import { useEffect, useState } from "react";
import {
  EnsDomain,
  ProposedVersion,
  VerificationProof,
} from "@polywrap/registry-js";
import { usePolywrapRegistry } from "../../hooks/usePolywrapRegistry";
import VerificationStatusComponent from "./VerificationStatusComponent";
import { VersionVerificationStatusInfo } from "../../types/VersionVerificationStatusInfo";
import { VersionVerificationStatus } from "../../types/VersionVerificationStatus";
import { ethers } from "ethers";
import { DetailedVersionInfo } from "../../types/DetailedVersionInfo";
import { useWeb3 } from "../../hooks/useWeb3";
import ChainSpecificView from "../chain-specific-view/ChainSpecificView";

type VerificationProofWithLocation = VerificationProof & {
  packageLocation: string;
};

const VersionPublishComponent: React.FC<{
  defaultDomainName?: string;
  defaultVersionNumber?: string;
}> = ({ defaultDomainName, defaultVersionNumber }) => {
  const [web3] = useWeb3();
  const { packageOwner } = usePolywrapRegistry();

  const [domainName, setDomainName] = useState(defaultDomainName ?? "");
  const [versionNumber, setVersionNumber] = useState(
    defaultVersionNumber ?? ""
  );
  const [versionStatusInfo, setVersionStatusInfo] = useState<
    VersionVerificationStatusInfo | undefined
  >();

  const [verificationProof, setVerificationProof] = useState<
    VerificationProofWithLocation | undefined
  >();

  useEffect(() => {
    setVersionStatusInfo(undefined);
  }, [web3, web3?.networkName]);

  const getProposedVersionStatus = async (
    proposedVersion: ProposedVersion
  ): Promise<VersionVerificationStatus> => {
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
      throw "";
    }

    return verificationStatus;
  };

  const reloadVersionStatusInfo = async () => {
    const domain = new EnsDomain(domainName);
    const patchNodeId = packageOwner.calculatePatchNodeId(domain, 1, 0, 0);

    const nodeInfo = await packageOwner.getVersionNodeInfo(domain, 1, 0, 0);

    if (!nodeInfo.created && web3?.networkName === "rinkeby") {
      setVersionStatusInfo({
        proposedVersion: {
          patchNodeId: patchNodeId.toString(),
          domain,
          majorVersion: 1,
          minorVersion: 0,
          patchVersion: 0,
          packageLocation: nodeInfo.location,
        },
        status: VersionVerificationStatus.Unproposed,
      });
    }

    let versionInfo: DetailedVersionInfo;
    let verificationStatus: VersionVerificationStatus;

    if (nodeInfo.created) {
      verificationStatus = VersionVerificationStatus.Published;
      versionInfo = {
        patchNodeId: patchNodeId.toString(),
        domain,
        majorVersion: 1,
        minorVersion: 0,
        patchVersion: 0,
        packageLocation: nodeInfo.location,
      };
    } else {
      const proposedVersion = await packageOwner.getProposedVersion(
        patchNodeId
      );
      versionInfo = {
        patchNodeId: patchNodeId.toString(),
        domain,
        majorVersion: 1,
        minorVersion: 0,
        patchVersion: 0,
        packageLocation: proposedVersion.packageLocation,
      };

      verificationStatus = await getProposedVersionStatus(proposedVersion);
    }
    setVersionStatusInfo({
      proposedVersion: versionInfo,
      status: verificationStatus,
    });
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
        value={versionNumber}
        placeholder="Version number (eg. 1.0.0)..."
        onChange={async (e) => {
          setVersionNumber(e.target.value);
        }}
      />
      <button
        onClick={async () => {
          await reloadVersionStatusInfo();
        }}
      >
        Get status
      </button>
      <div className="verification-status">
        <ChainSpecificView chainName="rinkeby">
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
                <button
                  onClick={async () => {
                    const domain = new EnsDomain(domainName);

                    await packageOwner.publishVersion(
                      domain,
                      verificationProof.packageLocation,
                      versionStatusInfo.proposedVersion.majorVersion,
                      versionStatusInfo.proposedVersion.minorVersion,
                      versionStatusInfo.proposedVersion.patchVersion,
                      verificationProof
                    );

                    await reloadVersionStatusInfo();
                  }}
                >
                  Publish to Rinkeby
                </button>
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
        </ChainSpecificView>

        <ChainSpecificView chainName="xdai">
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
                      onClick={async () => {
                        const domain = new EnsDomain(domainName);

                        const proposedVersion = await packageOwner.getProposedVersion(
                          versionStatusInfo.proposedVersion.patchNodeId
                        );

                        const proof = await packageOwner.fetchAndCalculateVerificationProof(
                          domain,
                          versionStatusInfo.proposedVersion.majorVersion,
                          versionStatusInfo.proposedVersion.minorVersion,
                          versionStatusInfo.proposedVersion.patchVersion
                        );

                        setVerificationProof({
                          ...proof,
                          packageLocation: proposedVersion.packageLocation,
                        });
                      }}
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
        </ChainSpecificView>
      </div>
    </div>
  );
};

export default VersionPublishComponent;
