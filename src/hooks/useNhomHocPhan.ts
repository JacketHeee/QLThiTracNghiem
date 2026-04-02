import { useQuery } from "@tanstack/react-query";
import { nhomHocPhanService } from "@/services/api/nhomHocPhan.service";

export const useNhomHocPhan = () => {
  // Lấy danh sách
  const query = useQuery({
    queryKey: ["nhomhocphans"],
    queryFn: nhomHocPhanService.getAll,
    select: (res) => res.data,
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

export const useGetNhomWithThongBao = (id: number) => {
  const query = useQuery({
    queryKey: ["nhomhocphan", "thongbaos", id],
    queryFn: () => nhomHocPhanService.getWithThongBaoDeThi(id),
    select: (res) => res.data,
  });

  return {
    nhomHocPhan: query.data || null,
    isLoading: query.isLoading,
  };
};
