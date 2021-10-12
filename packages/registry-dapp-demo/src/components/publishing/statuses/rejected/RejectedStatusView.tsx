import { BytesLike } from "ethers";
import { useEffect, useState } from "react";
import { usePolywrapRegistry } from "../../../../hooks/usePolywrapRegistry";
import "./RejectedStatusView.scss";

const RejectedStatusView: React.FC<{
  patchNodeId: BytesLike;
}> = ({ patchNodeId }) => {
  const { packageOwner } = usePolywrapRegistry();

  const [isLoading, setIsLoading] = useState(true);
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
      approvingVerifiers: votingInfo.approvingVerifierCount.toNumber(),
      rejectingVerifiers: votingInfo.rejectingVerifierCount.toNumber(),
    });
  };

  const votesNeeded = Math.floor(votingInfo.verifierCount / 2) + 1;

  useEffect(() => {
    (async () => {
      await loadVotingInfo();
      setIsLoading(false);
    })();
  }, []);

  return (
    <div className="RejectedStatusView">
      <div>Status: Rejected</div>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div>Verifiers: {votingInfo.verifierCount}</div>
            <div>
              Approvals: {votingInfo.approvingVerifiers}/{votesNeeded}
            </div>
            <div>
              Denials: {votingInfo.rejectingVerifiers}/{votesNeeded}
            </div>
          </>
        )}
      </div>
      <button>Re-propose</button>
    </div>
  );
};

export default RejectedStatusView;
