import { BlockchainsWithRegistry, EnsDomain } from "@polywrap/registry-js";
import { useEffect, useState } from "react";
import { hasDomainRegistry } from "../../../../constants";
import { relayOwnership } from "../../../../helpers/relayOwnership";
import { toPrettyHex } from "../../../../helpers/toPrettyHex";
import { updateOwnership } from "../../../../helpers/updateOwnership";
import { usePolywrapRegistry } from "../../../../hooks/usePolywrapRegistry";
import { useWeb3Context } from "../../../../hooks/useWeb3Context";
import { PolywrapperInfo } from "../../../../types/PolywrapperInfo";
import NetworkSpecificView from "../../../network-specific-view/NetworkSpecificView";

const InfoTabComponent: React.FC<{
  polywrapperInfo: PolywrapperInfo;
  loadPolywrapperInfo: (domain: EnsDomain) => Promise<void>;
}> = ({ polywrapperInfo, loadPolywrapperInfo }) => {
  const { packageOwner } = usePolywrapRegistry();
  const [web3] = useWeb3Context();
  const networkName = web3?.networkName;
  const [relayChain, setRelayChain] = useState<BlockchainsWithRegistry>(
    "l2-chain-name"
  );

  const [showRelayOwnershipButton, setShowRelayOwnershipButton] = useState(
    false
  );

  useEffect(() => {
    if (networkName) {
      setShowRelayOwnershipButton(hasDomainRegistry(networkName));
    }
  }, [networkName]);

  return (
    <div className="InfoTab">
      <div>
        <h3>Info</h3>

        <div className="info-tables">
          <table className="polywrapper-table widget">
            <tbody>
              <tr>
                <td colSpan={2}>Polywrapper</td>
              </tr>
              <tr>
                <td>Owner:</td>
                <td>
                  {toPrettyHex(polywrapperInfo.polywrapOwner)}
                  {polywrapperInfo.polywrapOwner === web3?.account
                    ? " (you)"
                    : ""}
                  {networkName === "rinkeby" &&
                  polywrapperInfo.polywrapOwner !==
                    polywrapperInfo.domainPolywrapOwner ? (
                    <button
                      onClick={async () => {
                        await updateOwnership(
                          polywrapperInfo.domain,
                          packageOwner
                        );

                        await loadPolywrapperInfo(polywrapperInfo.domain);
                      }}
                    >
                      Update owner
                    </button>
                  ) : (
                    <></>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {networkName === "rinkeby" ? (
            <table className="info-table widget">
              <tbody>
                <tr>
                  <td colSpan={2}>Domain</td>
                </tr>
                <tr>
                  <td>Registry:</td>
                  <td>{polywrapperInfo.domain.registry}</td>
                </tr>
                <tr>
                  <td>Name:</td>
                  <td>{polywrapperInfo.domain.name}</td>
                </tr>
                <tr>
                  <td>Polywrap owner:</td>
                  <td>
                    {toPrettyHex(polywrapperInfo.domainPolywrapOwner)}
                    {polywrapperInfo.domainPolywrapOwner === web3?.account
                      ? " (you)"
                      : ""}
                  </td>
                </tr>
                <NetworkSpecificView network="rinkeby">
                  <tr>
                    <td colSpan={2}>
                      <select
                        className="relay-chain"
                        value={relayChain}
                        onChange={async (e) => {
                          setRelayChain(
                            e.target.value as BlockchainsWithRegistry
                          );
                        }}
                      >
                        <option value="l2-chain-name">xDAI</option>
                      </select>
                      <button
                        onClick={() =>
                          relayOwnership(
                            polywrapperInfo.domain,
                            relayChain,
                            packageOwner
                          )
                        }
                      >
                        Relay ownership
                      </button>
                    </td>
                  </tr>
                </NetworkSpecificView>
              </tbody>
            </table>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoTabComponent;
