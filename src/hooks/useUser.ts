import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/api/user.service";

export const useUser = () => {
  // Lấy danh sách
  const query = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    select: (res) => res.data,
  });

  return {
    taikhoans: query.data || [],
    isLoading: query.isLoading,
  };
};
