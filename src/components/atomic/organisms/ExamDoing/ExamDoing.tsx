import { useNavigate, useParams } from "react-router-dom";
import Logo from "../../molecules/Logo/Logo";
import { Button, Icon } from "../../atoms";
import { useExamStore } from "@/stores/useExamStore";
import { useState, useEffect, useRef } from "react";
import { AlertTriangle, ShieldAlert, List, Maximize2 } from "lucide-react";
import QuestionCard from "../../molecules/QuestionCard/QuestionCard";

const MOCK_QUESTIONS = [
  {
    id: "q1",
    text: "Những thuộc tính nào sau đây thuộc về mô hình hộp (Box Model) trong CSS? (Chọn nhiều đáp án)",
    options: ["color", "margin", "padding", "display"],
    type: "multiple",
  },
  {
    id: "q2",
    text: "Thẻ nào được sử dụng để tạo một liên kết (hyperlink) trong HTML?",
    options: ["<link>", "<a>", "<html>", "<href>"],
    type: "single",
  },
  {
    id: "q2",
    text: "Thẻ nào được sử dụng để tạo một liên kết (hyperlink) trong HTML?",
    options: ["<link>", "<a>", "<html>", "<href>"],
    type: "single",
  },
  {
    id: "q2",
    text: "Thẻ nào được sử dụng để tạo một liên kết (hyperlink) trong HTML?",
    options: ["<link>", "<a>", "<html>", "<href>"],
    type: "single",
  },
];

export const ExamDoing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    answers,
    updateAnswer,
    violationCount,
    addViolation,
    finishExam,
    startTime,
  } = useExamStore();

  const [timeLeft, setTimeLeft] = useState(600);
  const [showWarning, setShowWarning] = useState(false);
  const [showKicked, setShowKicked] = useState(false);
  const isTabOut = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMouseOut, setIsMouseOut] = useState(false);

  // 1. Guard & Timer
  useEffect(() => {
    if (!startTime) navigate(`/tests/${id}/take`, { replace: true });
    const timer = setInterval(
      () => setTimeLeft((p) => (p > 0 ? p - 1 : 0)),
      1000
    );
    // eslint-disable-next-line react-hooks/immutability
    if (timeLeft === 0) handleFinish();
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, timeLeft, id, navigate]);

  // 2. Anti-cheat Logic
  useEffect(() => {
    const handleAction = () => {
      if (document.hidden || !document.hasFocus()) {
        isTabOut.current = true;
      } else if (isTabOut.current) {
        isTabOut.current = false;
        addViolation();
        if (violationCount + 1 >= 3) setShowKicked(true);
        else setShowWarning(true);
      }
    };
    window.addEventListener("visibilitychange", handleAction);
    window.addEventListener("focus", handleAction);
    return () => {
      window.removeEventListener("visibilitychange", handleAction);
      window.removeEventListener("focus", handleAction);
    };
  }, [violationCount, addViolation]);

  const handleFinish = () => {
    finishExam();
    if (document.fullscreenElement) document.exitFullscreen();
    navigate(`/tests/${id}/take/result/attempt-${Date.now()}`, {
      replace: true,
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden text-text-secondary">
      {/* 1. Logo Header */}
      <header className="flex justify-center px-4">
        <div className="w-[668px] pb-6 pt-6">
          {" "}
          <Logo classname="text-text-secondary font-bold" />
        </div>
      </header>

      <main
        onMouseLeave={() => setIsMouseOut(true)}
        onMouseEnter={() => setIsMouseOut(false)}
        className="flex w-fit flex-col items-center px-4 py-5 text-text-secondary"
      >
        <div className="w-full max-w-[668px]">
          {/* 2. Title */}
          <h1 className="text-h5 pb-3">Kiểm tra kiến thức cơ bản HTML & CSS</h1>

          <div className="text-body-2 mb-6 flex items-center gap-2">
            <Icon name="user" />
            <span>Nguyễn Hùng Mạnh</span>
          </div>

          {/* 3. Status Bar (Timer & Actions) */}
          <div className="flex-bet-center mb-8">
            {/*  */}
            <div className="flex items-center gap-2 rounded-full border border-other-outlined-border bg-background-body-background px-3 py-2">
              <Icon name="user" size={16} />

              <span className="text-body-2">
                <span className="mr-1.5 font-bold"> Time left: </span>
                <span>
                  {Math.floor(timeLeft / 60)
                    .toString()
                    .padStart(2, "0")}
                  :{(timeLeft % 60).toString().padStart(2, "0")}
                </span>
              </span>
            </div>

            {/*  */}
            <div className="text-body-2 flex items-center gap-4">
              <Button
                size={"small"}
                className="flex items-center gap-2 hover:underline"
                color={"primary"}
              >
                <List size={18} /> Xem tất cả câu hỏi
              </Button>
              <Button size={"small"}>
                <Maximize2 size={18} />
              </Button>
            </div>
          </div>

          {/* 4. Questions List */}
          <div className="space-y-8">
            {MOCK_QUESTIONS.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={idx}
                totalQuestions={MOCK_QUESTIONS.length}
                userAnswer={answers[q.id]}
                onAnswerChange={updateAnswer}
              />
            ))}
          </div>

          {/* 5. Finish Button */}
          <div className="mb-20 mt-12 flex justify-between">
            <Button variant={"outline"}>Câu trước</Button>
            <Button color="primary" variant="contained" onClick={handleFinish}>
              Nộp bài
            </Button>
          </div>
        </div>

        {/* 3. Overlay nhắc nhở khi chuột ra ngoài */}
        {/* {isMouseOut && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-500/60 backdrop-blur-[4px] transition-all duration-300">
            <div className="animate-in zoom-in flex flex-col items-center gap-4 rounded-2xl bg-[#444] p-10 text-white shadow-2xl duration-200">
              <div className="mb-2 rounded-xl border-2 border-dashed border-white/50 p-4">
                <MousePointer2 size={48} className="animate-pulse" />
              </div>
              <h2 className="text-center text-2xl font-bold tracking-tight">
                Please stay in the Test
              </h2>
            </div>
          </div>
        )} */}
      </main>

      {/* 6. Modals & Popups */}
      {showKicked ? (
        <ViolationModal
          type="kicked"
          count={violationCount}
          onConfirm={handleFinish}
        />
      ) : showWarning ? (
        <ViolationModal
          type="warning"
          count={violationCount}
          onConfirm={() => setShowWarning(false)}
        />
      ) : null}
    </div>
  );
};

