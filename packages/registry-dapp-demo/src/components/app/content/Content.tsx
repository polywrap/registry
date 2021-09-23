import "./Content.scss";
import WrapperInfoComponent from "../../wrappers/wrapper-info/WrapperInfoComponent";
import React from "react";
import { PolywrapRegistryContext } from "../../../providers/PolywrapRegistryContextProvider";

const Content: React.FC = () => {
  const registry = React.useContext(PolywrapRegistryContext);

  return (
    <div className="Content">
      <div className="row">
        <div>
          <h3 className="title">Wrappers</h3>
        </div>

        <div className="widget-container">
          {registry ? <WrapperInfoComponent></WrapperInfoComponent> : <></>}
        </div>
      </div>
    </div>
  );
};
export default Content;
