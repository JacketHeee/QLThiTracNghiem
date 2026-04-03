import { useMutation, useQueryClient } from "@tanstack/react-query";
import { examService } from "@/services/api/exam.service";
import { useExamStore } from "@/stores/useExamStore";
import { useDeThiStore } from "@/stores/useDeThi.store";
import { dethiService } from "@/services/api/dethi.service";
export const useExamActions = () => {
  const queryClient = useQueryClient();
  const {
    initExam,
    updateAnswer: updateStoreAnswer,
    setFinalResult,
  } = useExamStore();
  const { updateTestData } = useDeThiStore();

  // Hook 1: Bắt đầu bài thi
  const startExamMutation = useMutation({
    mutationFn: async ({
      thiSinhId,
      deThiId,
    }: {
      thiSinhId: number;
      deThiId: number;
    }) => {
      // Lấy chi tiết đề thi trước (để có câu hỏi)
      const deThiDetail = await queryClient.fetchQuery({
        queryKey: ["dethis", "detail", deThiId],
        queryFn: async () => {
          console.log("Fetching detail...");
          const res = await dethiService.getById(deThiId);
          return res.data; // Phải return dữ liệu ở đây
        },
      });

      // Gọi API tạo bản ghi bài làm
      const startRes = await examService.startTest({ thiSinhId, deThiId });

      return { deThiDetail, baiLam: startRes.data };
    },
    onSuccess: (data) => {
      // Cập nhật vào các Store
      console.log(data.baiLam);
      updateTestData({ ...data.deThiDetail });
      initExam(data.baiLam, "STUDENT");
    },
  });

  // Hook 2: Cập nhật đáp án (với logic debounce nên đặt ở đây hoặc component)
  const updateAnswerMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ baiLamId, answers }: { baiLamId: number; answers: any[] }) =>
      examService.updateStudentTest(baiLamId, answers),
    onMutate: async ({ answers }) => {
      // Optimistic Update: Cập nhật store local ngay lập tức trước khi API phản hồi
      const { cauHoiId, dapAnId } = answers[0];
      updateStoreAnswer(cauHoiId, dapAnId);
    },
  });

  // Hook 3: Nộp bài
  const submitExamMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ baiLamId, answers }: { baiLamId: number; answers: any[] }) =>
      examService.submitTest(baiLamId, answers),
  });

  // Hook 4: Cập nhật vi phạm
  const updateViolationMutation = useMutation({
    mutationFn: ({ logId, count }: { logId: number; count: number }) =>
      examService.updateViolationLog(logId, { soLanChuyenTab: count }),
    onSuccess: () => {
      console.log("Đã đồng bộ số lần vi phạm lên server");
    },
  });

  /**
   * Hook 5: Xem lại kết quả (Review)
   * Dùng khi user truy cập thẳng vào link kết quả hoặc sau khi nộp bài mà cần fetch lại dữ liệu mới nhất
   */
  const reviewExamMutation = useMutation({
    mutationFn: (baiLamId: number) => examService.getReviewResult(baiLamId),
    onSuccess: (res) => {
      // Đồng bộ kết quả (bao gồm cả trường hợp ẩn chi tiết câu hỏi) vào Store
      setFinalResult(res.data);
    },
  });

  return {
    startExam: startExamMutation.mutateAsync,
    isStarting: startExamMutation.isPending,
    updateAnswer: updateAnswerMutation.mutate,
    submitExam: submitExamMutation.mutateAsync,
    isSubmitting: submitExamMutation.isPending,
    updateViolation: updateViolationMutation.mutate,
    // Expose thêm action review
    reviewExam: reviewExamMutation.mutateAsync,
  };
};
