import "./Sidebar.scss";
import SidebarMenuItems from "./SidebarMenuItems";
import Logo from "../../logo.png";
import { useWeb3 } from "../../hooks/useWeb3";
import { toPrettyHex } from "../../helpers/toPrettyHex";

const Sidebar: React.FC = () => {
  const web3 = useWeb3();

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
              <div>Network: {web3.networkName}</div>
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
