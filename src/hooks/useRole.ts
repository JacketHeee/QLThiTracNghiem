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

export const useRoleDetail = (id: number | undefined) => {
  const query = useQuery({
    queryKey: ["roles", id],
    queryFn: () => roleService.getById(id!),
    // Chỉ chạy query này nếu có id truyền vào
    enabled: !!id,
    select: (res) => res.data,
    // Giữ dữ liệu cũ trong khi đang fetch dữ liệu mới (tránh màn hình trắng)
    placeholderData: (previousData) => previousData,
  });

  return {
    role: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching, // Đang lấy lại dữ liệu ngầm
    isError: query.isError,
  };
};
