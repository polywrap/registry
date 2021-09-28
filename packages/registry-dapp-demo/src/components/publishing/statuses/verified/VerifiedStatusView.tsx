import "./VerifiedStatusView.scss";

const VerifiedStatusView: React.FC = () => {
  return (
    <div className="VerifiedStatusView">
      <div className="status">Status: Verified</div>
      <div>
        <button>Publish to xDAI</button>
        <button>Publish to Ethereum</button>
        <div>
          <button>Fetch and calculate proof</button>
          <input type="text" disabled placeholder="Proof..." />
          <button>Copy to clipboard</button>
        </div>
      </div>
    </div>
  );
};

export default VerifiedStatusView;
