import { dethiService } from "@/services/api/dethi.service";
import { useQuery } from "@tanstack/react-query";

export const useDeThi = () => {
  const query = useQuery({
    queryKey: ["roles"],
    queryFn: dethiService.getAll,
    select: (res) => res.data,
  });

  return {
    dethis: query.data || [],
    isLoading: query.isLoading,
  };
};

export const useDeThiStudent = (studentId: number) => {
  const query = useQuery({
    queryKey: ["dethis", "student", studentId],
    queryFn: () => dethiService.getByStudentId(studentId),
    select: (res) => res.data || [],
    enabled: !!studentId, // Chỉ chạy khi có ID
  });

  return {
    dethis: query.data || [],
    isLoading: query.isLoading,
  };
};
