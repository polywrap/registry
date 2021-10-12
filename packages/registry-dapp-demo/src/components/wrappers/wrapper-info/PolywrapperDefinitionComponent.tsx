import "./WrapperInfoComponent.scss";
import { useState } from "react";
import React from "react";
import { EnsDomain } from "@polywrap/registry-js";

const PolywrapperDefinitionComponent: React.FC<{
  loadPolywrapperInfo: (domain: EnsDomain) => Promise<void>;
}> = ({ loadPolywrapperInfo }) => {
  const [domainName, setDomainName] = useState("");
  const [domainRegistry, setDomainRegistry] = useState("ens");

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

      <button
        className="find-btn"
        onClick={() => loadPolywrapperInfo(new EnsDomain(domainName))}
      >
        Find
      </button>
    </div>
  );
};

export default PolywrapperDefinitionComponent;
