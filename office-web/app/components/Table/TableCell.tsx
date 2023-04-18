import { ReactNode } from "react";

interface TableCellProps {
  children: ReactNode;
}

export function TableCell({ children }: TableCellProps) {
  return <td className="p-8">{children}</td>;
}
