import "./WrapperInfoComponent.scss";
import { useState } from "react";
import React from "react";
import {
  EnsDomain,
  handleContractError,
  handleError,
} from "@polywrap/registry-js";
import { useToasts } from "react-toast-notifications";

const PolywrapperDefinitionComponent: React.FC<{
  loadPolywrapperInfo: (domain: EnsDomain) => Promise<void>;
}> = ({ loadPolywrapperInfo }) => {
  const [domainName, setDomainName] = useState("");
  const [domainRegistry, setDomainRegistry] = useState("ens");
  const { addToast } = useToasts();

  const onFind = async () => {
    const [error] = await handleError(async () => {
      const [polywrapperInfoError] = await handleContractError(() =>
        loadPolywrapperInfo(new EnsDomain(domainName))
      )();
      if (polywrapperInfoError) {
        console.error(polywrapperInfoError);
        addToast(polywrapperInfoError.revertMessage, {
          appearance: "error",
          autoDismiss: true,
        });
        return;
      }
    })();

    if (error) {
      console.error(error);
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
      return;
    }
  };

  return (
    <div className="PolywrapperDefinitionComponent polywrapper-definition">
      <select
        className="domain-registry"
        value={domainRegistry}
        onChange={async (e) => {
          setDomainRegistry(e.target.value);
        }}
      >
        <option value="ens">ENS</option>
      </select>
      <input
        type="text"
        value={domainName}
        placeholder="Domain..."
        onChange={async (e) => {
          setDomainName(e.target.value);
        }}
      />

      <button className="find-btn" onClick={onFind}>
        Find
      </button>
    </div>
  );
};

export default PolywrapperDefinitionComponent;
