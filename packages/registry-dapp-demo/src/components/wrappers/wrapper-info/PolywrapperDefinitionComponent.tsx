import "./WrapperInfoComponent.scss";
import { useState } from "react";
import React from "react";
import { EnsDomain } from "@polywrap/registry-core-js";
import { usePolywrapRegistry } from "../../../hooks/usePolywrapRegistry";
import { PolywrapperInfo } from "../../../types/PolywrapperInfo";
import { fetchPolywrapperInfo } from "../../../helpers/fetchPolywrapInfo";

const PolywrapperDefinitionComponent: React.FC<{
  setPolywrapperInfo: React.Dispatch<
    React.SetStateAction<PolywrapperInfo | undefined>
  >;
}> = ({ setPolywrapperInfo }) => {
  const { packageOwner } = usePolywrapRegistry();

  const [domainName, setDomainName] = useState("");
  const [domainRegistry, setDomainRegistry] = useState("ens");

  return (
    <div className="PolywrapperDefinitionComponent polywrapper-definition">
      <select
        value={domainRegistry}
        onChange={async (e) => {
          setDomainRegistry(e.target.value);
        }}
      >
        <option selected value="ens">
          ens
        </option>
      </select>
      <input
        type="text"
        value={domainName}
        placeholder="Domain..."
        onChange={async (e) => {
          setDomainName(e.target.value);
        }}
      />

      <button
        className="find-btn"
        onClick={async () => {
          const domain = new EnsDomain(domainName);

          setPolywrapperInfo(await fetchPolywrapperInfo(domain, packageOwner));
        }}
      >
        Find
      </button>
    </div>
  );
};

export default PolywrapperDefinitionComponent;
