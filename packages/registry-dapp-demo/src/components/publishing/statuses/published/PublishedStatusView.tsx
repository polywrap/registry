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
      </div>
    </div>
  );
};

export default PublishedStatusView;
