import { useState } from "react";
import { Button, Icon, Input } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
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
import { useToastStore } from "@/stores/useToast.store";
import { useLoadingStore } from "@/stores/useLoading.store";
import { useConfirmStore } from "@/stores/useConfirm.store";
import Pagination from "@/components/atomic/molecules/Pagination/Pagination";

export const AssignmentPage = () => {
  const { assigns } = useAssign();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const { createPhanCongAsync } = useCreateAssign();
  const { deleteAsync } = useDeleteAssign();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState(1); // 1 for subject, 2 for teacher
  const { startLoading, stopLoading } = useLoadingStore();

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

  const filteredAssigns = assigns.filter((assign) => {
    const searchTermLower = searchTerm.trim().toLowerCase();
    if (!searchTermLower) return true;

    const subjectName = assign.mon_hoc?.tenMonHoc?.toLowerCase() ?? "";
    const subjectCode = assign.mon_hoc?.maMonHoc?.toLowerCase() ?? "";
    const teacherName = assign.giang_vien?.hoTen?.toLowerCase() ?? "";
    const teacherCode = assign.giang_vien?.username?.toLowerCase() ?? "";

    if (filterCriteria === 1) {
      // bySubject
      return (
        subjectName.includes(searchTermLower) ||
        subjectCode.includes(searchTermLower)
      );
    }

    // byTeacher
    return (
      teacherName.includes(searchTermLower) ||
      teacherCode.includes(searchTermLower)
    );
  });

  const columns: TableColumn<Assign>[] = [
    {
      title: t("assignmentPage.table.subjectCode"),
      key: "monHocId",
      render: (_, item) => {
        return item.mon_hoc?.maMonHoc || "---";
      },
    },
    {
      title: t("assignmentPage.table.subjectName"),
      key: "mon_hoc",
      render: (_, item) => item.mon_hoc?.tenMonHoc || "---",
    },
    {
      title: t("assignmentPage.table.teacherCode"),
      key: "giangVienId",
      render: (_, item) => item.giang_vien?.username || "---",
    },
    {
      title: t("assignmentPage.table.teacherName"),
      key: "giang_vien",
      render: (_, item) => item.giang_vien?.hoTen || "---",
    },
  ];

  const handleOpenAdd = () => {
    setIsModalOpen(true);
  };

  const { showToast } = useToastStore();
  const onSave = async (data: AssignmentRequest) => {
    startLoading();
    try {
      await createPhanCongAsync(data);
      setIsModalOpen(false);
      showToast(t("message.success.create"), "success");
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.status === 422) {
        //lỗi validate backend
        const errors = err.response?.data?.errors;

        const firstError = Object.values(errors)?.[0];

        if (Array.isArray(firstError)) {
          showToast(t(firstError[0]), "error");
        }
      } else {
        showToast(t("message.error.create"), "error");
      }
    } finally {
      stopLoading();
    }
  };

  const { openConfirm } = useConfirmStore();
  const handleAction = (action: string, item: Assign) => {
    if (action === "remove") {
      openConfirm({
        title: t("assignmentPage.confirmDeleteTitle"),
        message: t("assignmentPage.confirmDelete", {
          teacherName: item.giang_vien?.hoTen,
        }),
        type: "danger",
        onConfirm: async () => {
          startLoading();
          try {
            await deleteAsync({
              giangVienId: item.giangVienId,
              monHocId: item.monHocId,
            });
            showToast(t("message.success.delete"), "success");
            if (typeof setIsModalOpen === "function") setIsModalOpen(false);
          } catch (error: unknown) {
            showToast(t("message.error.delete"), "error");
            throw error;
          } finally {
            stopLoading();
          }
        },
      });
    }
  };

  // const validateCreate = (request: AssignmentRequest): boolean => {
  //   // Kiểm tra giảng viên
  //   if (!request.giangVienId) {
  //     alert("Vui lòng chọn giảng viên");
  //     return false;
  //   }
  //   // Kiểm tra danh sách môn học
  //   if (!request.monHocIds || request.monHocIds.length === 0) {
  //     alert("Vui lòng chọn ít nhất 1 môn học");
  //     return false;
  //   }

  //   return true;
  // };

  return (
    <MainContentLayout>
      {/* Toolbar */}
      <div className="flex flex-col gap-10 rounded-md bg-background-body-background px-2 py-2">
        <div className="flex justify-between">
          {/* Left: Filter & Search */}
          <div className="flex gap-2">
            <SelectField
              placeholder={t("assignmentPage.filter.placeholder")}
              defaultIndex={0}
              options={[
                {
                  label: t("assignmentPage.filter.bySubject"),
                  value: 1,
                },
                {
                  label: t("assignmentPage.filter.byTeacher"),
                  value: 2,
                },
              ]}
              onSelect={(value) => setFilterCriteria(Number(value))}
            />
            <Input
              hasBoder={true}
              placeholder={t("header.search")}
              icon={<Icon name="search" className="text-text-disabled" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                {t("assignmentPage.addNew")}
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
          data={filteredAssigns}
          rowKey={(item) => `${item.giangVienId}-${item.monHocId}`}
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
