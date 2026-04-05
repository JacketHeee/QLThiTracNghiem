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
  useCopyCauHoiToPrivate,
  useCreateCauHoi,
  useDeleteCauHoi,
  useQuestionsOfUser,
  useQuestionsPublic,
  useUpdateCauHoi,
  useUpdateCauHoiStatus,
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
  const { copyCauHoi } = useCopyCauHoiToPrivate(); //thêm isCopying để loading
  const { publicQuestionAsync, archiveQuestionAsync, restoreQuestionAsync } =
    useUpdateCauHoiStatus();

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
  // const { questions } = useQuestions();
  // const { questionsprivate } = useQuestionsPrivate(user?.id);
  const { questionspublic } = useQuestionsPublic(); // tất cả câu hỏi public
  const { personalQuestions } = useQuestionsOfUser(user?.id); // tất cả câu hỏi của user (3 status public, private, archive)

  // const [displayQuestions, setDisplayQuestions] = useState<Question[]>(questionspublic);

  //tách theo tab riêng
  const displayQuestions = useMemo(() => {
    if (selectedTab === "public") return questionspublic;
    if (selectedTab === "private")
      return personalQuestions.filter((item) => item.status !== "archive");
    return personalQuestions.filter((item) => item.status === "archive"); // archive
  }, [questionspublic, personalQuestions, selectedTab]);

  // Thay thế đoạn khai báo allQuestions và useMemo cũ
  const filteredQuestions = useMemo(() => {
    return displayQuestions.filter((q: Question) => {
      const matchSearch = q.noiDungCauHoi
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchDifficulty = filterDifficulty
        ? q.do_kho === filterDifficulty
        : true;

      return matchSearch && matchDifficulty;
    });
    //sửa lại chỉ lấy thay đổi display
  }, [displayQuestions, searchQuery, filterDifficulty]);

  const handleTabSelect = (status: QuestionStatus) => {
    setSelectedTab(status);
  };

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
      case "public-question":
        publicQuestion(data.id);
        break;
      case "archive-question":
        archiveQuestion(data.id);
        break;
      case "restore-question":
        restoreQuestion(data.id);
        break;

      default:
        break;
    }
  };

  const { openConfirm } = useConfirmStore();

  const deleteQ = (id: number) => {
    openConfirm({
      title: t("questionPage.deleteConfirm.title"),
      message: t("questionPage.deleteConfirm.message"),
      type: "danger",
      confirmLabel: t("questionPage.deleteConfirm.confirm"),
      cancelLabel: t("questionPage.deleteConfirm.cancel"),
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

  const addToBank = async (id: number) => {
    console.log("add to bank cau hoi id ", id);
    if (!user) {
      console.log("Tạo không thành công, lỗi chưa fetch user");
      return;
    }

    startLoading();
    try {
      await copyCauHoi({
        id: id,
        data: { nguoiTaoId: user.id },
      });
      showToast(t("questionPage.toast.addToBank"), "success");
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

  const publicQuestion = async (cauHoiId: number) => {
    startLoading();
    try {
      await publicQuestionAsync(cauHoiId);
      showToast(t("message.success.update"), "success");
    } catch (error) {
      console.log(error);
      showToast(t("message.error.update"), "error");
    } finally {
      stopLoading();
    }
  };

  const archiveQuestion = async (cauHoiId: number) => {
    startLoading();
    try {
      await archiveQuestionAsync(cauHoiId);
      showToast(t("message.success.update"), "success");
    } catch (error) {
      console.log(error);
      showToast(t("message.error.update"), "error");
    } finally {
      stopLoading();
    }
  };

  const restoreQuestion = async (cauHoiId: number) => {
    startLoading();
    try {
      await restoreQuestionAsync(cauHoiId);
      showToast(t("message.success.update"), "success");
    } catch (error) {
      console.log(error);
      showToast(t("message.error.update"), "error");
    } finally {
      stopLoading();
    }
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
      alert(t("questionPage.validation.questionRequired"));
      return false;
    }

    if (!request.monHocId) {
      alert(t("questionPage.validation.subjectRequired"));
      return false;
    }

    if (!request.chuongId) {
      alert(t("questionPage.validation.chapterRequired"));
      return false;
    }

    if (!request.doKhoId) {
      alert(t("questionPage.validation.difficultyRequired"));
      return false;
    }

    return true;
  };

  const validateCauHoiUpdate = (request: CauHoiUpdate): boolean => {
    if (!request.noiDungCauHoi || request.noiDungCauHoi.trim() === "") {
      alert(t("questionPage.validation.questionRequired"));
      return false;
    }
    //
    if (!request.monHocId) {
      alert(t("questionPage.validation.subjectRequired"));
      return false;
    }
    if (!request.chuongId) {
      alert(t("questionPage.validation.chapterRequired"));
      return false;
    }

    if (!request.doKhoId) {
      alert(t("questionPage.validation.difficultyRequired"));
      return false;
    }

    return true;
  };

  return (
    <MainContentLayout>
      {/* Xử lý loading ở đây nhen */}
      {isCreating && isUpdating && isDeleting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
          {t("tableActions.loading")}
        </div>
      )}
      <div className="flex flex-col gap-3 rounded-md bg-background-body-background">
        <div className="border-b-1 flex items-center justify-between border-other-outlined-border pr-3">
          <Tabs
            value={selectedTab}
            onChange={(val) => handleTabSelect(val as QuestionStatus)}
            tabs={[
              { value: "public", label: t("questionPage.tabs.public") },
              { value: "private", label: t("questionPage.tabs.private") },
              { value: "archive", label: t("questionPage.tabs.archive") },
            ]}
          />
          {selectedTab === "private" && actions.includes("create") && (
            <Button
              onClick={() => openInsertModal()}
              variant="contained"
              color="primary"
            >
              {t("questionPage.actions.addQuestion")} <Icon name="arrowDown" />
            </Button>
          )}
        </div>

        <div className="flex gap-5 px-3">
          <SelectField
            label={t("questionPage.filters.subject.label")}
            placeholder={t("questionPage.filters.subject.placeholder")}
            options={subjects.map((item) => ({
              label: item.tenMonHoc,
              value: item.id,
            }))}
            onSelect={() => {}}
          />
          <SelectField
            label={t("questionPage.filters.chapter.label")}
            placeholder={t("questionPage.filters.chapter.placeholder")}
            options={[
              { label: "Nhận biết", value: "Nhận biết" },
              { label: "Thông hiểu", value: "Thông hiểu" },
              { label: "Vận dụng", value: "Vận dụng" },
              { label: "Vận dụng cao", value: "Vận dụng cao" },
            ]}
            onSelect={() => {}}
          />
          <SelectField
            label={t("questionPage.filters.difficulty.label")}
            placeholder={t("questionPage.filters.difficulty.placeholder")}
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
            placeholder={t("questionPage.search.placeholder", {
              count: filteredQuestions.length,
            })}
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
              onPublicQuestion={(cauHoi) =>
                handleAction("public-question", cauHoi)
              }
              onArchiveQuestion={(cauHoi) =>
                handleAction("archive-question", cauHoi)
              }
              onRestoreQuestion={(cauHoi) =>
                handleAction("restore-question", cauHoi)
              }
              tab={selectedTab} //cho hiển thị hành động ứng với mỗi tab với quyền cao nhất
              actions={actions}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-other-outlined-border bg-background-body-background py-20">
            <span className="italic text-text-secondary">
              {t("questionPage.empty")}
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
