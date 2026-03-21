import type { ReactNode } from "react";
import { Button } from "../../atoms";

export type TableColumn<T> = {
  title: string | ReactNode;
  key: keyof T | "actions" | "selection";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, item: T) => ReactNode;
  headerRender?: () => ReactNode;
  className?: string;
};

type TableAction = "detail" | "edit" | "remove";

type Props<T> = {
  columns: TableColumn<T>[];
  data: T[];
  rowKey?: keyof T;
  hasColumnActions?: boolean;
  renderActions?: (item: T) => ReactNode;
  onAction?: (action: TableAction, item: T) => void;
  className?: string;
};

export default function DynamicTable<T>({
  columns,
  data,
  rowKey,
  hasColumnActions,
  renderActions,
  onAction,
  className = "",
}: Props<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-md bg-background-body-background">
      <table className={`w-full text-left text-text-primary ${className}`}>
        <thead className="text-table-header bg-action-focus">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`text-nowrap px-6 py-4 ${col.className || ""}`}
              >
                {col.headerRender ? col.headerRender() : col.title}
              </th>
            ))}
            {hasColumnActions && (
              <th className="text-nowrap px-6 py-4 text-center">Thao tác</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-other-outlined-border border-b border-other-outlined-border">
          {data.length > 0 ? (
            data.map((item, rowIndex) => {
              // Sử dụng rowKey nếu có, nếu không dùng rowIndex
              const uniqueKey = rowKey ? String(item[rowKey]) : rowIndex;

              return (
                <tr
                  key={uniqueKey}
                  className="transition-colors hover:bg-action-hover"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`text-body-2 text-nowrap px-6 py-4 ${col.className || ""}`}
                    >
                      {col.render
                        ? col.render(item[col.key as keyof T], item)
                        : (item[col.key as keyof T] as ReactNode)}
                    </td>
                  ))}

                  {/* Render Actions nếu có */}
                  {hasColumnActions && (
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-1">
                        {renderActions ? (
                          renderActions(item)
                        ) : (
                          // Mặc định nếu không truyền renderActions
                          <>
                            <Button
                              variant={"text"}
                              size={"small"}
                              color={"primary"}
                              onClick={() => onAction?.("detail", item)}
                              className="text-nowrap"
                            >
                              Chi tiết
                            </Button>
                            <Button
                              variant={"text"}
                              size={"small"}
                              color={"primary"}
                              onClick={() => onAction?.("edit", item)}
                              className="text-nowrap"
                            >
                              Sửa
                            </Button>
                            <Button
                              variant={"text"}
                              size={"small"}
                              color={"primary"}
                              onClick={() => onAction?.("remove", item)}
                              className="text-nowrap"
                            >
                              Xóa
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={columns.length + (hasColumnActions ? 1 : 0)}
                className="px-6 py-10 text-center italic text-text-disabled"
              >
                Không có dữ liệu hiển thị
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
