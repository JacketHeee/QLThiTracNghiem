import { Button, Icon, Input } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import Pagination from "@/components/atomic/molecules/Panigation/Panigation";
import type { TableColumn } from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import DynamicTable from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import { PermissionForm } from "@/components/atomic/organisms/PermissionForm/PermissionForm";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import { useRole } from "@/hooks/useRole";
import type { PermissionFormData, Role } from "@/types";
import { useState } from "react";

const totalPages = 5;

const columns: TableColumn<Role>[] = [
  {
    title: "Mã nhóm",
    key: "id",
  },
  {
    title: "Tên nhóm quyền",
    key: "tenNhomQuyen",
    render: (value) => (
      <span className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${
            value === "admin"
              ? "bg-alert-error-content"
              : value === "teacher"
                ? "bg-alert-success-content"
                : "bg-alert-info-content"
          }`}
        />
        {value}
      </span>
    ),
  },
  {
    title: "Số lượng người dùng",
    key: "total_users",
    className: "text-center",
    render: (value) => (
      <span className="text- text-helper-text rounded-md bg-action-focus px-2.5 py-1">
        {value?.toLocaleString() || 0} thành viên
      </span>
    ),
  },
];

export const PermissionGroupPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultModalState = {
    open: false,
    mode: "none",
    id: undefined,
  } as const;

  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: "create" | "view" | "update" | "none";
    id: number | undefined;
  }>(defaultModalState);

  const { roles } = useRole();

  const handleAction = (action: "detail" | "edit" | "remove", item: Role) => {
    // console.log(`Đang thực hiện ${action} cho nhóm: ${item.tenNhomQuyen}`);

    switch (action) {
      case "detail":
        detailRole(item.id);
        break;

      case "edit":
        break;

      case "remove":
        alert(`Xác nhận xóa nhóm: ${item.tenNhomQuyen}`);
        break;

      default:
        break;
    }
  };

  const handleSaveGroup = (data: PermissionFormData) => {
    console.log("Dữ liệu cần gửi lên API:", data);
    // Gọi API lưu nhóm quyền ở đây...
    closeModal();
  };

  const closeModal = () => {
    setModalState(defaultModalState);
  };

  const insert = () => {
    setModalState({
      open: true,
      mode: "create",
      id: undefined,
    });
  };

  const detailRole = (id: number) => {
    setModalState({
      open: true,
      mode: "view",
      id: id,
    });
  };

  return (
    <MainContentLayout>
      <div className="flex flex-col gap-10 rounded-md bg-background-body-background px-2 py-2">
        <div className="flex justify-between">
          {/* Left: Filter & Search */}
          <div className="flex gap-2">
            <SelectField
              placeholder="Chọn tiêu chí"
              defaultIndex={0}
              options={[
                { label: "Theo tên", value: 1 },
                { label: "Theo ID", value: 2 },
              ]}
              onSelect={() => {}}
            />
            <Input
              hasBoder={true}
              placeholder="Tìm kiếm"
              icon={<Icon name="search" className="text-text-disabled" />}
            />
          </div>

          {/* Right: Actions */}
          <div className="flex gap-2">
            <Button variant={"contained"} color={"primary"} onClick={insert}>
              <Icon name="plus" size={20} />
              Tạo nhóm quyền mới
            </Button>
            {modalState.open && (
              <PermissionForm
                mode={modalState.mode}
                id={modalState.id}
                onSave={handleSaveGroup}
                onCancel={closeModal}
                //className="w-[900px] h-[80vh] rounded-xl" // Tuỳ chỉnh kích thước modal ở đây
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-md bg-background-body-background px-2 py-2">
        <DynamicTable
          columns={columns}
          data={roles}
          rowKey="id" // <--- Chỉ định key định danh ở đây
          hasColumnActions={true}
          onAction={handleAction}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </MainContentLayout>
  );
};
