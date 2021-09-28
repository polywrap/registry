import { BytesLike } from "ethers";
import { useEffect, useState } from "react";
import { usePolywrapRegistry } from "../../../../hooks/usePolywrapRegistry";
import "./VerifyingStatusView.scss";

const VerifyingStatusView: React.FC<{
  patchNodeId: BytesLike;
  packageLocation: string;
  reloadProposedVersion: () => Promise<void>;
}> = ({ patchNodeId, packageLocation, reloadProposedVersion }) => {
  const { packageOwner } = usePolywrapRegistry();
  const [votingInfo, setVotingInfo] = useState({
    verifierCount: 0,
    approvingVerifiers: 0,
    rejectingVerifiers: 0,
  });

  const loadVotingInfo = async () => {
    const votingInfo = await packageOwner.getProposedVersionVotingInfo(
      patchNodeId
    );
    setVotingInfo({
      verifierCount: votingInfo.verifierCount.toNumber(),
      approvingVerifiers: votingInfo.approvingVerifiers.toNumber(),
      rejectingVerifiers: votingInfo.rejectingVerifiers.toNumber(),
    });
  };

  const votesNeeded = votingInfo.verifierCount / 2 + 1;

  useEffect(() => {
    async () => {
      await loadVotingInfo();
    };
  }, []);

  useEffect(() => {
    (async () => {
      await packageOwner._waitForVotingEnd(patchNodeId, packageLocation);
      await reloadProposedVersion();
    })();
  }, []);

  return (
    <div className="VerifyingStatusView">
      <div className="status">Status: Verifying</div>
      <div>
        <div>Verifiers: {votingInfo.verifierCount}</div>
        <div>
          Approvals: {votingInfo.approvingVerifiers}/{votesNeeded}
        </div>
        <div>
          Denials: {votingInfo.rejectingVerifiers}/{votesNeeded}
        </div>
      </div>
    </div>
  );
};

export default VerifyingStatusView;
