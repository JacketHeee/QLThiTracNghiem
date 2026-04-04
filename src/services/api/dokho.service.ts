import type { ApiResponse, DoKho } from "@/types";
import axiosClient from "./axios";

export const doKhoService = {
  getAll: (): Promise<ApiResponse<DoKho[]>> => axiosClient.get("/dokhos"),

  create: (data: DoKho): Promise<ApiResponse<DoKho>> =>
    axiosClient.post("/dokhos", data),

  update: ({
    id,
    data,
  }: {
    id: number;
    data: DoKho;
  }): Promise<ApiResponse<DoKho>> => axiosClient.put(`/dokhos/${id}`, data),

  delete: (id: number): Promise<ApiResponse<boolean>> =>
    axiosClient.delete(`/dokhos/${id}`),
};
