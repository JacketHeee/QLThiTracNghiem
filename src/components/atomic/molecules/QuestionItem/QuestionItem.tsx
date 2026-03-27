import { useState } from "react";
import { Button, Icon } from "@/components/atomic/atoms";
import type { Question } from "@/types";
import { formatDateTimeVN } from "@/utils";

interface QuestionItemProps {
  data: Question;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onAddToBank?: (id: number) => void;
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
          {data.do_kho.tenDoKho}
        </span>
        <span className="text-body-1 text-text-secondary">
          {data.mon_hoc.tenMonHoc}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col px-2">
        <div
          className={`flex flex-col border-other-outlined-border px-2 py-4 ${showAnswer ? "border-b" : ""}`}
        >
          <span className="text-body-1 font-medium text-text-primary">
            {data.noiDungCauHoi}
          </span>

          {showAnswer && data.cau_tra_lois && (
            <div className="mt-4 flex flex-col gap-1">
              {data.cau_tra_lois.map((ans, idx) => (
                <div
                  key={idx}
                  className={`text-body-1 flex max-w-[700px] items-center justify-between rounded-md px-3 py-2 ${
                    ans.isCorrectAnswer
                      ? "bg-action-hover text-text-primary"
                      : "text-text-secondary"
                  }`}
                >
                  <span>
                    <strong>{String.fromCharCode(65 + idx)}</strong>.{" "}
                    {ans.noiDungLuaChon}
                  </span>
                  {ans.isCorrectAnswer && (
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
            <span>{formatDateTimeVN(data.created_at)} ·</span>
            <Icon name="word" size={16} />
            <span>· Lượt sử dụng: {data.soLuotSuDung} lần</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;
