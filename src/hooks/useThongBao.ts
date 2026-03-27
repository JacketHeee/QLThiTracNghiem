import { useQuery } from "@tanstack/react-query";
import { thongBaoService } from "@/services/api/thongbao.service";

export const useThongBao = () => {
  // Lấy danh sách
  const query = useQuery({
    queryKey: ["thongbaos"],
    queryFn: thongBaoService.getAll,
    select: (res) => res.data,
  });

  return {
    thongBaos: query.data || [],
    isLoading: query.isLoading,
  };
};
