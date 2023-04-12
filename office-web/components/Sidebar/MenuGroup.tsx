import { ReactNode } from "react";
import * as Separator from "@radix-ui/react-separator";

interface MenuGroupProps {
  title: string;
  children: ReactNode;
}

export function MenuGroup({ title, children }: MenuGroupProps) {
  return (
    <div className="flex flex-col p-4">
      <div className="flex flex-col gap-4">
        <h3 className="mb-2 font-title font-bold text-blue-400">{title}</h3>
        {children}
      </div>
      <Separator.Root className="bg-gray-300 mt-8 w-[90%] h-[1px]" />
    </div>
  );
}
