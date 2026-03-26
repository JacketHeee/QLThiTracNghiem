import { useState } from "react";
import { Button, Icon } from "@/components/atomic/atoms";

interface Answer {
  label: string;
  content: string;
  isCorrect?: boolean;
}

export interface QuestionData {
  id: string;
  difficulty: string;
  category: string;
  content: string;
  answers?: Answer[];
  timeAgo: string;
  usageCount: number;
  status?: string;
}

interface QuestionItemProps {
  data: QuestionData;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddToBank?: (id: string) => void;
}

const QuestionItem = ({
  data,
  onEdit,
  onDelete,
  onAddToBank,
}: QuestionItemProps) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="flex flex-col rounded-md bg-background-body-background px-3">
      {/* Header */}
      <div className="flex justify-between border-b border-other-outlined-border p-5">
        <span className="text-caption rounded-sm border border-text-secondary px-2 py-1 text-text-secondary">
          {data.difficulty}
        </span>
        <span className="text-body-1 text-text-secondary">{data.category}</span>
      </div>

      {/* Body */}
      <div className="flex flex-col px-2">
        <div
          className={`flex flex-col border-other-outlined-border px-2 py-4 ${showAnswer ? "border-b" : ""}`}
        >
          <span className="text-body-1 font-medium text-text-primary">
            {data.content}
          </span>

          {showAnswer && data.answers && (
            <div className="mt-4 flex flex-col gap-1">
              {data.answers.map((ans, idx) => (
                <div
                  key={idx}
                  className={`text-body-1 flex max-w-[700px] items-center justify-between rounded-md px-3 py-2 ${
                    ans.isCorrect
                      ? "bg-action-hover text-text-primary"
                      : "text-text-secondary"
                  }`}
                >
                  <span>
                    <strong>{ans.label}</strong>. {ans.content}
                  </span>
                  {ans.isCorrect && (
                    <Icon
                      name="success"
                      size={20}
                      className="text-alert-success-content"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between py-2">
          <div className="flex gap-2">
            <Button
              variant="text"
              color="primary"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              {showAnswer ? "Ẩn đáp án" : "Hiển thị đáp án"}
            </Button>
            <Button
              variant="text"
              color="primary"
              onClick={() => onEdit?.(data.id)}
            >
              Sửa
            </Button>
            <Button
              variant="text"
              color="primary"
              onClick={() => onDelete?.(data.id)}
            >
              Xóa
            </Button>
            <Button
              variant="text"
              color="primary"
              onClick={() => onAddToBank?.(data.id)}
            >
              Thêm vào ngân hàng
            </Button>
          </div>

          <div className="flex items-center gap-1 text-text-secondary">
            <span>{data.timeAgo} ·</span>
            <Icon name="word" size={16} />
            <span>· Lượt sử dụng: {data.usageCount} lần</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;
