const SidebarMenuItems: React.FC = () => {
  return (
    <ul className="sidebar-menu-items sidebarMenuInner">
      <li>
        <a href="/wrappers">Wrappers</a>
      </li>
      <li>
        <a href="/versions" target="_blank">
          Versions
        </a>
      </li>
      <li>
        <a href="/implementations" target="_blank">
          Implementations
        </a>
      </li>
    </ul>
  );
};

export default SidebarMenuItems;
