import { Button, Icon, Input } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import { DifficultyLevelForm } from "@/components/atomic/organisms/DifficultyLevelForm/DifficultyLevelForm";
import DynamicTable, {
  type TableColumn,
} from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import { useDoKho } from "@/hooks/useDoKho";
import { useAuthStore } from "@/stores/auth.store";
import { useToastStore } from "@/stores/useToast.store";
import type { DoKho, ErrorResponse, RoleDetailItem } from "@/types";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function DifficultyLevelPage() {
  const { doKhos, isLoading } = useDoKho();
  const { t } = useTranslation();
  const { createDoKho, updateDoKho, deleteDoKho, isProcessing } = useDoKho();

  const pageName = "do_kho";

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

  const defaultModalState = {
    open: false,
    mode: "none",
    id: undefined,
    selectedItem: null,
  } as const;

  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: "create" | "update" | "none";
    id: number | undefined;
    selectedItem: DoKho | null;
  }>(defaultModalState);

  const closeModal = () => {
    setModalState(defaultModalState);
  };

  const openInsertModal = () => {
    setModalState({
      open: true,
      mode: "create",
      id: undefined,
      selectedItem: null,
    });
  };

  const handleAction = (action: "detail" | "edit" | "remove", doKho: DoKho) => {
    if (action === "edit") {
      setModalState({
        open: true,
        mode: "update",
        id: doKho.id,
        selectedItem: doKho,
      });
    } else if (action === "remove") {
      deleteDK(doKho.id);
    }
  };

  const columns: TableColumn<DoKho>[] = [
    { title: "Mã độ khó", key: "id" },
    {
      title: "Tên độ khó",
      key: "tenDoKho",
    },
  ];

  const showToast = useToastStore((s) => s.showToast);

  const insert = async (data: DoKho) => {
    if (!validate(data)) return;
    try {
      await createDoKho(data);
      showToast(t("message.success.create"), "success");
      closeModal();
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.status === 422) {
        //lỗi validate backend
        const errors = err.response?.data?.errors;

        const firstError = Object.values(errors)?.[0];

        if (Array.isArray(firstError)) {
          showToast(firstError[0], "error");
        }
      } else {
        showToast(t("message.error.create"), "error");
      }
    }
  };

  const updateDK = async (id: number, data: DoKho) => {
    if (!validate(data)) {
      return;
    }
    try {
      await updateDoKho({ id, data });
      showToast(t("message.success.update"), "success");
      closeModal();
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.status === 422) {
        //lỗi validate backend
        const errors = err.response.data.errors;

        const firstError = Object.values(errors)?.[0];

        if (Array.isArray(firstError)) {
          showToast(firstError[0], "error");
        }
      } else {
        showToast(t("message.error.update"), "error");
      }
    }
  };

  const deleteDK = async (data: number) => {
    //catch lỗi sau
    const isConfirm = window.confirm("Bạn có chắc muốn xóa không?");
    if (!isConfirm) return;
    try {
      await deleteDoKho(data);
      showToast(t("message.success.delete"), "success");
      closeModal();
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.status === 422) {
        //lỗi validate backend
        const errors = err.response.data.errors;

        const firstError = Object.values(errors)?.[0];

        if (Array.isArray(firstError)) {
          showToast(firstError[0], "error");
        }
      } else {
        showToast(t("message.error.delete"), "error");
      }
    }
  };

  const validate = (request: DoKho): boolean => {
    if (!request.tenDoKho || request.tenDoKho.trim() === "") {
      alert("Tên độ khó không được để trống");
      return false;
    }
    return true;
  };

  return (
    <MainContentLayout>
      {/* Xử lý loading ở đây nhen */}
      {isProcessing && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
          Loading...
        </div>
      )}
      {/* Toolbar */}
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
                Tạo độ khó mới
              </Button>
            )}

            {modalState.open && (
              <DifficultyLevelForm
                onSaveCreate={(data) => insert(data)}
                onSaveUpdate={(id, data) => updateDK(id, data)}
                initialData={modalState.selectedItem}
                onCancel={() => closeModal()}
                mode={modalState.mode}
                id={modalState.id ?? null}
              />
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-2 rounded-md bg-background-body-background px-2 py-2">
        <DynamicTable
          columns={columns}
          data={doKhos}
          rowKey="id"
          hasColumnActions
          onAction={(action, doKho) => handleAction(action, doKho)}
          hasView={false}
          isLoading={isLoading}
          checkActions={actions}
        />
      </div>
    </MainContentLayout>
  );
}
