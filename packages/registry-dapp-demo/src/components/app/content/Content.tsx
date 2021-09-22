import "./Content.scss";
import Logo from "../../../logo.png";
import WrapperInfoComponent from "../../wrappers/wrapper-info/WrapperInfoComponent";
import { PackageOwner } from "@polywrap/registry-js";

const Content: React.FC<{
  packageOwner: PackageOwner;
}> = ({ packageOwner }) => {
  return (
    <div className="Content">
      <div className="row">
        <div>
          <img src={Logo} className="main__logo" />
          <h3 className="title">Polywrap Registry dApp</h3>
        </div>

        <div className="widget-container">
          <WrapperInfoComponent
            packageOwner={packageOwner}
          ></WrapperInfoComponent>
        </div>
      </div>
    </div>
  );
};
export default Content;
