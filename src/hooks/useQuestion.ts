import { useQuery } from "@tanstack/react-query";
import { questionService } from "@/services/api/question.service";

// 1. Hook dùng cho trang Danh sách
export const useQuestions = () => {
  const query = useQuery({
    queryKey: ["cauhois"],
    queryFn: questionService.getAll,
    select: (res) => res.data,
  });

  return {
    questions: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

// 2. Hook dùng cho trang Chi tiết hoặc Modal
export const useQuestionDetail = (id: number | undefined) => {
  const query = useQuery({
    queryKey: ["cauhois", id],
    queryFn: () => questionService.getById(id!),
    // Chỉ chạy query này nếu có id truyền vào
    enabled: !!id,
    select: (res) => res.data,
    // Giữ dữ liệu cũ trong khi đang fetch dữ liệu mới (tránh màn hình trắng)
    placeholderData: (previousData) => previousData,
  });

  return {
    question: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching, // Đang lấy lại dữ liệu ngầm
    isError: query.isError,
  };
};
