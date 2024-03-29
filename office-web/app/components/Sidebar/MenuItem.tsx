import Link from "next/link";
import { ReactElement } from "react";

interface MenuItemProps {
  to?: string;
  title: string;
  icon?: ReactElement;
}

export function MenuItem({ to = "#", title, icon }: MenuItemProps) {
  return (
    <span className="flex gap-4 items-center justify-start">
      {icon && icon}
      <Link
        href={to}
        className="text-gray-500 tracking-wide hover:opacity-60 transition-opacity"
      >
        {title}
      </Link>
    </span>
  );
}
