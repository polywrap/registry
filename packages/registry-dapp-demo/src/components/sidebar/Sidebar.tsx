import "./Sidebar.scss";
import SidebarMenuItems from "./SidebarMenuItems";
import Logo from "../../logo.png";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar row">
      <div className="header">
        <div className="header-content">
          <img src={Logo} className="mini__logo" />

          <span>Polywrap Registry</span>
        </div>
      </div>

      <div id="sidebarMenu">
        <SidebarMenuItems />
      </div>
    </div>
  );
};

export default Sidebar;
