import type { ApiResponse, TaiKhoan } from "@/types";
import axiosClient from "./axios";

export const userService = {
  getAll: (): Promise<ApiResponse<TaiKhoan[]>> => axiosClient.get("/users"),

  getById: (id: number): Promise<ApiResponse<TaiKhoan>> =>
    axiosClient.get(`/users/${id}`),

  //   create: (data: Omit<Subject, "id">): Promise<ApiResponse<Subject>> =>
  //     axiosClient.post("/monhocs", data),

  //   update: (id: number, data: Partial<Subject>): Promise<ApiResponse<Subject>> =>
  //     axiosClient.put(`/monhocs/${id}`, data),

  //   delete: (id: number): Promise<ApiResponse<boolean>> =>
  //     axiosClient.delete(`/monhocs/${id}`),
};
