interface Column<T> {
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
      className={`overflow-x-auto rounded-box border border-base-content/5 bg-base-100 ${className}`}
    >
      <table className="table">
        <thead>
          <tr>
            {showIndex && <th></th>}
            {columns.map((column, index) => (
              <th key={index} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {showIndex && <th>{rowIndex + 1}</th>}
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={column.className}>
                  {getValue(row, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {footer && <tfoot>{footer}</tfoot>}
      </table>
    </div>
  );
}
