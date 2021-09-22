import "./WrapperInfoComponent.scss";
import { useEffect, useState } from "react";
import React from "react";
import { EnsDomain } from "@polywrap/registry-core-js";
import { usePolywrapRegistry } from "../../../hooks/usePolywrapRegistry";
import { PolywrapperInfo } from "../../../types/PolywrapperInfo";

const PolywrapperDefinitionComponent: React.FC<{
  setPolywrapperInfo: React.Dispatch<
    React.SetStateAction<PolywrapperInfo | undefined>
  >;
}> = ({ setPolywrapperInfo }) => {
  const { packageOwner } = usePolywrapRegistry();

  const [polywrapperInfo, _setPolywrapperInfo] = useState<PolywrapperInfo>({
    domainName: "",
    domainRegistry: "ens",
  });

  return (
    <div className="PolywrapperDefinitionComponent polywrapper-definition">
      <select>
        <option selected value="ens">
          ens
        </option>
      </select>
      <input
        type="text"
        value={polywrapperInfo.domainName}
        placeholder="Domain..."
        onChange={async (e) => {
          _setPolywrapperInfo((p) => {
            return {
              ...p,
              domainName: e.target.value,
            };
          });
        }}
      />

      <button
        className="find-btn"
        onClick={async () => {
          const domain = new EnsDomain(polywrapperInfo.domainName);

          setPolywrapperInfo(polywrapperInfo);
          packageOwner
            .getNodeInfo(domain.packageId)
            .then((a) => {
              console.log(a);
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      >
        Find
      </button>
    </div>
  );
};

export default PolywrapperDefinitionComponent;
