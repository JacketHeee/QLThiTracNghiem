import { useQuery } from "@tanstack/react-query";
import { roleService } from "@/services/api/role.service";

export const useRole = () => {
  // Lấy danh sách
  const query = useQuery({
    queryKey: ["roles"],
    queryFn: roleService.getAll,
    select: (res) => res.data,
  });

  return {
    roles: query.data || [],
    isLoading: query.isLoading,
  };
};
