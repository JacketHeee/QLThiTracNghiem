import { useState } from "react";
import { Button, Icon, Input } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import Pagination from "@/components/atomic/molecules/Panigation/Panigation";
import DynamicTable, {
  type TableColumn,
} from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import AddAssignmentForm from "@/components/atomic/organisms/AddAssignmentForm/AddAssignmentForm";
import { useAssign, useCreateAssign, useDeleteAssign } from "@/hooks/useAssign";
import type {
  Assign,
  AssignmentRequest,
  ErrorResponse,
  RoleDetailItem,
} from "@/types";
import { useTranslation } from "react-i18next";
import type { AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth.store";

export const AssignmentPage = () => {
  const { assigns } = useAssign();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { t } = useTranslation();

  const { createPhanCongAsync, isCreating } = useCreateAssign();

  const { deleteAsync, isDeleting } = useDeleteAssign();

  const pageName = "phan_cong";

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

  const columns: TableColumn<Assign>[] = [
    {
      title: "Mã môn",
      key: "monHocId",
      render: (_, item) => {
        return item.mon_hoc.maMonHoc || "---";
      },
    },
    {
      title: "Môn học",
      key: "mon_hoc",
      render: (_, item) => item.mon_hoc.tenMonHoc || "---",
    },
    {
      title: "Mã giảng viên",
      key: "giangVienId",
      render: (_, item) => item.giang_vien.username || "---",
    },
    {
      title: "Tên giảng viên",
      key: "giang_vien",
      render: (_, item) => item.giang_vien.hoTen || "---",
    },
  ];

  const handleOpenAdd = () => {
    setIsModalOpen(true);
  };

  const onSave = async (data: AssignmentRequest) => {
    if (!validateCreate(data)) return;
    try {
      await createPhanCongAsync(data);
      alert(t("message.success.create"));
      setIsModalOpen(false);
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

  const handleAction = async (_action: string, item: Assign) => {
    if (
      confirm(
        `Bạn có chắc muốn xóa phân công của giảng viên: ${item.giang_vien?.hoTen}?`
      )
    ) {
      try {
        await deleteAsync({
          giangVienId: item.giangVienId,
          monHocId: item.monHocId,
        });
        alert(t("message.success.delete"));
        setIsModalOpen(false);
      } catch {
        alert(t("message.error.delete"));
      }
    }
  };

  const validateCreate = (request: AssignmentRequest): boolean => {
    // Kiểm tra giảng viên
    if (!request.giangVienId) {
      alert("Vui lòng chọn giảng viên");
      return false;
    }
    // Kiểm tra danh sách môn học
    if (!request.monHocIds || request.monHocIds.length === 0) {
      alert("Vui lòng chọn ít nhất 1 môn học");
      return false;
    }

    return true;
  };

  return (
    <MainContentLayout>
      {/* Toolbar */}
      {/* Xử lý loading ở đây nhen */}
      {(isCreating || isDeleting) && (
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
                { label: "Theo môn học", value: 1 },
                { label: "Theo giảng viên", value: 2 },
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
                onClick={handleOpenAdd}
              >
                <Icon name="plus" size={20} />
                Tạo phân công mới
              </Button>
            )}

            {isModalOpen && (
              <AddAssignmentForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={onSave}
                phanCongs={assigns}
              />
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-2 rounded-md bg-background-body-background px-2 py-2">
        <DynamicTable
          columns={columns}
          data={assigns}
          rowKey="monHocId"
          hasColumnActions
          hasView={false}
          onAction={handleAction}
          checkActions={actions.includes("delete") ? ["delete"] : []}
        />
        <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
      </div>
    </MainContentLayout>
  );
};
