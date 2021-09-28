import { BytesLike } from "ethers";
import { useEffect, useState } from "react";
import { usePolywrapRegistry } from "../../../../hooks/usePolywrapRegistry";
import "./VerifyingStatusView.scss";

const VerifyingStatusView: React.FC<{
  patchNodeId: BytesLike;
}> = ({ patchNodeId }) => {
  const { packageOwner } = usePolywrapRegistry();
  const [votingInfo, setVotingInfo] = useState({
    verifierCount: 0,
    approvingVerifiers: 0,
    rejectingVerifiers: 0,
  });

  const votesNeeded = votingInfo.verifierCount / 2 + 1;

  useEffect(() => {
    async () => {
      const votingInfo = await packageOwner.getProposedVersionVotingInfo(
        patchNodeId
      );
      setVotingInfo({
        verifierCount: votingInfo.verifierCount.toNumber(),
        approvingVerifiers: votingInfo.approvingVerifiers.toNumber(),
        rejectingVerifiers: votingInfo.rejectingVerifiers.toNumber(),
      });
    };
  }, []);

  return (
    <div className="VerifyingStatusView">
      <div>Status: Verifying</div>
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
