import "./UnproposedStatusView.scss";

const UnproposedStatusView: React.FC = () => {
  return (
    <div className="Unproposed">
      <div>Status: Unproposed</div>
      <div>Verifying...</div>
      <div>Proposing...</div>
      <button>Propose</button>
    </div>
  );
};

export default UnproposedStatusView;
