import { toPrettyHex } from "../../../../helpers/toPrettyHex";
import { PolywrapperInfo } from "../../../../types/PolywrapperInfo";

const InfoTabComponent: React.FC<{
  polywrapperInfo: PolywrapperInfo;
}> = ({ polywrapperInfo }) => {
  return (
    <div className="InfoTab">
      <div>
        <h3>Info</h3>
        <div>Domain:</div>
        <div>Registry: {polywrapperInfo.domain.registry}</div>
        <div>Name: {polywrapperInfo.domain.name}</div>
        <div>
          Polywrap owner: {toPrettyHex(polywrapperInfo.domainPolywrapOwner)}
          {polywrapperInfo.domainPolywrapOwner === "0x0" ? "(you)" : ""}
        </div>
        <div>Polywrapper</div>
        <div>
          Owner: {toPrettyHex(polywrapperInfo.polywrapOwner)}
          {polywrapperInfo.polywrapOwner === "0x0" ? "(you)" : ""}
          {polywrapperInfo.polywrapOwner !==
          polywrapperInfo.domainPolywrapOwner ? (
            <button>Update owner</button>
          ) : (
            <></>
          )}
        </div>
        <div>
          <select>
            <option selected value="xdai">
              xDAI
            </option>
          </select>
          <button>Relay ownership</button>
        </div>
      </div>
    </div>
  );
};

export default InfoTabComponent;
