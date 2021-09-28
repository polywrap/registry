import "./RejectedStatusView.scss";

const RejectedStatusView: React.FC = () => {
  return (
    <div className="RejectedStatusView">
      <div>Status: Rejected</div>
      <div>
        <div>Verifiers: 3</div>
        <div>Approvals: 0/2</div>
        <div>Denials: 2/2</div>
      </div>
      <button>Re-propose</button>
    </div>
  );
};

export default RejectedStatusView;
