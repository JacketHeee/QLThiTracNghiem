import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  BaiLam,
  Question,
  ExamResponseData,
  LogBaiLam,
  DeThi,
} from "@/types";

interface ExamState {
  currentExam: BaiLam | null;
  uiStatus: "INSTRUCTION" | "DOING" | "RESULT";
  mode: "STUDENT" | "PREVIEW";
  // Map hỗ trợ truy vấn nhanh ID đáp án đã chọn theo ID câu hỏi
  answers: Record<number, number | null>;
  examResult: ExamResponseData | null;
}

interface ExamActions {
  // Khởi tạo bài thi & đồng bộ đáp án nếu là bài thi đang làm dở
  initExam: (baiThi: BaiLam, mode?: "STUDENT" | "PREVIEW") => void;

  // Bắt đầu làm bài: Cập nhật status & thời gian bắt đầu
  startExam: () => void;

  // Cập nhật đáp án: Vừa cập nhật Map answers, vừa cập nhật mảng chitiet_bailams
  updateAnswer: (cauHoiId: number, dapAnId: number) => void;

  // Ghi nhận vi phạm chuyển Tab vào LogBaiLam
  addViolation: () => void;

  // Kết thúc bài thi: Tự động tính điểm hệ 10, số câu đúng và đánh dấu đúng/sai từng câu
  finishExam: (questions: Question[]) => void;

  setFinalResult: (result: ExamResponseData) => void;

  // Xóa sạch dữ liệu (dùng khi thoát hẳn hoặc làm bài mới)
  resetExam: () => void;
}

export const useExamStore = create<ExamState & ExamActions>()(
  persist(
    (set, get) => ({
      currentExam: null,
      uiStatus: "INSTRUCTION",
      mode: "STUDENT",
      answers: {},
      examResult: null,

      initExam: (baiThi, mode = "STUDENT") => {
        const initialAnswers: Record<number, number | null> = {};

        // Nếu bài thi đã có chi tiết (trường hợp làm dở rồi quay lại)
        baiThi.chitiet_bailams?.forEach((detail) => {
          initialAnswers[detail.cauHoiId] = detail.dapAnId;
        });

        set({
          currentExam: baiThi,
          mode,
          answers: initialAnswers,
          examResult: null, // Reset kết quả cũ nếu có
          uiStatus: baiThi.status === "DA_NOP" ? "RESULT" : "INSTRUCTION",
        });
      },

      startExam: () => {
        const { currentExam } = get();
        if (!currentExam) return;

        set({
          uiStatus: "DOING",
          currentExam: {
            ...currentExam,
            status: "DANG_LAM",
            thoiGianBatDau:
              currentExam.thoiGianBatDau || new Date().toISOString(),
          },
        });
      },

      updateAnswer: (cauHoiId, dapAnId) =>
        set((state) => {
          if (!state.currentExam) return state;

          const timestamp = new Date().toISOString();
          const details = [...(state.currentExam.chitiet_bailams || [])];
          const idx = details.findIndex((d) => d.cauHoiId === cauHoiId);

          // Cập nhật mảng chitiet_bailams để sẵn sàng gửi lên server nếu cần
          if (idx > -1) {
            details[idx] = { ...details[idx], dapAnId, updateAt: timestamp };
          } else {
            details.push({
              baiLamId: state.currentExam.id,
              cauHoiId,
              dapAnId,
              isCorrectChooser: false,
              diem: 0,
              updateAt: timestamp,
            });
          }

          return {
            answers: { ...state.answers, [cauHoiId]: dapAnId },
            currentExam: { ...state.currentExam, chitiet_bailams: details },
          };
        }),

      addViolation: () =>
        set((state) => {
          if (!state.currentExam) return state;

          // Xử lý logic logBaiLam (Object thay vì mảng để dễ dùng ở FE)
          const currentLog: LogBaiLam = state.currentExam.logBaiLam || {
            logId: 0,
            baiLamId: state.currentExam.id,
            soLanChuyenTab: 0,
            createdAt: new Date().toISOString(),
          };

          return {
            currentExam: {
              ...state.currentExam,
              logBaiLam: {
                ...currentLog,
                soLanChuyenTab: currentLog.soLanChuyenTab + 1,
              },
            },
          };
        }),

      setFinalResult: (result) => {
        set((state) => {
          const serverAnswers: Record<number, number | null> = {};

          // 1. Nếu server có trả về danh sách câu hỏi (có kèm đáp án đã chọn ghi nhận trên server)
          if (result.cauHois && result.cauHois.length > 0) {
            result.cauHois.forEach((q) => {
              serverAnswers[q.id] = q.dapAnDaChon ?? null;
            });
          } else {
            // 2. Nếu server ẩn chi tiết (cauHois trống), ta dùng lại answers hiện tại trong Store
            // để người dùng vẫn thấy được mình đã tích vào đâu (nếu cần hiển thị ở màn hình kết quả)
            Object.assign(serverAnswers, state.answers);
          }

          return {
            examResult: result, // Chứa thông tin tổng điểm, số câu đúng từ Server
            currentExam: result.baiLam, // Thông tin bài làm (thời gian nộp, trạng thái DA_NOP)
            answers: serverAnswers,
            uiStatus: "RESULT",
          };
        });
      },

      finishExam: (questions: Question[]) => {
        const { currentExam, answers } = get();
        if (!currentExam) return;

        // 1. Tính toán kết quả ngay tại Client cho mode Preview
        let soCauDung = 0;
        const processedQuestions = questions.map((q) => {
          const selectedAnswerId = answers[q.id];
          // Tìm đáp án đúng trong danh sách câu trả lời của câu hỏi
          const correctAnswer = q.cau_tra_lois.find((a) => a.isCorrectAnswer);
          const isCorrect = selectedAnswerId === correctAnswer?.id;

          if (isCorrect) soCauDung++;

          return {
            ...q,
            dapAnDaChon: selectedAnswerId, // Gán vào để trang Result hiển thị được
          };
        });

        const tongDiem = (soCauDung / questions.length) * 10;

        const mockBaiLam: BaiLam = {
          ...currentExam,
          status: "DA_NOP",
          tongDiem: Number(tongDiem.toFixed(2)),
          soCauDung,
          thoiGianNopBai: new Date().toISOString(),
        };

        set({
          uiStatus: "RESULT",
          currentExam: mockBaiLam,
          // Tạo examResult giả lập để trang Result dùng chung 1 logic render
          examResult: {
            baiLam: mockBaiLam,
            deThi: get().examResult?.deThi || ({} as DeThi), // Lấy deThi hiện tại
            cauHois: processedQuestions,
          },
        });
      },

      resetExam: () =>
        set({
          currentExam: null,
          examResult: null,
          answers: {},
          uiStatus: "INSTRUCTION",
          mode: "STUDENT",
        }),
    }),
    {
      name: "mahi-exam-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
