import { ReactNode } from "react";

interface TableRowProps {
  children: ReactNode;
}

export function TableRow({ children }: TableRowProps) {
  return (
    <tr className="border-b border-b-gray-300 hover:bg-blue-50">{children}</tr>
  );
}
