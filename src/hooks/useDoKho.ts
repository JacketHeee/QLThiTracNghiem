import { useQuery } from "@tanstack/react-query";
import { doKhoService } from "@/services/api/dokho.service";

export const useDoKho = () => {
  // Lấy danh sách
  const query = useQuery({
    queryKey: ["dokhos"],
    queryFn: doKhoService.getAll,
    select: (res) => res.data,
  });

  return {
    doKhos: query.data || [],
    isLoading: query.isLoading,
  };
};
