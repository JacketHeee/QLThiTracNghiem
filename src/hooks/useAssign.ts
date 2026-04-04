import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignService } from "@/services/api/assign.service";

export const useAssign = () => {
  // Lấy danh sách
  const query = useQuery({
    queryKey: ["phancongs"],
    queryFn: assignService.getAll,
    select: (res) => res.data,
  });

  return {
    assigns: query.data || [],
    isLoading: query.isLoading,
  };
};

export const useCreateAssign = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: assignService.createPhanCong, // API thêm mới

    onSuccess: () => {
      // Sau khi thêm thành công → gọi lại danh sách roles
      queryClient.invalidateQueries({ queryKey: ["phancongs"] });
    },
  });

  return {
    createPhanCong: mutation.mutate, // gọi bình thường
    createPhanCongAsync: mutation.mutateAsync, // dùng await nếu cần
    isCreating: mutation.isPending,
    isCreateError: mutation.isError,
    isCreateSuccess: mutation.isSuccess,
  };
};

export const useGetAssignOGvien = (id: number) => {
  const query = useQuery({
    queryKey: ["phancongs", id],
    queryFn: () => assignService.getOGvien(id),
    select: (res) => res.data,
  });

  return {
    subjects: query.data || [],
    isLoading: query.isLoading,
  };
};

// Xóa
export const useDeleteAssign = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: assignService.deletePhanCong,

    onSuccess: () => {
      // Sau khi xóa thành công → reload danh sách roles
      queryClient.invalidateQueries({ queryKey: ["phancongs"] });
    },
  });

  return {
    delete: mutation.mutate, // gọi bình thường
    deleteAsync: mutation.mutateAsync, // dùng await nếu cần
    isDeleting: mutation.isPending,
    isDeleteError: mutation.isError,
    isDeleteSuccess: mutation.isSuccess,
  };
};
