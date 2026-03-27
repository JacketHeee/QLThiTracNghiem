import type { ApiResponse, Role, RoleDetail } from "@/types";
import axiosClient from "./axios";

export const roleService = {
  getAll: (): Promise<ApiResponse<Role[]>> => axiosClient.get("/roles"),

  getById: (id: number): Promise<ApiResponse<RoleDetail>> =>
    axiosClient.get(`/roles/${id}`),

  //   create: (data: Omit<Subject, "id">): Promise<ApiResponse<Subject>> =>
  //     axiosClient.post("/monhocs", data),

  //   update: (id: number, data: Partial<Subject>): Promise<ApiResponse<Subject>> =>
  //     axiosClient.put(`/monhocs/${id}`, data),

  //   delete: (id: number): Promise<ApiResponse<boolean>> =>
  //     axiosClient.delete(`/monhocs/${id}`),
};
