import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const useQuestionsPrivate = (id?: number) => {
  const query = useQuery({
    queryKey: ["cauhois", "private", id],
    queryFn: () => questionService.getWithPrivate(id!),
    enabled: !!id,
    select: (res) => res.data,
  });

  return {
    questionsprivate: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

// Thêm mới
export const useCreateCauHoi = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: questionService.create, // API thêm mới

    onSuccess: () => {
      // Sau khi thêm thành công → gọi lại danh sách roles
      queryClient.invalidateQueries({ queryKey: ["cauhois"] });
    },
  });

  return {
    createCauHoi: mutation.mutateAsync, // dùng await nếu cần
    isCreating: mutation.isPending,
    isCreateError: mutation.isError,
    isCreateSuccess: mutation.isSuccess,
  };
};

// Sửa
export const useUpdateCauHoi = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: questionService.update, // API Sửa

    onSuccess: () => {
      // Sau khi Sửa thành công → gọi lại danh sách roles
      queryClient.invalidateQueries({ queryKey: ["cauhois"] });
    },
  });

  return {
    updateCauHoi: mutation.mutateAsync, // dùng await nếu cần
    isUpdating: mutation.isPending,
    isUpdateError: mutation.isError,
    isUpdateSuccess: mutation.isSuccess,
  };
};

// Xóa
export const useDeleteCauHoi = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: questionService.delete, // API xóa

    onSuccess: () => {
      // Sau khi xóa thành công → reload danh sách roles
      queryClient.invalidateQueries({ queryKey: ["cauhois"] });
    },
  });

  return {
    deleteCauHoi: mutation.mutateAsync, // dùng await nếu cần
    isDeleting: mutation.isPending,
    isDeleteError: mutation.isError,
    isDeleteSuccess: mutation.isSuccess,
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
