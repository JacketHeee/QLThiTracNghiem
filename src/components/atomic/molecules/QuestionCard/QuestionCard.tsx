import { Bookmark, CheckCircle2, XCircle } from "lucide-react";
import { RadioButton } from "../../atoms/RadioButton/RadioButton";

interface QuestionCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  question: any;
  index: number;
  totalQuestions: number;
  userAnswer?: string | string[];
  isReviewMode?: boolean;
  onAnswerChange?: (questionId: string, option: string) => void;
  isFlatMode?: boolean;
}

export default function QuestionCard({
  question,
  index,
  totalQuestions,
  userAnswer,
  isReviewMode = false,
  onAnswerChange,
  isFlatMode = false,
}: QuestionCardProps) {
  const checkCorrect = (opt: string) => {
    if (Array.isArray(question.correctAnswer)) {
      return question.correctAnswer.includes(opt);
    }
    return opt === question.correctAnswer;
  };

  return (
    <div
      className={`overflow-hidden border-other-outlined-border text-text-secondary ${!isFlatMode ? "rounded-xl border bg-background-body-background shadow-custom" : "border-b"}`}
    >
      {/* Header */}
      {!isReviewMode && (
        <div
          className={`flex items-center justify-between border-b border-other-outlined-border bg-action-hover px-6 py-4`}
        >
          <span className="text-body-1 font-bold text-text-primary">
            Câu hỏi {index + 1} trong {totalQuestions}
          </span>
          <div className="flex items-center gap-4">
            {!isReviewMode && (
              <Bookmark
                size={18}
                className="cursor-pointer text-text-disabled transition-colors hover:text-primary-main"
              />
            )}
          </div>
        </div>
      )}

      <div className="text-body-2 p-8">
        <p className="mb-6 font-medium leading-relaxed text-text-primary">
          <span className="font-bold">
            Câu hỏi {index + 1} trong {totalQuestions}:
          </span>{" "}
          {question.text}
        </p>

        <div className="space-y-2">
          {question.options.map((opt: string, i: number) => {
            const isSelected = Array.isArray(userAnswer)
              ? userAnswer.includes(opt)
              : userAnswer === opt;

            const isCorrectOpt = checkCorrect(opt);

            // Xác định màu nền cho từng option trong chế độ Review
            let rowStyle = "";
            if (isReviewMode) {
              if (isSelected) {
                rowStyle = "bg-action-hover"; // Màu đỏ cho đáp án sai người dùng chọn
              }
            }

            return (
              <div
                key={opt}
                className={`group -ml-2 flex items-center justify-between rounded-lg p-3 transition-all ${rowStyle} ${
                  !isReviewMode
                    ? "cursor-pointer hover:bg-action-hover"
                    : "cursor-default"
                }`}
                onClick={() =>
                  !isReviewMode && onAnswerChange?.(question.id, opt)
                }
              >
                <div className="flex items-center gap-4">
                  <RadioButton
                    name={question.id}
                    checked={isSelected}
                    disabled={isReviewMode} // Không cho click khi đang xem kết quả
                    onChange={() =>
                      !isReviewMode && onAnswerChange?.(question.id, opt)
                    }
                  />

                  <span
                    className={`${isSelected ? "font-bold text-text-primary" : "text-text-secondary"}`}
                  >
                    <span className="mr-1 font-bold uppercase">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {opt}
                  </span>
                </div>

                {/* Icon trạng thái ở cuối dòng */}
                {isReviewMode && (
                  <div className="flex items-center">
                    {isCorrectOpt && (
                      <CheckCircle2
                        size={20}
                        className="text-alert-success-content"
                      />
                    )}
                    {isSelected && !isCorrectOpt && (
                      <XCircle size={20} className="text-alert-error-content" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
