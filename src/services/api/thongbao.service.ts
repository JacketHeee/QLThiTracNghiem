import type { ApiResponse, ThongBao } from "@/types";
import axiosClient from "./axios";

export const thongBaoService = {
  getAll: (): Promise<ApiResponse<ThongBao[]>> => axiosClient.get("/thongbaos"),
};
