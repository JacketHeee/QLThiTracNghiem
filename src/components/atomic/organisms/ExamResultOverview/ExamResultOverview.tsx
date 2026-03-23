import { useState, useMemo } from "react";
import { Printer } from "lucide-react";
import { Button, Icon } from "@/components/atomic/atoms";
import QuestionCard from "@/components/atomic/molecules/QuestionCard/QuestionCard";
import { getTextProgress, getTextProgressColor } from "@/utils";
import Tabs from "../../molecules/Tabs/Tabs";

interface ExamResultContentProps {
  examTitle: string;
  userName: string;
  score: number;
  totalPoints: number;
  percentage: number;
  duration: string;
  dateStarted: string;
  dateFinished: string;
  attemptId?: string;
  violationCount: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userAnswers: Record<string, any>;
  onBackToDashboard: () => void;
  textMainAction?: string;
}

export default function ExamResultContent({
  examTitle,
  userName,
  score,
  totalPoints,
  percentage,
  duration,
  dateStarted,
  dateFinished,
  attemptId,
  violationCount,
  questions,
  userAnswers,
  onBackToDashboard,
  textMainAction,
}: ExamResultContentProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"all" | "success" | "error">(
    "all"
  );

  // Logic lọc câu hỏi (đã sửa lỗi TypeError sort)
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const uAns = userAnswers[q.id];
      let isCorrect = false;

      if (Array.isArray(q.correctAnswer)) {
        const uArr = Array.isArray(uAns) ? [...uAns] : [];
        const cArr = [...q.correctAnswer];
        isCorrect =
          uArr.length === cArr.length &&
          uArr.sort().join(",") === cArr.sort().join(",");
      } else {
        isCorrect = uAns === q.correctAnswer;
      }

      if (selectedTab === "success") return isCorrect;
      if (selectedTab === "error") return !isCorrect;
      return true;
    });
  }, [selectedTab, questions, userAnswers]);

  return (
    <div className="w-[668px] max-w-[668px] space-y-6">
      {/* 1. Card Kết quả chính (Overview) */}
      <div className="flex items-center overflow-hidden rounded-lg bg-background-body-background shadow-custom">
        <div className="flex-1 px-8 py-6">
          <h1 className="text-h5 mb-2 font-bold text-text-primary">
            {examTitle}
          </h1>
          <div className="text-body-2 mb-6 flex items-center gap-2">
            <span className="flex items-center">
              <Icon name="user" size={16} className="mr-1" /> {userName}
            </span>
            <Button size="small" color="primary" onClick={() => window.print()}>
              <Printer size={14} /> In trang này
            </Button>
          </div>
          <div className="space-y-4">
            {[
              {
                label: "Điểm số:",
                value: `${score} / ${totalPoints}`,
                highlight: true,
              },
              { label: "Thời gian làm bài:", value: duration },
              { label: "Bắt đầu lúc:", value: dateStarted },
              { label: "Kết thúc lúc:", value: dateFinished },
              { label: "Mã lượt thi:", value: attemptId || "N/A" },
            ].map((item, idx) => (
              <div key={idx} className="text-body-2 flex items-center">
                <span className="w-32 font-bold text-text-secondary">
                  {item.label}
                </span>
                <span
                  className={`rounded px-2 py-0.5 ${item.highlight ? "bg-warning-background font-medium text-text-primary" : "text-text-secondary"}`}
                >
                  {item.value}
                </span>
              </div>
            ))}
            <div className="text-body-2 flex items-center">
              <span className="w-32 font-bold text-text-secondary">
                Số lần vi phạm:
              </span>
              <span
                className={`rounded px-2 py-0.5 ${violationCount > 0 ? "bg-error-background text-alert-error-content" : "bg-action-hover text-text-disabled"}`}
              >
                {violationCount} / 3
              </span>
            </div>
          </div>
        </div>
        <div
          className={`bg-action-hover/20 flex min-h-[280px] w-64 flex-col items-center justify-center p-8 ${getTextProgressColor(percentage)}`}
        >
          <div className="relative flex items-center justify-center">
            <svg className="h-32 w-32 -rotate-90 transform">
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-100"
              />
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={364.4}
                strokeDashoffset={364.4 - (364.4 * percentage) / 100}
                className="transition-all duration-1000"
              />
            </svg>
            <span className="absolute text-3xl font-bold">{percentage}%</span>
          </div>
          <p className="mt-4 font-bold uppercase tracking-wider">
            {getTextProgress(percentage)}
          </p>
        </div>
      </div>

      {/* 3. Section Chi tiết câu hỏi (Ẩn/Hiện) */}
      {showDetail && (
        <div
          id="details-section"
          className="overflow-hidden rounded-xl border border-other-outlined-border bg-background-body-background shadow-custom"
        >
          <div className="bg-white px-6 pt-4">
            <Tabs
              className="border-b border-other-outlined-border"
              small={true}
              value={selectedTab}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(val) => setSelectedTab(val as any)}
              tabs={[
                { value: "all", label: `Tất cả (${questions.length})` },
                { value: "success", label: "Câu trả lời đúng" },
                { value: "error", label: "Câu trả lời sai" },
              ]}
            />
          </div>
          <div className="divide-y divide-other-outlined-border bg-white">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((q, idx) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={idx}
                  totalQuestions={questions.length}
                  userAnswer={userAnswers[q.id]}
                  isReviewMode={true}
                  isFlatMode={true}
                />
              ))
            ) : (
              <div className="py-20 text-center text-text-disabled">
                Không tìm thấy câu hỏi nào phù hợp.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Nút hành động */}
      <div className="flex justify-end gap-4 pt-2">
        <Button variant="outline" onClick={onBackToDashboard}>
          {textMainAction ?? " Về trang chủ"}
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => setShowDetail(!showDetail)}
        >
          {showDetail ? "Ẩn chi tiết đáp án" : "Xem chi tiết đáp án"}
        </Button>
      </div>
    </div>
  );
}
