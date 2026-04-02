import type { CauHinhThi, DeThi, Question } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface DeThiState {
  testData: Partial<DeThi> | null;
}

interface DeThiActions {
  initTestData: () => void;

  setTestData: (data: Partial<DeThi> | null) => void;

  updateTestData: (fields: Partial<DeThi>) => void;

  updateCauHinh: (config: Partial<CauHinhThi>) => void;

  // Actions cho Questions
  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Question) => void;
  removeQuestion: (questionId: number) => void;
  moveQuestion: (index: number, direction: "up" | "down") => void;

  resetStore: () => void;
}

const initialState: DeThiState = {
  testData: null,
};

export const useDeThiStore = create<DeThiState & DeThiActions>()(
  persist(
    (set) => ({
      ...initialState,

      initTestData: () => {
        const defaultData: Partial<DeThi> = {
          tenDe: "",
          thoiGianBatDau: new Date().toISOString(),
          thoiGianKetThuc: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // Mặc định sau 1 tiếng
          thoiGianLamBai: 60,
          nhom_hoc_phans: [],
          cau_hois: [],
          cau_hinh_thi: {
            cauHinhId: -1,
            deThiId: -1,
            hasMonitoring: false,
            allowCopy: true,
            allowPrint: true,
            isEnableResume: false,
            shuffleQuestions: true,
            shuffleAnswers: true,
            showScore: true,
            showDetailResults: false,
            isLimitSwitchTab: false,
            tabSwitchLimit: 3,
            messageOnWarning: "Bạn đã vi phạm quy chế thi!",
          },
        };
        set({ testData: defaultData });
      },

      setTestData: (data) => set({ testData: data }),

      updateTestData: (fields) =>
        set((state) => ({
          testData: state.testData
            ? { ...state.testData, ...fields }
            : (fields as DeThi),
        })),

      updateCauHinh: (newConfig) =>
        set((state) => ({
          testData: state.testData
            ? {
                ...state.testData,
                cau_hinh_thi: {
                  ...(state.testData.cau_hinh_thi || {}),
                  ...newConfig,
                } as CauHinhThi,
              }
            : state.testData,
        })),

      // Quản lý danh sách câu hỏi
      setQuestions: (questions) =>
        set((state) => ({
          testData: state.testData
            ? { ...state.testData, cau_hois: questions }
            : state.testData,
        })),

      addQuestion: (question) =>
        set((state) => {
          if (!state.testData) return state;
          const currentQuestions = state.testData.cau_hois || [];

          // Tránh thêm trùng câu hỏi dựa trên ID
          if (currentQuestions.some((q) => q.id === question.id)) {
            return state;
          }

          return {
            testData: {
              ...state.testData,
              cau_hois: [...currentQuestions, question],
            },
          };
        }),

      removeQuestion: (questionId) =>
        set((state) => ({
          testData: state.testData
            ? {
                ...state.testData,
                cau_hois: state.testData.cau_hois?.filter(
                  (q) => q.id !== questionId
                ),
              }
            : state.testData,
        })),

      moveQuestion: (index, direction) =>
        set((state) => {
          if (!state.testData?.cau_hois) return state;

          const newQuestions = [...state.testData.cau_hois];
          const targetIndex = direction === "up" ? index - 1 : index + 1;

          // Kiểm tra điều kiện biên
          if (targetIndex < 0 || targetIndex >= newQuestions.length) {
            return state;
          }

          // Tráo đổi vị trí (Swap)
          [newQuestions[index], newQuestions[targetIndex]] = [
            newQuestions[targetIndex],
            newQuestions[index],
          ];

          return {
            testData: { ...state.testData, cau_hois: newQuestions },
          };
        }),

      // Xóa sạch bách khi xong việc hoặc thoát luồng
      resetStore: () => set(initialState),
    }),
    {
      name: "dethi-storage",
      storage: createJSONStorage(() => localStorage),
      // Bạn có thể chọn chỉ lưu ID thay vì lưu cả Object to đùng nếu muốn:
      // partialize: (state) => ({ currentDeThiId: state.currentDeThiId }),
    }
  )
);
