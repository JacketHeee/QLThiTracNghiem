import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { thongBaoService } from "@/services/api/thongbao.service";

export const useThongBao = () => {
  // Lấy danh sách
  const query = useQuery({
    queryKey: ["thongbaos"],
    queryFn: thongBaoService.getAll,
    select: (res) => res.data,
  });

  const queryClient = useQueryClient();

  // Thêm mới
  const createMutation = useMutation({
    mutationFn: thongBaoService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["thongbaos"] }),
  });

  // Cập nhật
  const updateMutation = useMutation({
    mutationFn: thongBaoService.update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["thongbaos"] }),
  });

  // Xóa
  const deleteMutation = useMutation({
    mutationFn: thongBaoService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["thongbaos"] }),
  });

  return {
    thongBaos: query.data || [],
    isLoading: query.isLoading,
    createThongBao: createMutation.mutateAsync,
    updateThongBao: updateMutation.mutateAsync,
    deleteThongBao: deleteMutation.mutateAsync,
    isProcessing:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};

// "nhomhocphan", "thongbaos", id
// Thêm mới trong nhóm

export const useCreateThongBaoNhom = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: thongBaoService.create, // API thêm mới

    onSuccess: (_, variables) => {
      const nhomId = variables.nhomHocPhanIds?.[0]; // lấy mã duy nhất trả về
      queryClient.invalidateQueries({
        queryKey: ["nhomhocphan", "thongbaos", nhomId],
      });
    },
  });

  return {
    createThongBaoNhom: mutation.mutateAsync, // dùng await nếu cần
    isCreatingTBN: mutation.isPending,
    isCreateErrorTBN: mutation.isError,
    isCreateSuccessTBN: mutation.isSuccess,
  };
};

//xóa trong nhóm
export const useDeleteThongBaoNhom = (nhomId?: number) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: thongBaoService.delete, // API xóa

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["nhomhocphan", "thongbaos", nhomId],
      });
    },
  });

  return {
    deleteThongBaoNhom: mutation.mutate, // gọi bình thường
    deleteThongBaoNhomAsync: mutation.mutateAsync, // dùng await nếu cần
    isDeletingThongBaoNhom: mutation.isPending,
    isDeleteThongBaoNhomError: mutation.isError,
    isDeleteSuccess: mutation.isSuccess,
  };
};
