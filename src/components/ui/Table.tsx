import type { ReactNode } from "react";

type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
};

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
};

export function Table<T extends Record<string, unknown>>({
  data,
  columns,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl shadow">
      <table className="min-w-full border border-gray-100 bg-white dark:bg-blue-200">
        <thead className="bg-primary text-white">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key as string}
                className="px-4 py-2 text-center font-sans"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="border-t border-gray-100 hover:bg-gray-50 dark:hover:bg-blue-300"
            >
              {columns.map((col) => (
                <td key={col.key as string} className="px-4 py-2 text-center">
                  {col.render ? col.render(row) : (row[col.key] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
