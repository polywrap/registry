import "./Sidebar.scss";
import SidebarMenuItems from "./SidebarMenuItems";
import Logo from "../../logo.png";
import { useWeb3Context } from "../../hooks/useWeb3Context";
import { toPrettyHex } from "../../helpers/toPrettyHex";
import { SupportedNetwork } from "../../constants";
import { useEffect, useState } from "react";
import { Web3 } from "../../types/Web3";

const Sidebar: React.FC = () => {
  const [web3, setWeb3] = useWeb3Context();
  const [networkName, setNetworkName] = useState<SupportedNetwork>();

  useEffect(() => {
    if (web3) {
      setNetworkName(web3.networkName);
    }
  }, [web3]);

  useEffect(() => {
    if (web3 && networkName) {
      setWeb3((web3: Web3 | undefined) => {
        return {
          ...web3,
          networkName,
        } as Web3 | undefined;
      });
    }
  }, [networkName]);

  return (
    <div className="sidebar row">
      <div className="header">
        <div className="header-title">
          <img src={Logo} className="mini__logo" />

          <span>Polywrap Registry</span>
        </div>
        <div className="account-details">
          {web3 ? (
            <div>
              <div>
                <span className="network-label">Network: </span>
                <select
                  className="relay-chain"
                  value={networkName}
                  onChange={(e) => {
                    setNetworkName(e.target.value as SupportedNetwork);
                  }}
                >
                  <option value="xdai">xDAI</option>
                  <option value="rinkeby">Rinkeby</option>
                </select>
              </div>
              <div>Account: {toPrettyHex(web3.account)}</div>
            </div>
          ) : (
            <div>Connecting...</div>
          )}
        </div>
      </div>

      <div id="sidebarMenu">
        <SidebarMenuItems />
      </div>
    </div>
  );
};

export default Sidebar;
