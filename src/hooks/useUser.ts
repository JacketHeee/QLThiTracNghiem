import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/api/user.service";

export const useUser = () => {
  // Lấy danh sách
  const query = useQuery({
    queryKey: ["users", "all"],
    queryFn: userService.getAll,
    select: (res) => res.data,
  });

  return {
    taikhoans: query.data || [],
    isLoading: query.isLoading,
  };
};

// Thêm mới
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: userService.create, // API thêm mới

    onSuccess: () => {
      // Sau khi thêm thành công → gọi lại danh sách roles
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    createUser: mutation.mutate, // gọi bình thường
    createUserAsync: mutation.mutateAsync, // dùng await nếu cần
    isCreating: mutation.isPending,
    isCreateError: mutation.isError,
    isCreateSuccess: mutation.isSuccess,
  };
};

// Sửa
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: userService.update, // API Sửa

    onSuccess: () => {
      // Sau khi Sửa thành công → gọi lại danh sách roles
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    updateUser: mutation.mutate, // gọi bình thường
    updateUserAsync: mutation.mutateAsync, // dùng await nếu cần
    isUpdating: mutation.isPending,
    isUpdateError: mutation.isError,
    isUpdateSuccess: mutation.isSuccess,
  };
};

// // Xóa
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: userService.delete, // API xóa

    onSuccess: () => {
      // Sau khi xóa thành công → reload danh sách roles
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    deleteUser: mutation.mutate, // gọi bình thường
    deleteUserAsync: mutation.mutateAsync, // dùng await nếu cần
    isDeleting: mutation.isPending,
    isDeleteError: mutation.isError,
    isDeleteSuccess: mutation.isSuccess,
  };
};

export const useResetPassUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: userService.resetPassword, // API xóa

    onSuccess: () => {
      // Sau khi xóa thành công → reload danh sách roles
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    resetPasswordUser: mutation.mutate, // gọi bình thường
    resetPasswordUserAsync: mutation.mutateAsync, // dùng await nếu cần
    isResetting: mutation.isPending,
    isResetError: mutation.isError,
    isResetSuccess: mutation.isSuccess,
  };
};

export const useGetGvien = () => {
  // Lấy danh sách
  const query = useQuery({
    queryKey: ["users", "gvien"],
    queryFn: userService.getGvien,
    select: (res) => res.data,
  });

  return {
    taikhoans: query.data || [],
    isLoading: query.isLoading,
  };
};
