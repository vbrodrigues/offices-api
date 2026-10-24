"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdMenu } from "react-icons/md";
import { isActive, NAV_GROUPS, TAB_ITEMS } from "./nav-items";

interface BottomNavProps {
  onOpenMenu: () => void;
}

const tabClass = (active: boolean) =>
  `flex-1 flex flex-col items-center justify-center gap-1 min-h-[56px] text-xs transition-colors ${
    active ? "text-blue-500" : "text-gray-500"
  }`;

// Thumb-reachable navigation for phones and tablets (below lg)
export function BottomNav({ onOpenMenu }: BottomNavProps) {
  const pathname = usePathname();

  // Highlight "Menu" when the page lives there (settings pages)
  const inMenu = NAV_GROUPS.flatMap((group) => group.items).some(
    (item) =>
      isActive(pathname, item.to) &&
      !TAB_ITEMS.some((tab) => tab.to === item.to)
  );

  return (
    <nav className="lg:hidden fixed z-30 inset-x-0 bottom-0 bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex">
        {TAB_ITEMS.map((item) => {
          const active = isActive(pathname, item.to);
          return (
            <Link
              key={item.to}
              href={item.to}
              aria-current={active ? "page" : undefined}
              className={tabClass(active)}
            >
              {item.icon(22)}
              {item.shortTitle ?? item.title}
            </Link>
          );
        })}
        <button type="button" onClick={onOpenMenu} className={tabClass(inMenu)}>
          <MdMenu size={24} />
          Menu
        </button>
      </div>
    </nav>
  );
}
