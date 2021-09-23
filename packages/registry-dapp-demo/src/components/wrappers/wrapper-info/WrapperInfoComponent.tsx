import "./WrapperInfoComponent.scss";
import { useState } from "react";
import InfoTab from "./tabs/InfoTabComponent";
import VersionsTab from "./tabs/VersionsTabComponent";
import React from "react";
import PolywrapperDefinitionComponent from "./PolywrapperDefinitionComponent";
import { PolywrapperInfo } from "../../../types/PolywrapperInfo";

const WrapperInfoComponent: React.FC = () => {
  const [polywrapperInfo, setPolywrapperInfo] = useState<PolywrapperInfo>();

  return (
    <div className="WrapperInfoComponent widget">
      <PolywrapperDefinitionComponent
        setPolywrapperInfo={setPolywrapperInfo}
      ></PolywrapperDefinitionComponent>

      {polywrapperInfo ? (
        <div className="tabs">
          <InfoTab polywrapperInfo={polywrapperInfo}></InfoTab>

          <VersionsTab polywrapperInfo={polywrapperInfo}></VersionsTab>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default WrapperInfoComponent;
