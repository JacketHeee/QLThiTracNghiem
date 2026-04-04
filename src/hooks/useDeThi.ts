import { dethiService } from "@/services/api/dethi.service";
import type { CreateDeThiPayload } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDeThi = () => {
  const query = useQuery({
    queryKey: ["dethis"],
    queryFn: dethiService.getAll,
    select: (res) => res.data,
  });

  return {
    dethis: query.data || [],
    isLoading: query.isLoading,
  };
};

export const useDeThiSvienNhp = (
  nhomHocPhanId?: number,
  studentId?: number
) => {
  const query = useQuery({
    queryKey: ["dethis", nhomHocPhanId, studentId],
    queryFn: () =>
      dethiService.getByNhomHocPhanStudent(nhomHocPhanId!, studentId!),
    enabled: !!nhomHocPhanId && !!studentId, // chỉ chạy khi có đủ params
    select: (res) => res.data || [],
  });

  return {
    dethis: query.data || null,
    isLoading: query.isLoading,
  };
};

export const useDeThiStudent = (studentId: number | null) => {
  const query = useQuery({
    queryKey: ["dethis", "student", studentId],
    queryFn: () => dethiService.getByStudentId(studentId!),
    select: (res) => res.data || [],
    enabled: !!studentId, // Chỉ chạy khi có ID
  });

  return {
    dethis: query.data || [],
    isLoading: query.isLoading,
  };
};

export const useDeThiDetail = (
  deThiId: number | null,
  options?: { enabled?: boolean }
) => {
  const query = useQuery({
    queryKey: ["dethis", "detail", deThiId],
    queryFn: () => dethiService.getById(deThiId!),
    select: (res) => res.data,
    enabled: !!deThiId && options?.enabled !== false, // Chỉ chạy khi có ID đề thi
    staleTime: 1000 * 60 * 5, // Dữ liệu đề thi ít thay đổi, có thể cache 5 phút
  });

  return {
    deThi: query.data,
    // Truy cập trực tiếp vào cấu hình thi từ dữ liệu trả về
    cauHinh: query.data?.cau_hinh_thi,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};

/**
 * Hook xử lý Tạo mới đề thi
 */
export const useCreateDeThi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDeThiPayload) => dethiService.create(payload),
    onSuccess: () => {
      // Làm mới danh sách đề thi sau khi tạo thành công
      queryClient.invalidateQueries({ queryKey: ["dethis"] });
      // toast.success("Tạo đề thi thành công!");
      console.log("Tạo đề thi thành công");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      // toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo đề thi");
      console.log(
        error?.response?.data?.message || "Có lỗi xảy ra khi tạo đề thi"
      );
    },
  });
};

/**
 * Hook xử lý Cập nhật đề thi
 */
export const useUpdateDeThi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: CreateDeThiPayload;
    }) => dethiService.update(id, payload),
    onSuccess: (_, variables) => {
      // Làm mới danh sách và chi tiết đề thi vừa sửa
      queryClient.invalidateQueries({ queryKey: ["dethis"] });
      queryClient.invalidateQueries({
        queryKey: ["dethis", "detail", variables.id],
      });
      // toast.success("Cập nhật đề thi thành công!");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    onError: (_error: any) => {
      // toast.error(
      //   error?.response?.data?.message || "Không thể cập nhật đề thi"
      // );
    },
  });
};

/**
 * Hook xử lý Xóa đề thi
 */
export const useDeleteDeThi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // 1. Mutation function gọi tới service
    mutationFn: (id: number) => dethiService.delete(id),

    // 2. Xử lý khi thành công
    onSuccess: (_response, id) => {
      // Làm mới danh sách đề thi (để mất dòng vừa xóa trên table/list)
      queryClient.invalidateQueries({ queryKey: ["dethis"] });

      // Xóa cache chi tiết của đề thi đó (để giải phóng bộ nhớ)
      queryClient.removeQueries({ queryKey: ["dethis", "detail", id] });

      console.log(`Xóa đề thi ID: ${id} thành công`);
      // toast.success("Xóa đề thi thành công!");
    },

    // 3. Xử lý khi lỗi
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMsg =
        error?.response?.data?.message || "Không thể xóa đề thi này";
      console.error("Lỗi xóa đề thi:", errorMsg);
      // toast.error(errorMsg);
    },
  });
};
