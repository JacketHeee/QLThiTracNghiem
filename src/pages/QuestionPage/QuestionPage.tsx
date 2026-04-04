import { useMemo, useState } from "react";
import { Button, Icon, Input } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import Tabs from "@/components/atomic/molecules/Tabs/Tabs";
import AddQuestionForm from "@/components/atomic/organisms/AddQuestionForm/AddQuestionForm";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import QuestionItem from "@/components/atomic/molecules/QuestionItem/QuestionItem";
import { useDoKho } from "@/hooks/useDoKho";
import type {
  CauHoiCreate,
  CauHoiUpdate,
  DoKho,
  ErrorResponse,
  Question,
  QuestionStatus,
  RoleDetailItem,
} from "@/types";
import { useSubject } from "@/hooks/useSubject";
import {
  useCreateCauHoi,
  useDeleteCauHoi,
  useQuestions,
  useQuestionsPrivate,
  useUpdateCauHoi,
} from "@/hooks/useQuestion";
import { useAuthStore } from "@/stores/auth.store";
import { useTranslation } from "react-i18next";
import type { AxiosError } from "axios";
import { useToastStore } from "@/stores/useToast.store";
import { useLoadingStore } from "@/stores/useLoading.store";
import { useConfirmStore } from "@/stores/useConfirm.store";

