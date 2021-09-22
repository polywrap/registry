import { PolywrapperInfo } from "../../../../types/PolywrapperInfo";

const InfoTabComponent: React.FC<{
  polywrapperInfo: PolywrapperInfo;
}> = ({ polywrapperInfo }) => {
  return (
    <div className="InfoTab">
      <div>
        <h3>Info</h3>
        <div>Domain</div>
        <div>Registry: {polywrapperInfo.domainRegistry}</div>
        <div>Name: {polywrapperInfo.domainName}</div>
        <div>Owner: 0x0</div>
        <div>Controller: 0x0</div>
        <div>Polywrap owner: 0x0</div>
        <div>Polywrapper</div>
        <div>
          Owner: 0x0 <button>Update owner</button>
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
