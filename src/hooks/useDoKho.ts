import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doKhoService } from "@/services/api/dokho.service";

export const useDoKho = () => {
  // Lấy danh sách
  const query = useQuery({
    queryKey: ["dokhos"],
    queryFn: doKhoService.getAll,
    select: (res) => res.data,
  });

  const queryClient = useQueryClient();

  // Thêm mới
  const createMutation = useMutation({
    mutationFn: doKhoService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dokhos"] }),
  });

  // Cập nhật
  const updateMutation = useMutation({
    mutationFn: doKhoService.update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dokhos"] }),
  });

  // Xóa
  const deleteMutation = useMutation({
    mutationFn: doKhoService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dokhos"] }),
  });

  return {
    doKhos: query.data || [],
    isLoading: query.isLoading,
    createDoKho: createMutation.mutateAsync,
    updateDoKho: updateMutation.mutateAsync,
    deleteDoKho: deleteMutation.mutateAsync,
    isProcessing:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};
