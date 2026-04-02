import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { BaiThi, Question, ChiTietBaiLam } from "@/types";

interface ExamState {
  currentExam: BaiThi | null;
  uiStatus: "INSTRUCTION" | "DOING" | "RESULT";
  mode: "STUDENT" | "PREVIEW";
  // Map hỗ trợ truy vấn nhanh ID đáp án đã chọn theo ID câu hỏi
  answers: Record<number, number | null>;
}

interface ExamActions {
  // Khởi tạo bài thi & đồng bộ đáp án nếu là bài thi đang làm dở
  initExam: (baiThi: BaiThi, mode?: "STUDENT" | "PREVIEW") => void;

  // Bắt đầu làm bài: Cập nhật status & thời gian bắt đầu
  startExam: () => void;

  // Cập nhật đáp án: Vừa cập nhật Map answers, vừa cập nhật mảng chitiet_bailams
  updateAnswer: (cauHoiId: number, dapAnId: number) => void;

  // Ghi nhận vi phạm chuyển Tab vào LogBaiLam
  addViolation: () => void;

  // Kết thúc bài thi: Tự động tính điểm hệ 10, số câu đúng và đánh dấu đúng/sai từng câu
  finishExam: (questions: Question[]) => void;

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

      initExam: (baiThi, mode = "STUDENT") => {
        const initialAnswers: Record<number, number | null> = {};
        baiThi.chitiet_bailams?.forEach((detail) => {
          initialAnswers[detail.cauHoiId] = detail.dapAnId;
        });

        set({
          currentExam: baiThi,
          mode,
          answers: initialAnswers,
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
            // Chỉ set nếu chưa có (tránh ghi đè khi F5)
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

          if (idx > -1) {
            details[idx] = { ...details[idx], dapAnId, updateAt: timestamp };
          } else {
            details.push({
              baiLamId: state.currentExam.id,
              cauHoiId,
              dapAnId,
              isCorrectChooser: false, // Sẽ được tính lại khi Finish
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

          const currentLog = state.currentExam.logBaiLam || {
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

      finishExam: (questions) => {
        const { currentExam } = get();
        if (!currentExam || !questions.length) return;

        let correctCount = 0;
        const totalQuestions = questions.length;
        const scorePerQuestion = 10 / totalQuestions;

        // Map lại chitiet_bailams để đánh dấu đúng/sai và tính điểm từng câu
        const finalDetails: ChiTietBaiLam[] = currentExam.chitiet_bailams.map(
          (detail) => {
            const question = questions.find((q) => q.id === detail.cauHoiId);
            const correctId = question?.cau_tra_lois?.find(
              (a) => a.isCorrectAnswer
            )?.id;
            const isCorrect = detail.dapAnId === correctId;

            if (isCorrect) correctCount++;

            return {
              ...detail,
              isCorrectChooser: isCorrect,
              diem: isCorrect ? scorePerQuestion : 0,
            };
          }
        );

        const finalScore = Number((correctCount * scorePerQuestion).toFixed(2));

        set({
          uiStatus: "RESULT",
          currentExam: {
            ...currentExam,
            chitiet_bailams: finalDetails,
            status: "DA_NOP",
            thoiGianNopBai: new Date().toISOString(),
            soCauDung: correctCount,
            tongDiem: finalScore,
          },
        });
      },

      resetExam: () =>
        set({ currentExam: null, answers: {}, uiStatus: "INSTRUCTION" }),
    }),
    {
      name: "mahi-exam-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
