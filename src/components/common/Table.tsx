import { useMemo, useState } from "react";
import { Notice } from "../layout/Page";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortValue?: (row: T) => string | number | null | undefined;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  showIndex?: boolean;
  className?: string;
  footer?: React.ReactNode;
}

export default function Table<T>({
  data,
  columns,
  showIndex = true,
  className = "",
  footer,
}: TableProps<T>) {
  const [sort, setSort] = useState<{ index: number; asc: boolean } | null>(
    null,
  );

  const getValue = (row: T, column: Column<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(row);
    }
    return row[column.accessor] as React.ReactNode;
  };

  const sortable = (column: Column<T>) =>
    column.sortValue !== undefined || typeof column.accessor !== "function";

  const rows = useMemo(() => {
    if (!sort) return data;
    const column = columns[sort.index];
    const dir = sort.asc ? 1 : -1;
    const value = (row: T) =>
      column.sortValue
        ? column.sortValue(row)
        : typeof column.accessor === "function"
          ? null
          : (row[column.accessor] as string | number | null | undefined);

    return [...data].sort((a, b) => {
      const x = value(a);
      const y = value(b);
      if (x == null || x === "") return y == null || y === "" ? 0 : 1;
      if (y == null || y === "") return -1;
      if (typeof x === "number" && typeof y === "number") return (x - y) * dir;
      return (
        String(x).localeCompare(String(y), undefined, { numeric: true }) * dir
      );
    });
  }, [data, columns, sort]);

  if (data.length === 0) return <Notice>No data available yet.</Notice>;

  return (
    <div
      className={`overflow-x-auto border-2 border-base-content bg-base-100 ${className}`}
    >
      <table className="table w-full">
        <thead>
          <tr className="bg-secondary text-secondary-content">
            {showIndex && <th className="label-caps text-[0.6rem] w-10"></th>}
            {columns.map((column, index) => (
              <th
                key={index}
                aria-sort={
                  sort?.index === index
                    ? sort.asc
                      ? "ascending"
                      : "descending"
                    : undefined
                }
                className={`label-caps text-[0.65rem] font-medium ${
                  column.className ?? ""
                }`}
              >
                {sortable(column) ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 cursor-pointer"
                    onClick={() =>
                      setSort((prev) =>
                        prev?.index === index
                          ? { index, asc: !prev.asc }
                          : { index, asc: true },
                      )
                    }
                  >
                    {column.header}
                    <span aria-hidden="true" className="opacity-60">
                      {sort?.index === index ? (sort.asc ? "▲" : "▼") : "⇅"}
                    </span>
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-t border-base-content/15 even:bg-base-200/50 hover:bg-warning/15"
            >
              {showIndex && (
                <th className="figures text-primary">{rowIndex + 1}</th>
              )}
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={column.className}>
                  {getValue(row, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {footer && (
          <tfoot className="border-t-2 border-base-content bg-base-300 text-base-content tabular-nums">
            {footer}
          </tfoot>
        )}
      </table>
    </div>
  );
}
