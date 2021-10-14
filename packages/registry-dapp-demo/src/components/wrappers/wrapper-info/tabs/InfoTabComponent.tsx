import {
  BlockchainsWithRegistry,
  EnsDomain,
  handleContractError,
  handleError,
} from "@polywrap/registry-js";
import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
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

  const { addToast } = useToasts();

  const onUpdateOwner = async () => {
    const [error] = await handleError(async () => {
      const [updateOwnershipError] = await handleContractError(() =>
        updateOwnership(polywrapperInfo.domain, packageOwner)
      )();
      if (updateOwnershipError) {
        console.error(updateOwnershipError);
        addToast(updateOwnershipError.revertMessage, {
          appearance: "error",
          autoDismiss: true,
        });
        return;
      }
      const [polywrapperInfoError] = await handleContractError(() =>
        loadPolywrapperInfo(polywrapperInfo.domain)
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
      addToast(error.message, {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }
  };

  const onRelayOwnership = async () => {
    const [error] = await handleError(async () => {
      const [error] = await handleContractError(() =>
        relayOwnership(polywrapperInfo.domain, relayChain, packageOwner)
      )();
      if (error) {
        console.error(error);
        addToast(error.revertMessage, {
          appearance: "error",
          autoDismiss: true,
        });
        return;
      }
    })();
    if (error) {
      console.error(error);
      addToast(error.message, {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }
  };

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
                    <button onClick={onUpdateOwner}>Update owner</button>
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
                      <button onClick={onRelayOwnership}>
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
