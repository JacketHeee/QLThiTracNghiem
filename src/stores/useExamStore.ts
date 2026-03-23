import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ExamState {
  status: "INSTRUCTION" | "DOING" | "RESULT";
  mode: "STUDENT" | "PREVIEW";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answers: Record<string, any>;
  violationCount: number;
  startTime: number | null;
  setMode: (mode: "STUDENT" | "PREVIEW") => void;
  startExam: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateAnswer: (questionId: string, value: any) => void;
  addViolation: () => void;
  finishExam: () => void;
  resetExam: () => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set) => ({
      status: "INSTRUCTION",
      mode: "STUDENT",
      answers: {},
      violationCount: 0,
      startTime: null,
      setMode: (mode) => set({ mode }),
      startExam: () => set({ status: "DOING", startTime: Date.now() }),
      updateAnswer: (qId, val) =>
        set((s) => ({ answers: { ...s.answers, [qId]: val } })),
      addViolation: () =>
        set((s) => ({ violationCount: s.violationCount + 1 })),
      finishExam: () => set({ status: "RESULT" }),
      resetExam: () =>
        set({
          status: "INSTRUCTION",
          answers: {},
          violationCount: 0,
          startTime: null,
        }),
    }),
    { name: "mahi-exam-storage" }
  )
);
