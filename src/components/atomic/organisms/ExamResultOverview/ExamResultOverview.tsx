import { useState, useMemo } from "react";
import { Printer } from "lucide-react";
import { Button, Icon } from "@/components/atomic/atoms";
import QuestionCard from "@/components/atomic/molecules/QuestionCard/QuestionCard";
import {
  calculateDuration,
  getTextProgress,
  getTextProgressColor,
} from "@/utils";
import Tabs from "../../molecules/Tabs/Tabs";
import { useDeThiStore } from "@/stores/useDeThi.store";
import { useExamStore } from "@/stores/useExamStore";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

export default function ExamResultContent() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // 1. Chỉ lấy examResult - Đây là "Source of Truth" duy nhất
  const { examResult, mode, answers } = useExamStore();
  const { testData } = useDeThiStore();

  const isPreview = mode === "PREVIEW";
  const config = testData?.cau_hinh_thi;

  const [showDetail, setShowDetail] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"all" | "success" | "error">(
    "all"
  );

  // 2. Clean Logic: Lấy stats trực tiếp từ examResult
  const stats = useMemo(() => {
    if (!examResult) return null;
    const { baiLam } = examResult;

    return {
      score: baiLam.tongDiem || 0,
      percentage: Math.round(((baiLam.tongDiem || 0) / 10) * 100),
      totalPoints: 10,
      durationText: calculateDuration(
        baiLam.thoiGianBatDau,
        baiLam.thoiGianNopBai
      ),
      violationCount: baiLam.logBaiLam?.soLanChuyenTab || 0,
      dateStarted: baiLam.thoiGianBatDau
        ? new Date(baiLam.thoiGianBatDau).toLocaleString()
        : "N/A",
      dateFinished: baiLam.thoiGianNopBai
        ? new Date(baiLam.thoiGianNopBai).toLocaleString()
        : "N/A",
    };
  }, [examResult]);

  // 3. Clean Logic: Lọc dựa trên mảng cauHois đã được Server/Store chấm điểm
  const filteredQuestions = useMemo(() => {
    if (!examResult?.cauHois) return [];

    return examResult.cauHois.filter((q) => {
      // Tìm đáp án đúng trong list answers của câu hỏi
      const correctAnsId = q.cau_tra_lois.find((a) => a.isCorrectAnswer)?.id;
      const isCorrect = q.dapAnDaChon === correctAnsId;

      if (selectedTab === "success") return isCorrect;
      if (selectedTab === "error") return !isCorrect;
      return true;
    });
  }, [selectedTab, examResult]);

  if (!examResult || !stats)
    return <div className="p-10 text-center">Đang tải kết quả...</div>;

  const handleBackHome = () => {
    if (isPreview) {
      navigate(-2); // Nếu là preview thường mở tab mới, hoặc điều hướng về trang quản trị
    } else {
      navigate("/");
    } // Hoặc dashboard route của bạn
  };

  return (
    <div className="w-[668px] max-w-[668px] space-y-6">
      {/* Thông báo chế độ Preview */}
      {isPreview && (
        <div className="bg-primary-main/10 border-primary-main/20 rounded-lg border p-3 text-center font-medium text-primary-main">
          Bạn đang xem trước kết quả ở chế độ Admin
        </div>
      )}
      {/* 1. Card Kết quả chính (Overview) */}
      <div className="flex items-center overflow-hidden rounded-lg bg-background-body-background shadow-custom">
        <div className="flex-1 px-8 py-6">
          <h1 className="text-h5 mb-2 font-bold text-text-primary">
            {testData?.tenDe}
          </h1>
          <div className="text-body-2 mb-6 flex items-center gap-2">
            <span className="flex items-center">
              <Icon name="user" size={16} className="mr-1" /> {user?.hoTen}
            </span>
            <Button size="small" color="primary" onClick={() => window.print()}>
              <Printer size={14} /> In trang này
            </Button>
          </div>
          <div className="space-y-4">
            {config?.showScore || isPreview ? (
              <InfoRow
                label="Điểm số:"
                value={`${stats.score} / ${stats.totalPoints}`}
                highlight
              />
            ) : (
              <div className="text-body-2 italic text-text-disabled">
                Điểm số được ẩn theo cấu hình đề thi.
              </div>
            )}
            {/* Thêm dòng này ở đây */}
            <InfoRow label="Thời gian làm:" value={stats.durationText} />
            <InfoRow label="Bắt đầu lúc:" value={stats.dateStarted} />
            <InfoRow label="Kết thúc lúc:" value={stats.dateFinished} />
            <div className="text-body-2 flex items-center">
              <span className="w-32 font-bold text-text-secondary">
                Số lần vi phạm:
              </span>
              <span
                className={`rounded px-2 py-0.5 ${stats.violationCount > 0 ? "bg-error-background text-alert-error-content" : "bg-action-hover text-text-disabled"}`}
              >
                {stats.violationCount} /{" "}
                {testData?.cau_hinh_thi?.tabSwitchLimit || 3}
              </span>
            </div>
          </div>
        </div>
        {config?.showScore && (
          <div
            className={`flex min-h-[280px] w-64 flex-col items-center justify-center bg-background-body-background p-8 ${getTextProgressColor(stats.percentage)}`}
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
                  strokeDashoffset={364.4 - (364.4 * stats.percentage) / 100}
                  className="transition-all duration-1000"
                />
              </svg>
              <span className="absolute text-3xl font-bold">
                {stats.percentage}%
              </span>
            </div>
            <p className="mt-4 font-bold uppercase tracking-wider">
              {getTextProgress(stats.percentage)}
            </p>
          </div>
        )}
      </div>
      {/* 3. Section Chi tiết câu hỏi (Ẩn/Hiện) */}
      {config?.showDetailResults || isPreview ? (
        showDetail && (
          <div
            id="details-section"
            className="overflow-hidden rounded-xl border border-other-outlined-border bg-background-body-background shadow-custom"
          >
            <div className="px-6 pt-4">
              <Tabs
                small
                value={selectedTab}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(val) => setSelectedTab(val as any)}
                tabs={[
                  {
                    value: "all",
                    label: `Tất cả (${testData?.cau_hois?.length || 0})`,
                  },
                  { value: "success", label: "Câu đúng" },
                  { value: "error", label: "Câu sai" },
                ]}
              />
            </div>
            <div className="divide-y divide-other-outlined-border">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((q, idx) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    index={
                      testData?.cau_hois?.findIndex(
                        (orig) => orig.id === q.id
                      ) ?? idx
                    }
                    totalQuestions={testData?.cau_hois?.length || 0}
                    userAnswer={answers[q.id]}
                    isReviewMode={true}
                    isFlatMode={true}
                  />
                ))
              ) : (
                <div className="py-20 text-center text-text-disabled">
                  Không có dữ liệu phù hợp.
                </div>
              )}
            </div>
          </div>
        )
      ) : (
        <div className="rounded-lg border border-dashed bg-gray-50 p-6 text-center text-text-secondary">
          Xem chi tiết đáp án đã bị khóa cho bài thi này.
        </div>
      )}
      {/* 2. Nút hành động */}
      <div className="flex justify-end gap-4 pt-2">
        <Button variant="outline" onClick={handleBackHome}>
          {isPreview ? "Thoát chế độ demo" : "Về trang chủ"}
        </Button>
        {config?.showDetailResults && (
          <Button
            color="primary"
            variant="contained"
            onClick={() => setShowDetail(!showDetail)}
          >
            {showDetail ? "Ẩn chi tiết đáp án" : "Xem chi tiết đáp án"}
          </Button>
        )}
      </div>
    </div>
  );
}

const InfoRow = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="text-body-2 flex items-center">
    <span className="w-32 font-bold text-text-secondary">{label}</span>
    <span
      className={`rounded px-2 py-0.5 ${highlight ? "bg-warning-background font-medium text-text-primary" : "text-text-secondary"}`}
    >
      {value}
    </span>
  </div>
);
