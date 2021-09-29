const SidebarMenuItems: React.FC = () => {
  return (
    <ul className="sidebar-menu-items sidebarMenuInner">
      <li>
        <a href="/" target="_self">
          Wrappers
        </a>
      </li>
      <li>
        <a href="/version-publish" target="_self">
          Version publish
        </a>
      </li>
      <li>
        <a href="/implementation-registry" target="_self">
          Implementations
        </a>
      </li>
    </ul>
  );
};

export default SidebarMenuItems;
