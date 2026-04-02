import { useState } from "react";
import { Overlay } from "../../molecules/Overlay/Overlay";
import Tabs from "../../molecules/Tabs/Tabs";
import SelectField from "../../atoms/Select/SelectField";
import { RichTextEditor } from "../../molecules/RichTextEditor/RichTextEditor";
import { RadioButton } from "../../atoms/RadioButton/RadioButton";
import { Button } from "../../atoms";
import { Checkbox } from "../../atoms/Checkbox/Checkbox";

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface AddQuestionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddQuestionForm({
  isOpen,
  onClose,
}: AddQuestionFormProps) {
  const [selectedTab, setSelectedTab] = useState("handmade");

  // --- State cho Câu hỏi ---
  const [questionContent, setQuestionContent] = useState("");
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [chapterId, setChapterId] = useState<number | null>(null);
  const [difficultyId, setDifficultyId] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState(true);

  // --- State cho Danh sách đáp án ---
  const [answers, setAnswers] = useState<Answer[]>([]);

  // --- State cho Ô nhập đáp án mới (Tách biệt với questionContent) ---
  const [currentAnswerText, setCurrentAnswerText] = useState("");
  const [currentIsCorrect, setCurrentIsCorrect] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Xử lý thêm hoặc cập nhật đáp án vào danh sách
  const handleSaveAnswer = () => {
    if (!currentAnswerText.trim() || currentAnswerText === "<p></p>") return;

    if (editingAnswerId) {
      // Chế độ chỉnh sửa
      setAnswers(
        answers.map((ans) =>
          ans.id === editingAnswerId
            ? { ...ans, text: currentAnswerText, isCorrect: currentIsCorrect }
            : currentIsCorrect
              ? { ...ans, isCorrect: false }
              : ans
        )
      );
      setEditingAnswerId(null);
    } else {
      // Chế độ thêm mới
      const newAnswer: Answer = {
        id: Date.now().toString(),
        text: currentAnswerText,
        isCorrect: currentIsCorrect,
      };
      setAnswers((prev) => {
        // Nếu đáp án mới là đúng, bỏ chọn các đáp án đúng cũ
        const updated = currentIsCorrect
          ? prev.map((a) => ({ ...a, isCorrect: false }))
          : prev;
        return [...updated, newAnswer];
      });
    }

    // Reset ô nhập
    setCurrentAnswerText("");
    setCurrentIsCorrect(false);
  };

  const handleDeleteAnswer = (id: string) => {
    setAnswers(answers.filter((ans) => ans.id !== id));
  };

  const handleEditAnswer = (ans: Answer) => {
    setEditingAnswerId(ans.id);
    setCurrentAnswerText(ans.text);
    setCurrentIsCorrect(ans.isCorrect);
  };

  const handleFinalSubmit = () => {
    const payload = {
      mon_hoc_id: subjectId,
      chuong_id: chapterId,
      do_kho_id: difficultyId,
      noi_dung: questionContent,
      cong_khai: isPublic,
      dap_an: answers.map((a) => ({
        content: a.text,
        is_correct: a.isCorrect,
      })),
    };
    console.log("Dữ liệu gửi lên Server:", payload);
    // Thực hiện call API mutation tại đây
  };

  return (
    <Overlay onClose={onClose}>
      <div className="flex w-[1000px] flex-col gap-3 rounded-lg bg-background-paper pb-2 shadow-xl">
        {/* Tabs điều hướng */}
        <Tabs
          value={selectedTab}
          onChange={setSelectedTab}
          tabs={[
            { value: "handmade", label: "Thêm thủ công" },
            { value: "fromFile", label: "Thêm từ file" },
          ]}
        />

        <div className="flex max-h-[80vh] flex-col overflow-auto px-5">
          {/* Bộ chọn thông tin (Chỉ chấp nhận Number) */}
          <div className="flex gap-5 py-3">
            <SelectField
              label="Môn học"
              placeholder="Chọn môn học"
              options={[
                { label: "Toán học", value: 1 },
                { label: "Vật lý", value: 2 },
                { label: "Hóa học", value: 3 },
              ]}
              onSelect={(val) => setSubjectId(Number(val))}
            />
            <SelectField
              label="Chương"
              placeholder="Chọn chương"
              options={[
                { label: "Chương 1: Cơ học", value: 101 },
                { label: "Chương 2: Nhiệt học", value: 102 },
              ]}
              onSelect={(val) => setChapterId(Number(val))}
            />
            <SelectField
              label="Độ khó"
              placeholder="Chọn độ khó"
              options={[
                { label: "Nhận biết", value: 1 },
                { label: "Thông hiểu", value: 2 },
                { label: "Vận dụng", value: 3 },
                { label: "Vận dụng cao", value: 4 },
              ]}
              onSelect={(val) => setDifficultyId(Number(val))}
            />
          </div>

          {/* Editor nội dung câu hỏi */}
          <div className="flex flex-col gap-2 py-2">
            <span className="text-body-1-semibold text-text-secondary">
              Nội dung câu hỏi
            </span>
            <RichTextEditor
              content={questionContent}
              onChange={(val) => setQuestionContent(val)}
            />
          </div>

          {/* Danh sách đáp án đã thêm */}
          <div className="flex flex-col gap-2 py-2">
            <span className="text-body-1-semibold text-text-secondary">
              Danh sách đáp án
            </span>
            <div className="flex flex-col rounded-md border border-other-outlined-border bg-white">
              {answers.length === 0 ? (
                <div className="p-8 text-center text-text-disabled">
                  Chưa có đáp án nào. Hãy thêm ở bên dưới.
                </div>
              ) : (
                answers.map((ans, index) => (
                  <div
                    key={ans.id}
                    className="flex items-center gap-4 border-b border-other-outlined-border p-3 last:border-none hover:bg-gray-50"
                  >
                    <strong className="text-primary-main">
                      {String.fromCharCode(65 + index)}
                    </strong>
                    <div
                      className="text-body-2 prose-sm max-w-none flex-1"
                      dangerouslySetInnerHTML={{ __html: ans.text }}
                    />
                    <div className="flex items-center gap-4">
                      {ans.isCorrect ? (
                        <span className="bg-success-main/10 rounded px-2 py-1 text-xs font-bold text-success-main">
                          ĐÚNG
                        </span>
                      ) : (
                        <RadioButton
                          label="Chọn đúng"
                          checked={false}
                          onChange={() =>
                            handleEditAnswer({ ...ans, isCorrect: true })
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
                          Sửa
                        </Button>
                        <Button
                          variant="text"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteAnswer(ans.id)}
                        >
                          Xóa
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
                ? "Đang chỉnh sửa đáp án"
                : "Thêm câu trả lời mới"}
            </span>
            <div className="border-primary-main/20 bg-primary-main/5 flex flex-col gap-3 rounded-md border p-4">
              <Checkbox
                label="Đặt làm đáp án đúng?"
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
                    Hủy sửa
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveAnswer}
                >
                  {editingAnswerId
                    ? "Cập nhật đáp án"
                    : "Lưu đáp án vào danh sách"}
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-4 flex items-center justify-between border-t border-other-outlined-border py-4">
            <Checkbox
              label="Đặt làm câu hỏi công khai"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <div className="flex gap-2">
              <Button variant="outline" color="standard" onClick={onClose}>
                Quay lại
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFinalSubmit}
                disabled={!questionContent || answers.length < 2 || !subjectId}
              >
                Lưu toàn bộ câu hỏi
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Overlay>
  );
}
