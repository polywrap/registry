import { toPrettyHex } from "../../../../helpers/toPrettyHex";
import { PolywrapperInfo } from "../../../../types/PolywrapperInfo";

const InfoTabComponent: React.FC<{
  polywrapperInfo: PolywrapperInfo;
}> = ({ polywrapperInfo }) => {
  return (
    <div className="InfoTab">
      <div>
        <h3>Info</h3>

        <table className="info-table">
          <tbody>
            <tr>
              <td colSpan={2}>Domain</td>
            </tr>
            <tr>
              <td>Registry</td>
              <td>{polywrapperInfo.domain.registry}</td>
            </tr>
            <tr>
              <td>Name</td>
              <td>{polywrapperInfo.domain.name}</td>
            </tr>
            <tr>
              <td>Polywrap owner</td>
              <td>
                {toPrettyHex(polywrapperInfo.domainPolywrapOwner)}
                {polywrapperInfo.domainPolywrapOwner === "0x0" ? "(you)" : ""}
              </td>
            </tr>
          </tbody>
        </table>
        <table className="polywrapper-table">
          <tbody>
            <tr>
              <td colSpan={2}>Polywrapper</td>
            </tr>
            <tr>
              <td>Owner</td>
              <td>
                {toPrettyHex(polywrapperInfo.polywrapOwner)}
                {polywrapperInfo.polywrapOwner === "0x0" ? "(you)" : ""}
                {polywrapperInfo.polywrapOwner !==
                polywrapperInfo.domainPolywrapOwner ? (
                  <button>Update owner</button>
                ) : (
                  <></>
                )}
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <select className="relay-chain" value="xdai">
                  <option value="xdai">xDAI</option>
                </select>
                <button>Relay ownership</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InfoTabComponent;
