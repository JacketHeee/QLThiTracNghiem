import { useState } from "react";
import { Overlay } from "../../molecules/Overlay/Overlay";
import Tabs from "../../molecules/Tabs/Tabs";
import SelectField from "../../atoms/Select/SelectField";
import { RichTextEditor } from "../../molecules/RichTextEditor/RichTextEditor";
import { RadioButton } from "../../atoms/RadioButton/RadioButton";
import { Button } from "../../atoms";
import { Checkbox } from "../../atoms/Checkbox/Checkbox";
import type { Answer, CauHoiCreate, CauHoiUpdate, Question } from "@/types";
import { useAuthStore } from "@/stores/auth.store";
import { useSubject } from "@/hooks/useSubject";
import { useTranslation } from "react-i18next";
import { stripParagraphTags } from "@/utils";

// interface Answer {
//   id: string;
//   text: string;
//   isCorrect: boolean;
// }

interface AddQuestionFormProps {
  // isOpen: boolean;
  onClose: () => void;
  onSaveCreate: (data: CauHoiCreate) => void;
  onSaveUpdate: (id: number, data: CauHoiUpdate) => void;
  selectedItem: Question | null;
  mode: "create" | "view" | "update" | "none";
}

export default function AddQuestionForm({
  // isOpen,
  onClose,
  onSaveCreate,
  onSaveUpdate,
  selectedItem,
  mode,
}: AddQuestionFormProps) {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState("handmade");

  // --- State cho Câu hỏi ---
  // const [questionContent, setQuestionContent] = useState("");
  // const [subjectId, setSubjectId] = useState<number | null>(null);
  // const [chapterId, setChapterId] = useState<number | null>(null);
  // const [difficultyId, setDifficultyId] = useState<number | null>(null);
  // const [isPublic, setIsPublic] = useState(true);

  // --- State cho Danh sách đáp án ---
  // const [answers, setAnswers] = useState<Answer[]>([]);

  // --- State cho Ô nhập đáp án mới (Tách biệt với questionContent) ---
  const [currentAnswerText, setCurrentAnswerText] = useState("");
  const [currentIsCorrect, setCurrentIsCorrect] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);

  const { user } = useAuthStore();

  const defaultFormData: Question = {
    id: 0,
    noiDungCauHoi: "",
    imageUrl: "",
    giaiThichDapAn: "",
    diemMacDinh: "",
    soLuotSuDung: 0,
    status: "public",
    isDeleted: false,

    doKhoId: 0,
    monHocId: 0,
    chuongId: 0,
    nguoiTaoId: user?.id || 0,

    de_this_count: 0,

    mon_hoc: null,
    chuong: null,
    do_kho: null,
    nguoi_tao: user,
    cau_tra_lois: [],

    created_at: null,
    updated_at: null,
  };
  const selectedQuestion: Question = selectedItem ?? defaultFormData;

  const { subjectsWithChuong } = useSubject();
  const subjectOptions = subjectsWithChuong.map((item) => ({
    label: item.tenMonHoc,
    value: item.id,
  }));

  const [formData, setFormData] = useState<Question>(selectedQuestion);

  const setFormDataProp = <K extends keyof Question>(
    field: K,
    value: Question[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isCreate = mode === "create";
  const isUpdate = mode === "update";

  const selectedChuongs = subjectsWithChuong.find(
    (item) => item.id === selectedQuestion.monHocId
  )?.chuongs;
  const defaultOptionChuong = selectedChuongs
    ? selectedChuongs?.map((item) => ({
        label: item.tenChuong,
        value: item.id,
      }))
    : [];

  const [chuongOptions, setChuongOptions] =
    useState<{ label: string; value: number }[]>(defaultOptionChuong);

  // if (!isOpen) return null;

  // Xử lý thêm hoặc cập nhật đáp án vào danh sách
  const handleSaveAnswer = () => {
    if (!currentAnswerText.trim() || currentAnswerText === "<p></p>") return;

    if (editingAnswerId) {
      // Chế độ chỉnh sửa
      const newList: Answer[] = formData.cau_tra_lois.map((ans) => {
        if (ans.id === Number(editingAnswerId)) {
          console.log(`2id  ${editingAnswerId} ${ans.id}`);
          return {
            ...ans,
            noiDungLuaChon: currentAnswerText,
            isCorrectAnswer: currentIsCorrect,
          };
        } else if (currentIsCorrect) {
          return { ...ans, isCorrectAnswer: false };
        } else {
          return ans;
        }
      });

      setFormDataProp("cau_tra_lois", newList);
      setEditingAnswerId(null);
    } else {
      // Chế độ thêm mới
      const newAnswer: Answer = {
        id: Number(Date.now().toString()),
        noiDungLuaChon: currentAnswerText,
        isCorrectAnswer: currentIsCorrect,
        cauHoiId: null,
      };

      // Xử lý trước khi set state
      const updatedList = currentIsCorrect
        ? formData.cau_tra_lois.map((a) => ({ ...a, isCorrectAnswer: false }))
        : formData.cau_tra_lois;

      const finalList = [...updatedList, newAnswer];

      // Set state 1 lần duy nhất
      setFormDataProp("cau_tra_lois", finalList);
    }

    // Reset ô nhập
    setCurrentAnswerText("");
    setCurrentIsCorrect(false);
  };

  const handleDeleteAnswer = (id: number) => {
    const newList = formData.cau_tra_lois.filter((ans) => ans.id !== id);
    setFormDataProp("cau_tra_lois", newList);
  };

  const handleEditAnswer = (ans: Answer) => {
    setEditingAnswerId(ans.id.toString());

    setCurrentAnswerText(ans.noiDungLuaChon);

    setCurrentIsCorrect(ans.isCorrectAnswer);
  };

  const handleFinalSubmit = () => {
    if (isUpdate) {
      const data: CauHoiUpdate = {
        monHocId: formData.monHocId,
        chuongId: formData.chuongId ?? null,
        doKhoId: formData.doKhoId,
        nguoiTaoId: formData.nguoiTaoId,
        noiDungCauHoi: stripParagraphTags(formData.noiDungCauHoi),
        giaiThichDapAn: formData.giaiThichDapAn || "",
        diemMacDinh: Number(formData.diemMacDinh) || 0,
        status: formData.status as "public" | "private" | "archive",

        cauTraLois: formData.cau_tra_lois.map((ans) => ({
          noiDungLuaChon: stripParagraphTags(ans.noiDungLuaChon),
          isCorrectAnswer: ans.isCorrectAnswer,
          cauHoiId: ans.cauHoiId,
        })),
      };
      onSaveUpdate(formData.id, data);
    } else if (isCreate) {
      const data: CauHoiCreate = {
        monHocId: formData.monHocId,
        chuongId: formData.chuongId ?? null,
        doKhoId: formData.doKhoId,
        nguoiTaoId: formData.nguoiTaoId,
        noiDungCauHoi: stripParagraphTags(formData.noiDungCauHoi),
        giaiThichDapAn: formData.giaiThichDapAn || "",
        diemMacDinh: Number(formData.diemMacDinh) || 0,
        status: formData.status as "public" | "private" | "archive",

        cauTraLois: formData.cau_tra_lois.map((ans) => ({
          noiDungLuaChon: stripParagraphTags(ans.noiDungLuaChon),
          isCorrectAnswer: ans.isCorrectAnswer,
          cauHoiId: ans.cauHoiId,
        })),
      };
      onSaveCreate(data);
    }
  };

  const handleSelectSubject = (val: number) => {
    const subject = subjectsWithChuong.find((s) => s.id === val);
    const chuongs = subject ? subject.chuongs : [];
    const options = chuongs.map((item) => ({
      label: item.tenChuong,
      value: item.id,
    }));
    setChuongOptions(options);

    setFormDataProp("monHocId", val);
    setFormDataProp("chuongId", null);
  };

  return (
    <Overlay onClose={onClose}>
      <div className="flex w-[1000px] flex-col gap-3 rounded-lg bg-background-paper pb-2 shadow-xl">
        {/* Tabs điều hướng */}
        <Tabs
          value={selectedTab}
          onChange={setSelectedTab}
          tabs={
            isCreate
              ? [
                  {
                    value: "handmade",
                    label: t("addQuestionForm.tabs.handmade"),
                  },
                  {
                    value: "fromFile",
                    label: t("addQuestionForm.tabs.fromFile"),
                  },
                ]
              : [{ value: "handmade", label: t("addQuestionForm.tabs.edit") }]
          }
        />

        <div className="flex max-h-[80vh] flex-col overflow-auto px-5">
          {/* Bộ chọn thông tin (Chỉ chấp nhận Number) */}
          <div className="flex gap-5 py-3">
            <SelectField
              label={t("addQuestionForm.fields.subject.label")}
              value={formData.monHocId}
              placeholder={t("addQuestionForm.fields.subject.placeholder")}
              options={subjectOptions}
              onSelect={(val) => handleSelectSubject(Number(val))}
            />
            <SelectField
              label={t("addQuestionForm.fields.chapter.label")}
              placeholder={t("addQuestionForm.fields.chapter.placeholder")}
              options={chuongOptions}
              onSelect={(val) => setFormDataProp("chuongId", Number(val))}
              value={formData.chuongId || undefined}
            />
            <SelectField
              label={t("addQuestionForm.fields.difficulty.label")}
              placeholder={t("addQuestionForm.fields.difficulty.placeholder")}
              options={[
                { label: "Nhận biết", value: 1 },
                { label: "Thông hiểu", value: 2 },
                { label: "Vận dụng", value: 3 },
                { label: "Vận dụng cao", value: 4 },
              ]}
              onSelect={(val) => setFormDataProp("doKhoId", Number(val))}
              value={formData.do_kho?.id}
            />
          </div>

          {/* Editor nội dung câu hỏi */}
          <div className="flex flex-col gap-2 py-2">
            <span className="text-body-1-semibold text-text-secondary">
              {t("addQuestionForm.content.label")}
            </span>
            <RichTextEditor
              content={formData.noiDungCauHoi}
              onChange={(val) => setFormDataProp("noiDungCauHoi", val)}
            />
          </div>

          {/* Danh sách đáp án đã thêm */}
          <div className="flex flex-col gap-2 py-2">
            <span className="text-body-1-semibold text-text-secondary">
              {t("addQuestionForm.answers.title")}
            </span>
            <div className="flex flex-col rounded-md border border-other-outlined-border bg-white">
              {formData.cau_tra_lois.length === 0 ? (
                <div className="p-8 text-center text-text-disabled">
                  {t("addQuestionForm.answers.empty")}
                </div>
              ) : (
                formData.cau_tra_lois.map((ans, index) => (
                  <div
                    key={ans.id}
                    className="flex items-center gap-4 border-b border-other-outlined-border p-3 last:border-none hover:bg-gray-50"
                  >
                    <strong className="text-primary-main">
                      {String.fromCharCode(65 + index)}
                    </strong>
                    <div
                      className="text-body-2 prose-sm max-w-none flex-1"
                      dangerouslySetInnerHTML={{ __html: ans.noiDungLuaChon }}
                    />
                    <div className="flex items-center gap-4">
                      {ans.isCorrectAnswer ? (
                        <span className="bg-success-main/10 rounded px-2 py-1 text-xs font-bold text-success-main">
                          {t("addQuestionForm.answers.correct")}
                        </span>
                      ) : (
                        <RadioButton
                          label={t("addQuestionForm.answers.chooseCorrect")}
                          checked={false}
                          onChange={() =>
                            handleEditAnswer({ ...ans, isCorrectAnswer: true })
                          }
                        />
                      )}
                      <div className="flex">
                        <Button
                          variant="text"
                          color="primary"
                          size="small"
                          onClick={() => handleEditAnswer(ans)}
                        >
                          {t("addQuestionForm.answers.edit")}
                        </Button>
                        <Button
                          variant="text"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteAnswer(ans.id)}
                        >
                          {t("addQuestionForm.answers.delete")}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Khung nhập đáp án mới */}
          <div className="flex flex-col gap-2 py-4">
            <span className="text-body-1-semibold text-text-secondary">
              {editingAnswerId
                ? t("addQuestionForm.answers.editing")
                : t("addQuestionForm.answers.addNew")}
            </span>
            <div className="border-primary-main/20 bg-primary-main/5 flex flex-col gap-3 rounded-md border p-4">
              <Checkbox
                label={t("addQuestionForm.answers.markCorrect")}
                checked={currentIsCorrect}
                onChange={(e) => setCurrentIsCorrect(e.target.checked)}
              />
              <RichTextEditor
                content={currentAnswerText}
                onChange={(val) => setCurrentAnswerText(val)}
              />
              <div className="flex justify-end gap-2">
                {editingAnswerId && (
                  <Button
                    variant="text"
                    color="standard"
                    onClick={() => {
                      setEditingAnswerId(null);
                      setCurrentAnswerText("");
                    }}
                  >
                    {t("addQuestionForm.answers.cancelEdit")}
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveAnswer}
                >
                  {editingAnswerId
                    ? t("addQuestionForm.answers.update")
                    : t("addQuestionForm.answers.saveNew")}
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-4 flex items-center justify-between border-t border-other-outlined-border py-4">
            <Checkbox
              label={t("addQuestionForm.footer.public")}
              checked={formData.status === "public"}
              onChange={(e) =>
                setFormDataProp(
                  "status",
                  e.target.checked ? "public" : "private"
                )
              }
            />
            <div className="flex gap-2">
              <Button variant="outline" color="standard" onClick={onClose}>
                {t("addQuestionForm.footer.back")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFinalSubmit}
                disabled={
                  !formData.noiDungCauHoi ||
                  formData.cau_tra_lois.length < 2 ||
                  !formData.monHocId
                }
              >
                {t("addQuestionForm.footer.saveAll")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Overlay>
  );
}
