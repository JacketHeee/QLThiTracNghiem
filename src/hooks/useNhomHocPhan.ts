import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { nhomHocPhanService } from "@/services/api/nhomHocPhan.service";
import type { NhomHocPhanUpdate } from "@/types";

export const useNhomHocPhan = () => {
  // Lấy danh sách
  const query = useQuery({
    queryKey: ["nhomhocphans"],
    queryFn: nhomHocPhanService.getAll,
    select: (res) => res.data.filter((item) => !item.isDeleted),
  });

  return {
    nhomHocPhans: query.data || [],
    isLoading: query.isLoading,
  };
};

export const useNhomHocPhanStudent = (studentId: number) => {
  const query = useQuery({
    // QueryKey chứa ID để khi đổi sinh viên dữ liệu sẽ tự làm mới
    queryKey: ["nhomhocphans", "student", studentId],
    queryFn: () => nhomHocPhanService.getByStudent(studentId),
    select: (res) => res.data,
    enabled: !!studentId, // Chỉ chạy khi có studentId
  });

  return {
    nhomHocPhans: query.data?.nhom_hoc_phans,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

export const useNhomHocPhanDetail = (id: number) => {
  const query = useQuery({
    queryKey: ["nhomhocphans", id],
    queryFn: () => nhomHocPhanService.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  });

  return {
    nhomHocPhan: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};

export const useNhomHocPhanGiangVien = (id: number) => {
  const query = useQuery({
    queryKey: ["nhomhocphans", "giangvien", id],
    queryFn: () => nhomHocPhanService.getGiangVien(id),
    select: (res) => res.data,
    enabled: !!id,
  });

  return {
    giangVien: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};

export const useNhomHocPhanDeKiemTra = (id: number) => {
  const query = useQuery({
    queryKey: ["nhomhocphans", "dekiemtra", id],
    queryFn: () => nhomHocPhanService.getDeKiemTra(id),
    select: (res) => res.data,
    enabled: !!id,
  });

  return {
    deKiemTras: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};

export const useNhomHocPhanSinhViens = (id: number) => {
  const query = useQuery({
    queryKey: ["nhomhocphans", "sinhviens", id],
    queryFn: () => nhomHocPhanService.getDanhSachSinhVien(id),
    select: (res) => ({
      sinhViens: res.success ? res.data?.sinhViens || [] : [],
      message: res.message,
      success: res.success,
    }),
    enabled: !!id,
  });

  return {
    sinhViens: query.data?.sinhViens || [],
    message: query.data?.message,
    success: query.data?.success ?? true,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};

// Mutations
export const useCreateNhomHocPhan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: nhomHocPhanService.create,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["nhomhocphans"] }),
  });
};

export const useUpdateNhomHocPhan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: NhomHocPhanUpdate }) =>
      nhomHocPhanService.update(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["nhomhocphans"] }),
  });
};

export const useDeleteNhomHocPhan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: nhomHocPhanService.delete,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["nhomhocphans"] }),
  });
};

export const useJoinNhomHocPhan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: nhomHocPhanService.joinGroup,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["nhomhocphans"] }),
  });
};

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId }: { groupId: number }) =>
      nhomHocPhanService.resetInviteCode(groupId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["nhomhocphans"] }),
  });
};

export const useAddSinhVienToNhom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { sinhVienId: number } }) =>
      nhomHocPhanService.addSinhVienToNhom(id, data),
    onSuccess: (_, { id }) =>
      queryClient.invalidateQueries({
        queryKey: ["nhomhocphans", "sinhviens", id],
      }),
  });
};

export const useRemoveSinhVienFromNhom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      groupId,
      sinhVienId,
    }: {
      groupId: number;
      sinhVienId: number;
    }) => nhomHocPhanService.removeSinhVienFromNhom(groupId, sinhVienId),
    onSuccess: (_, { groupId }) =>
      queryClient.invalidateQueries({
        queryKey: ["nhomhocphans", "sinhviens", groupId],
      }),
  });
};

export const useExportSinhVienList = () => {
  return useMutation({
    mutationFn: ({ groupId }: { groupId: number }) =>
      nhomHocPhanService.exportSinhVienList(groupId),
    onSuccess: (blob, { groupId }) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `danh-sach-sinh-vien-nhom-${groupId}.xlsx`; // Assuming Excel format
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
};

export const useImportSinhVienList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, file }: { groupId: number; file: File }) =>
      nhomHocPhanService.importSinhVienList(groupId, file),
    onSuccess: (_, { groupId }) =>
      queryClient.invalidateQueries({
        queryKey: ["nhomhocphans", "sinhviens", groupId],
      }),
  });
};
