import VersionPublishComponent from "../../publishing/VersionPublishComponent";
import "./VersionPublishPage.scss";
import { useLocation } from "react-router-dom";
const VersionPublishPage: React.FC = () => {
  const search = useLocation().search;
  const domain = new URLSearchParams(search).get("domain");
  const version = new URLSearchParams(search).get("version");

  return (
    <div className="Content">
      <div className="row">
        <div>
          <h3 className="title">Version Publish</h3>
        </div>

        <div className="widget-container">
          <VersionPublishComponent
            defaultDomainName={domain ?? ""}
            defaultVersionNumber={version ?? ""}
          ></VersionPublishComponent>
        </div>
      </div>
    </div>
  );
};

export default VersionPublishPage;
