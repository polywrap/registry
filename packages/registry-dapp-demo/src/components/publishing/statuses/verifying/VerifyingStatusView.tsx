import { BytesLike } from "ethers";
import { useEffect, useState } from "react";
import { usePolywrapRegistry } from "../../../../hooks/usePolywrapRegistry";
import "./VerifyingStatusView.scss";

const VerifyingStatusView: React.FC<{
  patchNodeId: BytesLike;
  packageLocation: string;
  reloadVersionStatusInfo: () => Promise<void>;
}> = ({ patchNodeId, packageLocation, reloadVersionStatusInfo }) => {
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

  useEffect(() => {
    (async () => {
      await packageOwner._waitForVotingEnd(patchNodeId, packageLocation);
      await reloadVersionStatusInfo();
    })();
  }, []);

  return (
    <div className="VerifyingStatusView">
      <div className="status">Status: Verifying</div>
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
    </div>
  );
};

export default VerifyingStatusView;
