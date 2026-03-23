import { useExamStore } from "@/stores/useExamStore";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "@/components/atomic/molecules/Logo/Logo";
import ExamResultOverview from "@/components/atomic/organisms/ExamResultOverview/ExamResultOverview";

// Mock data cho ví dụ
const MOCK_QUESTIONS = [
  {
    id: "q1",
    text: "Những thuộc tính nào sau đây thuộc về mô hình hộp (Box Model) trong CSS? (Chọn nhiều đáp án)",
    options: ["color", "margin", "padding", "display"],
    correctAnswer: ["margin", "padding"],
    type: "multiple",
  },
  {
    id: "q2",
    text: "Thẻ nào được sử dụng để tạo một liên kết (hyperlink) trong HTML?",
    options: ["<link>", "<a>", "<html>", "<href>"],
    correctAnswer: "<a>",
    type: "single",
  },
];

export default function ResultDoTestPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { answers, violationCount, resetExam } = useExamStore();

  // Các dữ liệu này sau này Mạnh fetch từ API dựa trên attemptId
  const resultData = {
    score: 1,
    totalPoints: 15,
    percentage: 85,
    duration: "00:00:12",
    dateStarted: "Mon 23 Mar '26 05:51",
    dateFinished: "Mon 23 Mar '26 05:51",
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-background-paper text-text-secondary">
      <header className="flex w-full justify-center px-4">
        <div className="w-[668px] pb-6 pt-6">
          <Logo classname="text-text-secondary font-bold" />
        </div>
      </header>

      <main className="mb-20 flex w-full flex-col items-center px-4 py-5">
        <ExamResultOverview
          {...resultData}
          examTitle="Kiểm tra kiến thức cơ bản HTML & CSS"
          userName="Nguyễn Hùng Mạnh"
          attemptId={attemptId}
          violationCount={violationCount}
          questions={MOCK_QUESTIONS}
          userAnswers={answers}
          onBackToDashboard={() => {
            resetExam();
            navigate("/tests");
          }}
        />
      </main>
    </div>
  );
}
