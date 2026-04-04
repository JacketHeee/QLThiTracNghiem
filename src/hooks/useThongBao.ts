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
