import { Button, Icon, Input } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import type { TableColumn } from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import DynamicTable from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import { PermissionForm } from "@/components/atomic/organisms/PermissionForm/PermissionForm";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import {
  useCreateRole,
  useDeleteRole,
  useRole,
  useUpdateRole,
} from "@/hooks/useRole";
import { useAuthStore } from "@/stores/auth.store";
import type {
  ErrorResponse,
  Role,
  RoleCreate,
  RoleDetailItem,
  RoleUpdate,
} from "@/types";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";

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

const pageName = "nhom_quyen";

export const PermissionGroupPage = () => {
  const { t } = useTranslation();

  const { role } = useAuthStore();
  const roleDetails = !role ? [] : role.role_details;
  const actions = roleDetails
    .filter((item: RoleDetailItem) => item.tenChucNang === pageName)
    .flatMap((item) => {
      const result: string[] = [];

      if (item.canView) result.push("view");
      if (item.canCreate) result.push("create");
      if (item.canUpdate) result.push("update");
      if (item.canDelete) result.push("delete");

      return result;
    });
  //m
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

  const { createRoleAsync, isCreating } = useCreateRole();
  const { updateRoleAsync, isUpdating } = useUpdateRole();

  const { deleteRoleAsync, isDeleting } = useDeleteRole();

  const handleAction = (action: "detail" | "edit" | "remove", item: Role) => {
    // console.log(`Đang thực hiện ${action} cho nhóm: ${item.tenNhomQuyen}`);

    switch (action) {
      case "detail":
        detailRole(item.id);
        break;

      case "edit":
        openUpdateModal(item.id);
        break;

      case "remove":
        deleteRole(item);
        break;

      default:
        break;
    }
  };

  const closeModal = () => {
    setModalState(defaultModalState);
  };

  const openInsertModal = () => {
    setModalState({
      open: true,
      mode: "create",
      id: undefined,
    });
  };

  const openUpdateModal = (id: number) => {
    setModalState({
      open: true,
      mode: "update",
      id: id,
    });
  };

  const insertRole = async (data: RoleCreate) => {
    if (!validateCreate(data)) return;
    try {
      await createRoleAsync(data);
      alert(t("message.success.create"));
      closeModal();
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.status === 422) {
        //lỗi validate backend
        const errors = err.response?.data?.errors;

        const firstError = Object.values(errors)?.[0];

        if (Array.isArray(firstError)) {
          alert(firstError[0]);
        }
      } else {
        alert(t("message.error.create"));
      }
    }
  };

  const updateRole = async (id: number, data: RoleUpdate) => {
    if (!validateUpdate(data)) {
      return;
    }
    try {
      await updateRoleAsync({ id, data });
      alert(t("message.success.update"));
      closeModal();
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.status === 422) {
        //lỗi validate backend
        const errors = err.response.data.errors;

        const firstError = Object.values(errors)?.[0];

        if (Array.isArray(firstError)) {
          alert(firstError[0]);
        }
      } else {
        alert(t("message.error.update"));
      }
    }
  };

  const deleteRole = async (data: Role) => {
    console.log("xóa ", data.tenNhomQuyen);
    const isConfirm = window.confirm("Bạn có chắc muốn xóa vai trò này không?");
    if (!isConfirm) return;
    try {
      await deleteRoleAsync(data.id);
      alert(t("message.success.delete"));
      closeModal();
    } catch {
      alert(t("message.error.delete"));
    }
  };

  const detailRole = (id: number) => {
    setModalState({
      open: true,
      mode: "view",
      id: id,
    });
  };

  const validateCreate = (request: RoleCreate): boolean => {
    if (request.role_details.length === 0) {
      alert(t("message.validation.role.empty"));
      return false;
    }
    return true;
  };

  const validateUpdate = (request: RoleUpdate): boolean => {
    if (request.role_details?.length === 0) {
      alert(t("message.validation.role.empty"));
      return false;
    }
    return true;
  };

  return (
    <MainContentLayout>
      {/* Xử lý loading ở đây nhen */}
      {isCreating && isUpdating && isDeleting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
          Loading...
        </div>
      )}
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
            {actions.includes("create") && (
              <Button
                variant={"contained"}
                color={"primary"}
                onClick={openInsertModal}
              >
                <Icon name="plus" size={20} />
                Tạo nhóm quyền mới
              </Button>
            )}
            {modalState.open && (
              <PermissionForm
                key={modalState.id}
                mode={modalState.mode}
                id={modalState.id}
                onSaveCreate={insertRole}
                onSaveUpdate={updateRole}
                onCancel={closeModal}
                //className="w-[900px] h-[80vh] rounded-xl" // Tuỳ chỉnh kích thước modal ở đây
              ></PermissionForm>
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
          checkActions={actions}
        />
      </div>
    </MainContentLayout>
  );
};
