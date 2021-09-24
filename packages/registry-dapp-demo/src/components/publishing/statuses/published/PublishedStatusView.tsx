import "./PublishedStatusView.scss";

const PublishedStatusView: React.FC = () => {
  return (
    <div className="PublishedStatusView">
      <div>Status: Published</div>
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

export default PublishedStatusView;
