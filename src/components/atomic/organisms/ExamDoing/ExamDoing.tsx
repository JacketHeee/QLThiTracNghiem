import { useNavigate } from "react-router-dom";
import Logo from "../../molecules/Logo/Logo";
import { Button, Icon } from "../../atoms";
import { useExamStore } from "@/stores/useExamStore";
import { useState, useEffect, useRef } from "react";
import { AlertTriangle, ShieldAlert, List, Maximize2 } from "lucide-react";
import QuestionCard from "../../molecules/QuestionCard/QuestionCard";
import { useDeThiStore } from "@/stores/useDeThi.store";
import type { Question } from "@/types";
import { shuffleArray } from "@/utils";
import { useAuthStore } from "@/stores/auth.store";

export const ExamDoing = () => {
  const navigate = useNavigate();

  // 1. Kết nối Final Store
  const {
    currentExam,
    answers,
    updateAnswer,
    addViolation,
    finishExam,
    startExam,
  } = useExamStore();

  const { user } = useAuthStore();

  const { testData } = useDeThiStore();
  // State mới để lưu danh sách câu hỏi đã qua xử lý đảo
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  // Lấy số lần vi phạm từ Store
  const violationCount = currentExam?.logBaiLam?.soLanChuyenTab || 0;

  const [timeLeft, setTimeLeft] = useState(
    (testData?.thoiGianLamBai || 0) * 60
  );
  const [showWarning, setShowWarning] = useState(false);
  const [showKicked, setShowKicked] = useState(false);
  const isTabOut = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMouseOut, setIsMouseOut] = useState(false);

  useEffect(() => {
    const config = testData?.cau_hinh_thi;

    // CHỈ CHẠY NẾU CÓ CẤU HÌNH GIÁM SÁT
    if (config?.hasMonitoring) {
      const enterFullscreen = async () => {
        try {
          if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
          }
        } catch (err) {
          console.error("Không thể bật chế độ toàn màn hình:", err);
        }
      };

      enterFullscreen();

      // (Tùy chọn) Chặn phím Esc hoặc cảnh báo khi thoát Fullscreen
      const handleFullscreenChange = () => {
        if (!document.fullscreenElement) {
          // Nếu người dùng thoát Fullscreen khi đang bị giám sát:
          // Bạn có thể hiện Modal bắt buộc quay lại hoặc tính là 1 lần vi phạm
          setShowWarning(true);
        }
      };

      document.addEventListener("fullscreenchange", handleFullscreenChange);

      return () => {
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange
        );
      };
    }
  }, [testData?.cau_hinh_thi]);

  // 1. Guard & Timer & Start Exam
  useEffect(() => {
    // Nếu chưa có dữ liệu bài làm hoặc đã nộp, đá về trang hướng dẫn
    if (!currentExam || currentExam.status === "DA_NOP") {
      navigate(`/tests/${testData?.id}/take`, { replace: true });
      return;
    }
    // --- LOGIC ĐẢO DỮ LIỆU ---
    const config = testData?.cau_hinh_thi;
    let finalQuestions = testData?.cau_hois ? [...testData.cau_hois] : [];

    // 1. Đảo câu hỏi
    if (config?.shuffleQuestions) {
      finalQuestions = shuffleArray(finalQuestions);
    }

    // 2. Đảo đáp án trong từng câu hỏi
    if (config?.shuffleAnswers) {
      finalQuestions = finalQuestions.map((q) => ({
        ...q,
        cau_tra_lois: shuffleArray(q.cau_tra_lois),
      }));
    }

    setShuffledQuestions(finalQuestions);

    // Ghi nhận thời gian bắt đầu làm bài vào Store
    startExam();

    const timer = setInterval(() => {
      setTimeLeft((p) => {
        if (p <= 1) {
          clearInterval(timer);
          handleFinish(); // Hết giờ tự động nộp
          return 0;
        }
        return p - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Anti-cheat Logic
  useEffect(() => {
    const config = testData?.cau_hinh_thi;

    // Nếu không yêu cầu giám sát hoặc giới hạn tab thì không chạy logic này
    if (!config?.hasMonitoring && !config?.isLimitSwitchTab) return;

    const handleAction = () => {
      if (document.hidden || !document.hasFocus()) {
        isTabOut.current = true;
      } else if (isTabOut.current) {
        isTabOut.current = false;

        // Chỉ cộng vi phạm nếu có bật tính năng giới hạn tab
        if (config.isLimitSwitchTab) {
          addViolation();
          const limit = config.tabSwitchLimit || 3;

          if (violationCount + 1 >= limit) {
            setShowKicked(true);
          } else {
            setShowWarning(true);
          }
        }
      }
    };

    window.addEventListener("visibilitychange", handleAction);
    window.addEventListener("focus", handleAction);
    return () => {
      window.removeEventListener("visibilitychange", handleAction);
      window.removeEventListener("focus", handleAction);
    };
  }, [violationCount, addViolation, testData?.cau_hinh_thi]);

  useEffect(() => {
    const config = testData?.cau_hinh_thi;

    // Nếu allowCopy là false (nghĩa là đang BẬT chế độ chặn)
    if (config?.allowCopy === false) {
      const handlePrevent = (e: Event) => {
        e.preventDefault();
        // Tùy chọn: Hiển thị một toast thông báo "Hành động này bị cấm"
      };

      // 1. Chặn Chuột phải (Context Menu)
      document.addEventListener("contextmenu", handlePrevent);

      // 2. Chặn Copy & Paste
      document.addEventListener("copy", handlePrevent);
      document.addEventListener("paste", handlePrevent);

      // 3. Chặn các tổ hợp phím tắt (Ctrl+C, Ctrl+V, Ctrl+P, F12, v.v.)
      const handleKeyDown = (e: KeyboardEvent) => {
        const isControl = e.ctrlKey || e.metaKey; // metaKey cho Macbook

        if (
          (isControl &&
            ["c", "v", "p", "s", "u"].includes(e.key.toLowerCase())) ||
          e.key === "F12"
        ) {
          e.preventDefault();
        }
      };
      document.addEventListener("keydown", handleKeyDown);

      // 4. Chặn Print (Sử dụng CSS để ẩn nội dung khi in)
      const style = document.createElement("style");
      style.innerHTML = "@media print { body { display: none !important; } }";
      document.head.appendChild(style);

      // Cleanup khi unmount
      return () => {
        document.removeEventListener("contextmenu", handlePrevent);
        document.removeEventListener("copy", handlePrevent);
        document.removeEventListener("paste", handlePrevent);
        document.removeEventListener("keydown", handleKeyDown);
        document.head.removeChild(style);
      };
    }
  }, [testData?.cau_hinh_thi]);

  // 3. Xử lý Nộp bài
  const handleFinish = () => {
    // Gọi hàm finishExam từ Store, truyền questions để tự động tính điểm hệ 10
    finishExam(testData?.cau_hois || []);

    if (document.fullscreenElement) document.exitFullscreen();

    // Điều hướng sang trang kết quả
    navigate(`/tests/${testData?.id}/take/result/${currentExam?.id}`, {
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
          <h1 className="text-h5 pb-3">{testData?.tenDe}</h1>

          <div className="text-body-2 mb-6 flex items-center gap-2">
            <Icon name="user" />
            <span>{user?.hoTen}</span>
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
            {shuffledQuestions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={idx}
                totalQuestions={shuffledQuestions.length}
                userAnswer={answers[q.id]}
                onAnswerChange={updateAnswer} // Truyền thẳng hàm từ Store vào
              />
            ))}
          </div>

          {/* 5. Finish Button */}
          <div className="mb-20 mt-12 flex justify-end">
            {/* <Button variant={"outline"}>Câu trước</Button> */}
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
          maxCount={testData?.cau_hinh_thi?.tabSwitchLimit || 999}
          type="kicked"
          count={violationCount}
          onConfirm={handleFinish}
        />
      ) : showWarning ? (
        <ViolationModal
          maxCount={testData?.cau_hinh_thi?.tabSwitchLimit || 999}
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
  maxCount: number;
  onConfirm: () => void;
}

const ViolationModal = ({
  type,
  count,
  onConfirm,
  maxCount,
}: ViolationModalProps) => {
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
            : `Bạn vừa rời khỏi màn hình thi. Vi phạm: ${count}/${maxCount}`}
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
