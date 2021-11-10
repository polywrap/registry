import "./WrapperInfoComponent.scss";
import { useEffect, useState } from "react";
import InfoTab from "./tabs/InfoTabComponent";
import VersionsTab from "./tabs/VersionsTabComponent";
import React from "react";
import PolywrapperDefinitionComponent from "./PolywrapperDefinitionComponent";
import { PolywrapperInfo } from "../../../types/PolywrapperInfo";
import { useWeb3Context } from "../../../hooks/useWeb3Context";
import { usePolywrapRegistry } from "../../../hooks/usePolywrapRegistry";
import { fetchPolywrapperInfo } from "../../../helpers/fetchPolywrapInfo";
import { EnsDomain } from "@polywrap/registry-js";

const WrapperInfoComponent: React.FC = () => {
  const [web3] = useWeb3Context();
  const { packageOwner } = usePolywrapRegistry();

  const [isInfoLoading, setIsInfoLoading] = useState(false);

  useEffect(() => {
    setPolywrapperInfo(undefined);
  }, [web3, web3?.networkName]);

  const [polywrapperInfo, setPolywrapperInfo] = useState<PolywrapperInfo>();

  const loadPolywrapperInfo = async (domain: EnsDomain) => {
    const info = await fetchPolywrapperInfo(domain, packageOwner);
    setPolywrapperInfo(info);
  };

  return (
    <div className="WrapperInfoComponent">
      <PolywrapperDefinitionComponent
        loadPolywrapperInfo={loadPolywrapperInfo}
      ></PolywrapperDefinitionComponent>

      {polywrapperInfo ? (
        <div className="tabs">
          <InfoTab
            polywrapperInfo={polywrapperInfo}
            loadPolywrapperInfo={loadPolywrapperInfo}
          ></InfoTab>

          <VersionsTab polywrapperInfo={polywrapperInfo}></VersionsTab>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default WrapperInfoComponent;
