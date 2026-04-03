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

export const QuestionPage = () => {
  const [selectedTab, setSelectedTab] = useState<QuestionStatus>("public");
  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filterDifficulty] = useState<DoKho>();
  const { user } = useAuthStore();
  const { createCauHoi, isCreating } = useCreateCauHoi();
  const { updateCauHoi, isUpdating } = useUpdateCauHoi();
  const { deleteCauHoi, isDeleting } = useDeleteCauHoi();
  const { t } = useTranslation();

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

  const allQuestions = [...questions, ...(questionsprivate || [])];

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q: Question) => {
      // 1. Lọc theo Tab (Trạng thái)
      const matchTab = q.status === selectedTab;

      // 2. Lọc theo nội dung Search (Không phân biệt hoa thường)
      const matchSearch = q.noiDungCauHoi
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // 3. Lọc theo Độ khó (nếu có chọn)
      const matchDifficulty = filterDifficulty
        ? q.do_kho === filterDifficulty
        : true;

      return matchTab && matchSearch && matchDifficulty;
    });
  }, [allQuestions, selectedTab, searchQuery, filterDifficulty]);

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

  const deleteQ = async (id: number) => {
    const isConfirm = window.confirm("Bạn có chắc muốn xóa không?");
    if (!isConfirm) return;
    try {
      await deleteCauHoi(id);
      alert(t("message.success.delete"));
      closeModal();
    } catch {
      alert(t("message.error.delete"));
    }
  };

  const addToBank = (id: number) => {
    console.log("add cau hoi id ", id);
  };

  const insertQ = async (data: CauHoiCreate) => {
    console.log("create", data);
    if (!validateCauHoiCreate(data)) return;
    try {
      await createCauHoi(data);
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

  const updateQ = async (id: number, data: CauHoiUpdate) => {
    if (!validateCauHoiUpdate(data)) {
      return;
    }
    try {
      await updateCauHoi({ id, data });
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
          <Button
            onClick={() => openInsertModal()}
            variant="contained"
            color="primary"
          >
            Thêm câu hỏi <Icon name="arrowDown" />
          </Button>
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
            onSelect={(val) => {
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
