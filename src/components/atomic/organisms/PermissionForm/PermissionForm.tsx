import { useState, type FC, type FormEvent } from "react";
import { Button, Icon } from "@/components/atomic/atoms";
import { cn } from "@/utils/cn";
import type { PermissionFormData, PermissionItem } from "@/types";
import { TextField } from "../../molecules/TextField/TextField";
import { Overlay } from "../../molecules/Overlay/Overlay";

interface PermissionFormProps {
  initialData?: PermissionFormData;
  onSave: (data: PermissionFormData) => void;
  onCancel: () => void;
  className?: string;
}

const permissionCols = [
  { key: "read", title: "Xem" },
  { key: "create", title: "Thêm mới" },
  { key: "update", title: "Cập nhật" },
  { key: "delete", title: "Xoá" },
] as const;

export const PermissionForm: FC<PermissionFormProps> = ({
  initialData,
  onSave,
  onCancel,
  className,
}) => {
  const [groupName, setGroupName] = useState<string>(
    initialData?.groupName || ""
  );
  const [permissions, setPermissions] = useState<PermissionItem[]>(
    initialData?.permissions || []
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [canTakeExam, setCanTakeExam] = useState<boolean>(
    initialData?.canTakeExam || false
  );
  const [canJoinCourse] = useState<boolean>(
    initialData?.canJoinCourse || false
  );

  // Toggle single checkbox state
  const handleCheckboxChange = (
    rowKey: string,
    actionKey: keyof PermissionItem["actions"]
  ) => {
    setPermissions((prev) =>
      prev.map((row) =>
        row.key === rowKey
          ? {
              ...row,
              actions: { ...row.actions, [actionKey]: !row.actions[actionKey] },
            }
          : row
      )
    );
  };

  // Toggle all checkboxes in a specific column
  const handleColAllClick = (actionKey: keyof PermissionItem["actions"]) => {
    const isAllChecked = permissions.every((row) => row.actions[actionKey]);
    setPermissions((prev) =>
      prev.map((row) => ({
        ...row,
        actions: { ...row.actions, [actionKey]: !isAllChecked },
      }))
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ groupName, permissions, canTakeExam, canJoinCourse });
  };

  return (
    <Overlay onClose={onCancel}>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex max-h-[90vh] w-[1000px] flex-col gap-3 overflow-auto rounded-lg bg-background-paper pb-2",
          className
        )}
      >
        <div className="flex-bet-center border-b border-other-divider px-6 py-2">
          <h6 className="text-body-1 font-bold text-text-primary">
            Thêm nhóm quyền
          </h6>
          <Button
            variant="text"
            size="small"
            onClick={onCancel}
            className="min-w-0 p-1.5 text-text-secondary"
          >
            <Icon name="close" size={24} />
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-0">
          <TextField
            label="Tên nhóm quyền"
            placeholder="VD: Giảng viên"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            className="w-full"
          />

          <div className="rounded-md">
            <div className="w-full overflow-x-auto rounded-md border border-other-outlined-border bg-background-body-background">
              <table className="w-full text-left text-text-primary">
                {/* Header đồng bộ bg-action-focus và text-table-header */}
                <thead className="text-table-header bg-action-focus text-text-primary">
                  <tr>
                    <th className="px-6 py-2">Tên quyền</th>
                    {permissionCols.map((col) => (
                      <th key={col.key} className="px-6 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleColAllClick(col.key)}
                          className="font-semibold uppercase transition-colors hover:text-primary-main focus:outline-none"
                        >
                          {col.title}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Body đồng bộ divide màu border và hover effect */}
                <tbody className="text-body-2 divide-y divide-other-outlined-border border-b border-other-outlined-border">
                  {permissions.map((row) => (
                    <tr
                      key={row.key}
                      className="transition-colors hover:bg-action-hover"
                    >
                      {/* Cột tên quyền - font-medium tương tự DynamicTable */}
                      <td className="px-6 py-2">{row.name}</td>

                      {/* Các cột checkbox */}
                      {permissionCols.map((col) => (
                        <td key={col.key} className="px-6 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={row.actions[col.key]}
                            onChange={() =>
                              handleCheckboxChange(row.key, col.key)
                            }
                            className="h-4.5 w-4.5 cursor-pointer rounded border-other-input-border accent-primary-main transition-all"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-5 py-2">
          <Button variant="outline" onClick={onCancel}>
            Quay lại
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Lưu
          </Button>
        </div>
      </form>
    </Overlay>
  );
};