interface ViolationModalProps {
  type: "warning" | "kicked";
  count: number;
  onConfirm: () => void;
}

const ViolationModal = ({ type, count, onConfirm }: ViolationModalProps) => {
  const isKicked = type === "kicked";

  return (
    <div
      className={`fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm transition-all ${isKicked ? "bg-black/70" : "bg-black/40"}`}
    >
      <div
        className={`flex w-full max-w-sm flex-col items-center rounded-2xl bg-background-body-background p-8 text-center shadow-2xl duration-200 animate-in zoom-in ${isKicked ? "border-t-4 border-error-main" : ""}`}
      >
        {/* Icon thay đổi theo type */}
        {isKicked ? (
          <ShieldAlert size={60} className="mb-4 text-error-main" />
        ) : (
          <AlertTriangle size={50} className="mb-4 text-warning-main" />
        )}

        {/* Tiêu đề */}
        <h2
          className={`text-h5 mb-2 font-bold ${isKicked ? "text-error-main" : "text-text-primary"}`}
        >
          {isKicked ? "Đình chỉ thi!" : "Cảnh báo vi phạm!"}
        </h2>

        {/* Nội dung tin nhắn */}
        <p className="text-body-2 mb-8 text-text-secondary">
          {isKicked
            ? "Bạn đã vi phạm quá 3 lần quy chế thoát màn hình. Hệ thống tự động nộp bài."
            : `Bạn vừa rời khỏi màn hình thi. Vi phạm: ${count}/3`}
        </p>

        {/* Nút bấm */}
        <Button
          color={isKicked ? "error" : "primary"}
          variant="contained"
          onClick={onConfirm}
        >
          {isKicked ? "Xem kết quả" : "Tôi đã hiểu"}
        </Button>
      </div>
    </div>
  );
};
