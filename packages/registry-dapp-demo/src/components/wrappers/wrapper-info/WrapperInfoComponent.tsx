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
import { EnsDomain, handleError } from "@polywrap/registry-js";
import { useToasts } from "react-toast-notifications";

const WrapperInfoComponent: React.FC = () => {
  const [web3] = useWeb3Context();
  const { packageOwner } = usePolywrapRegistry();

  const [isInfoLoading, setIsInfoLoading] = useState(false);
  const { addToast } = useToasts();

  useEffect(() => {
    setPolywrapperInfo(undefined);
  }, [web3, web3?.networkName]);

  const [polywrapperInfo, setPolywrapperInfo] = useState<PolywrapperInfo>();

  const loadPolywrapperInfo = async (domain: EnsDomain) => {
    const [error, info] = await handleError(() =>
      fetchPolywrapperInfo(domain, packageOwner)
    )();

    if (error) {
      if ("message" in (error as any)) {
        addToast((error as any).message, {
          appearance: "error",
          autoDismiss: true,
        });
      } else {
        addToast(`An error occurred`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
      console.error(error);
      return;
    }

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
