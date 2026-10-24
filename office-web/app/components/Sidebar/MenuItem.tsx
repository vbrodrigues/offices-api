import Link from "next/link";
import { ReactElement } from "react";

interface MenuItemProps {
  to?: string;
  title: string;
  icon?: ReactElement;
  active?: boolean;
  onClick?: () => void;
}

export function MenuItem({
  to = "#",
  title,
  icon,
  active = false,
  onClick,
}: MenuItemProps) {
  return (
    <Link
      href={to}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex gap-4 items-center min-h-[44px] -mx-2 px-2 rounded-lg tracking-wide transition-colors ${
        active
          ? "text-blue-500 bg-blue-50"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon}
      {title}
    </Link>
  );
}
