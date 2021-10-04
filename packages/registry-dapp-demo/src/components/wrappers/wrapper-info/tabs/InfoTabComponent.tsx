import { BlockchainsWithRegistry } from "@polywrap/registry-js";
import { useEffect, useState } from "react";
import { hasDomainRegistry } from "../../../../constants";
import { relayOwnership } from "../../../../helpers/relayOwnership";
import { toPrettyHex } from "../../../../helpers/toPrettyHex";
import { usePolywrapRegistry } from "../../../../hooks/usePolywrapRegistry";
import { useWeb3 } from "../../../../hooks/useWeb3";
import { PolywrapperInfo } from "../../../../types/PolywrapperInfo";

const InfoTabComponent: React.FC<{
  polywrapperInfo: PolywrapperInfo;
}> = ({ polywrapperInfo }) => {
  const { packageOwner } = usePolywrapRegistry();
  const [web3] = useWeb3();
  const name = web3?.networkName;
  const [relayChain, setRelayChain] = useState<BlockchainsWithRegistry>(
    "l2-chain-name"
  );

  const [showRelayOwnershipButton, setShowRelayOwnershipButton] = useState(
    false
  );

  useEffect(() => {
    if (name) {
      setShowRelayOwnershipButton(hasDomainRegistry(web3.networkName));
    }
  }, [name]);

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
            {showRelayOwnershipButton ? (
              <tr>
                <td colSpan={2}>
                  <select
                    className="relay-chain"
                    value={relayChain}
                    onChange={async (e) => {
                      setRelayChain(e.target.value as BlockchainsWithRegistry);
                    }}
                  >
                    <option value="l2-chain-name">xDAI</option>
                  </select>
                  <button
                    onClick={async () => {
                      await relayOwnership(
                        polywrapperInfo.domain,
                        relayChain,
                        packageOwner
                      );
                    }}
                  >
                    Relay ownership
                  </button>
                </td>
              </tr>
            ) : (
              <></>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InfoTabComponent;
