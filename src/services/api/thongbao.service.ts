import type {
  ApiResponse,
  ThongBao,
  ThongBaoCreate,
  ThongBaoResponse,
  ThongBaoUpdate,
} from "@/types";
import axiosClient from "./axios";

export const thongBaoService = {
  getAll: (): Promise<ApiResponse<ThongBaoResponse[]>> =>
    axiosClient.get("/thongbaos"),

  create: (data: ThongBaoCreate): Promise<ApiResponse<ThongBao>> =>
    axiosClient.post("/thongbaos", data),

  update: ({
    id,
    data,
  }: {
    id: number;
    data: ThongBaoUpdate;
  }): Promise<ApiResponse<ThongBao>> =>
    axiosClient.put(`/thongbaos/${id}`, data),

  delete: (id: number): Promise<ApiResponse<boolean>> =>
    axiosClient.delete(`/thongbaos/${id}`),

  deleteInGroup: (id: number): Promise<ApiResponse<boolean>> =>
    axiosClient.delete(`/thongbaos/${id}`),
};
