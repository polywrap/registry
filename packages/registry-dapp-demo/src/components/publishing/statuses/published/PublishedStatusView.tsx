import { VersionInfo } from "../../../../types/VersionInfo";
import VersionInfoComponent from "../../../versions/VersionInfoComponent";
import "./PublishedStatusView.scss";

const PublishedStatusView: React.FC<{
  versionInfo: VersionInfo;
}> = ({ versionInfo }) => {
  return (
    <div className="PublishedStatusView">
      <div>Status: Published</div>
      <div>
        <VersionInfoComponent versionInfo={versionInfo}></VersionInfoComponent>
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
