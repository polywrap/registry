import "./Content.scss";
import Logo from "../../../logo.png";
import WrapperInfoComponent from "../../wrappers/wrapper-info/WrapperInfoComponent";
import React from "react";
import { PolywrapRegistryContext } from "../../../providers/PolywrapRegistryContextProvider";

const Content: React.FC = () => {
  const registry = React.useContext(PolywrapRegistryContext);

  return (
    <div className="Content">
      <div className="row">
        <div>
          <img src={Logo} className="main__logo" />
          <h3 className="title">Polywrap Registry dApp</h3>
        </div>

        <div className="widget-container">
          {registry ? <WrapperInfoComponent></WrapperInfoComponent> : <></>}
        </div>
      </div>
    </div>
  );
};
export default Content;