export const QuestionPage = () => {
  const [selectedTab, setSelectedTab] = useState<QuestionStatus>("public");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty] = useState<DoKho>();
  const { user } = useAuthStore();
  const { createCauHoi, isCreating } = useCreateCauHoi();
  const { updateCauHoi, isUpdating } = useUpdateCauHoi();
  const { deleteCauHoi, isDeleting } = useDeleteCauHoi();
  const { t } = useTranslation();
  const { startLoading, stopLoading } = useLoadingStore();

  const pageName = "cau_hoi";

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
    selectedItem: Question | null;
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

  const openUpdateModal = (id: number, data: Question) => {
    setModalState({
      open: true,
      mode: "update",
      id: id,
      selectedItem: data,
    });
  };

  const { doKhos } = useDoKho();
  const { subjects } = useSubject();
  const { questions } = useQuestions();
  const { questionsprivate } = useQuestionsPrivate(user?.id);

  // Thay thế đoạn khai báo allQuestions và useMemo cũ
  const filteredQuestions = useMemo(() => {
    // Gộp mảng ngay bên trong callback của useMemo
    const combined = [...questions, ...(questionsprivate || [])];

    return combined.filter((q: Question) => {
      const matchTab = q.status === selectedTab;
      const matchSearch = q.noiDungCauHoi
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchDifficulty = filterDifficulty
        ? q.do_kho === filterDifficulty
        : true;

      return matchTab && matchSearch && matchDifficulty;
    });
    // Dependency bây giờ là các mảng gốc từ hooks
  }, [questions, questionsprivate, selectedTab, searchQuery, filterDifficulty]);

  const handleAction = (type: string, data: Question) => {
    switch (type) {
      case "edit":
        openUpdateModal(data.id, data);
        break;
      case "delete":
        deleteQ(data.id);
        break;
      case "add-to-bank":
        addToBank(data.id);
        break;

      default:
        break;
    }
  };

  const { openConfirm } = useConfirmStore();

  const deleteQ = (id: number) => {
    openConfirm({
      title: "Xác nhận xóa câu hỏi",
      message:
        "Bạn có chắc chắn muốn xóa câu hỏi này không? Hành động này không thể hoàn tác.",
      type: "danger",
      confirmLabel: "Xóa ngay",
      cancelLabel: "Hủy bỏ",
      onConfirm: async () => {
        startLoading();
        try {
          await deleteCauHoi(id);
          showToast(t("message.success.delete"), "success");
          if (typeof closeModal === "function") {
            closeModal();
          }
        } catch (error: unknown) {
          console.error("Delete question error:", error);
          showToast(t("message.error.delete"), "error");
          throw error;
        } finally {
          stopLoading();
        }
      },
    });
  };

  const addToBank = (id: number) => {
    console.log("add cau hoi id ", id);
  };

  const showToast = useToastStore((s) => s.showToast);

  const insertQ = async (data: CauHoiCreate) => {
    console.log("create", data);
    if (!validateCauHoiCreate(data)) return;

    startLoading();
    try {
      await createCauHoi(data);
      closeModal();
      showToast(t("message.success.create"), "success");
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
    } finally {
      stopLoading();
    }
  };

  const updateQ = async (id: number, data: CauHoiUpdate) => {
    if (!validateCauHoiUpdate(data)) {
      return;
    }

    startLoading();
    try {
      await updateCauHoi({ id, data });
      closeModal();
      showToast(t("message.success.update"), "success");
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
    } finally {
      stopLoading();
    }
  };

  const validateCauHoiCreate = (request: CauHoiCreate): boolean => {
    if (!request.noiDungCauHoi || request.noiDungCauHoi.trim() === "") {
      alert("Nội dung câu hỏi không được để trống");
      return false;
    }

    if (!request.monHocId) {
      alert("Vui lòng chọn môn học");
      return false;
    }

    if (!request.chuongId) {
      alert("Vui lòng chọn chương");
      return false;
    }

    if (!request.doKhoId) {
      alert("Vui lòng chọn độ khó");
      return false;
    }

    return true;
  };

  const validateCauHoiUpdate = (request: CauHoiUpdate): boolean => {
    if (!request.noiDungCauHoi || request.noiDungCauHoi.trim() === "") {
      alert("Nội dung câu hỏi không được để trống");
      return false;
    }

    if (!request.monHocId) {
      alert("Vui lòng chọn môn học");
      return false;
    }
    if (!request.chuongId) {
      alert("Vui lòng chọn chương");
      return false;
    }

    if (!request.doKhoId) {
      alert("Vui lòng chọn độ khó");
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
      <div className="flex flex-col gap-3 rounded-md bg-background-body-background">
        <div className="border-b-1 flex items-center justify-between border-other-outlined-border pr-3">
          <Tabs
            value={selectedTab}
            onChange={(val) => setSelectedTab(val as QuestionStatus)}
            tabs={[
              { value: "public", label: "Công khai" },
              { value: "private", label: "Cá nhân" },
              { value: "archive", label: "Lưu trữ" },
            ]}
          />
          {actions.includes("create") && (
            <Button
              onClick={() => openInsertModal()}
              variant="contained"
              color="primary"
            >
              Thêm câu hỏi <Icon name="arrowDown" />
            </Button>
          )}
        </div>

        <div className="flex gap-5 px-3">
          <SelectField
            label="Môn học"
            placeholder="Chọn môn học"
            options={subjects.map((item) => ({
              label: item.tenMonHoc,
              value: item.id,
            }))}
            onSelect={() => {}}
          />
          <SelectField
            label="Chương"
            placeholder="Chọn chương"
            options={[
              { label: "Nhận biết", value: "Nhận biết" },
              { label: "Thông hiểu", value: "Thông hiểu" },
              { label: "Vận dụng", value: "Vận dụng" },
              { label: "Vận dụng cao", value: "Vận dụng cao" },
            ]}
            onSelect={() => {}}
          />
          <SelectField
            label="Độ khó"
            placeholder="Chọn độ khó"
            options={doKhos.map((item) => ({
              label: item.tenDoKho,
              value: item.id,
            }))}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onSelect={(_val) => {
              // setFilterDifficulty();
            }}
          />
        </div>
        <div className="flex gap-5 px-3 pb-3">
          <Input
            className="flex-1"
            placeholder={`Tìm kiếm trong ${filteredQuestions.length} câu hỏi...`}
            hasBoder={true}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Icon name="search" className="text-text-secondary" />}
          />
          <Button
            variant="outline"
            className="shrink-0"
            onClick={() => {
              setSearchQuery("");
              // setFilterDifficulty("");
            }}
          >
            <Icon name="arrowUpDown" />
          </Button>
        </div>
      </div>

      {/* List Section */}
      <section className="mt-4 flex flex-col gap-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => (
            <QuestionItem
              key={q.id}
              data={q}
              onEdit={(cauHoi) => handleAction("edit", cauHoi)}
              onDelete={(cauHoi) => handleAction("delete", cauHoi)}
              onAddToBank={(cauHoi) => handleAction("add-to-bank", cauHoi)}
              actions={actions}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-other-outlined-border bg-background-body-background py-20">
            <span className="italic text-text-secondary">
              Không tìm thấy câu hỏi nào phù hợp
            </span>
          </div>
        )}
      </section>

      {modalState.open && (
        <AddQuestionForm
          // isOpen={modalState.open} //0 ngắt mount
          onClose={() => closeModal()}
          selectedItem={modalState.selectedItem}
          onSaveCreate={(data) => {
            insertQ(data);
          }}
          onSaveUpdate={(id, data) => {
            updateQ(id, data);
          }}
          mode={modalState.mode}
        />
      )}
    </MainContentLayout>
  );
};
