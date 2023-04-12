import { ReactNode } from "react";

interface TableProps {
  columnNames: string[];
  children: ReactNode;
}

export function Table({ columnNames, children }: TableProps) {
  return (
    <table className="w-full border-collapse bg-gray-100 shadow-md rounded-lg mt-10">
      <thead>
        <tr className="bg-white">
          {columnNames.map((column, index) => (
            <th
              key={column}
              className={`
              ${
                index === 0
                  ? "rounded-tl-lg font-title text-gray-500 font-normal text-left pl-8"
                  : index === columnNames.length - 1
                  ? "rounded-tr-lg font-title text-gray-500 font-normal text-left pr-8"
                  : "px-8 py-4 font-title text-gray-500 font-normal text-left "
              }`}
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
