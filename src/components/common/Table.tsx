export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
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
  const getValue = (row: T, column: Column<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(row);
    }
    return row[column.accessor] as React.ReactNode;
  };

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
                className={`label-caps text-[0.65rem] font-medium ${
                  column.className ?? ""
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {data.map((row, rowIndex) => (
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
