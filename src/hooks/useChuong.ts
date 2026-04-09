import { chuongService } from "@/services/api/chuong.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useChuongOfMonHoc = (monHocId?: number) => {
  const query = useQuery({
    queryKey: ["chuongs", "monhoc", monHocId],
    queryFn: () => chuongService.getByMonHoc({ monHocId }),
    select: (res) => res.data,
    enabled: !!monHocId,
  });

  return {
    chuongOfMonHoc: query.data || [],
    isLoading: query.isLoading,
  };
};

export const useUpdateChuong = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: chuongService.update, // API Sửa

    onSuccess: (data) => {
      const monHocId = data?.data.id;
      queryClient.invalidateQueries({
        queryKey: ["chuongs", "monhoc", monHocId],
      });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });

  return {
    updateChuong: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    isUpdateError: mutation.isError,
    isUpdateSuccess: mutation.isSuccess,
  };
};
