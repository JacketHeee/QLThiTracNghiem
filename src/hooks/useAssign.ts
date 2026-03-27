import { useQuery } from "@tanstack/react-query";
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
