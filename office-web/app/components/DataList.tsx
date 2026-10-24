import { ReactNode } from "react";

export interface DataListColumn<T> {
  header: string;
  cell: (item: T) => ReactNode;
}

interface DataListProps<T> {
  items: T[];
  columns: DataListColumn<T>[];
  getKey: (item: T) => string;
  // Card layout for small screens; by default each column becomes a
  // "label: value" line
  renderCard?: (item: T) => ReactNode;
  empty?: ReactNode;
}

// A table from md up and a list of cards below, so lists never need a
// horizontal scroll on phones
export function DataList<T>({
  items,
  columns,
  getKey,
  renderCard,
  empty,
}: DataListProps<T>) {
  if (items.length === 0) {
    return empty ? <>{empty}</> : null;
  }

  return (
    <>
      <ul className="md:hidden flex flex-col gap-3">
        {items.map((item) => (
          <li
            key={getKey(item)}
            className="bg-gray-100 rounded-lg shadow-md p-4 flex flex-col gap-3"
          >
            {renderCard
              ? renderCard(item)
              : columns.map((column) => (
                  <div key={column.header} className="flex flex-col gap-1">
                    <span className="text-xs font-title text-gray-500">
                      {column.header}
                    </span>
                    {column.cell(item)}
                  </div>
                ))}
          </li>
        ))}
      </ul>

      <table className="hidden md:table w-full border-collapse bg-gray-100 shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-white">
            {columns.map((column) => (
              <th
                key={column.header}
                className="px-6 py-4 font-title text-gray-500 font-normal text-left"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={getKey(item)}
              className="border-b border-b-gray-300 last:border-b-0 hover:bg-blue-50"
            >
              {columns.map((column) => (
                <td key={column.header} className="px-6 py-5 align-middle">
                  {column.cell(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
