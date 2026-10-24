"use client";

import { usePathname } from "next/navigation";
import { MenuGroup } from "./MenuGroup";
import { MenuItem } from "./MenuItem";
import { isActive, NAV_GROUPS } from "../Navigation/nav-items";

// Desktop navigation (lg and up); phones use the tab bar and the menu
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 shrink-0 border-r border-r-gray-300 pr-6">
      <nav className="sticky top-6">
        {NAV_GROUPS.map((group) => (
          <MenuGroup key={group.title} title={group.title}>
            {group.items.map((item) => (
              <MenuItem
                key={item.to}
                to={item.to}
                title={item.title}
                icon={item.icon(20)}
                active={isActive(pathname, item.to)}
              />
            ))}
          </MenuGroup>
        ))}
      </nav>
    </aside>
  );
}
