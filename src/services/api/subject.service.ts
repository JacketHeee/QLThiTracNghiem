import type { ApiResponse, Subject } from "@/types";
import axiosClient from "./axios";

export const subjectService = {
  getAll: (): Promise<ApiResponse<Subject[]>> => axiosClient.get("/monhocs"),

  getById: (id: number): Promise<ApiResponse<Subject>> =>
    axiosClient.get(`/monhocs/${id}`),

  create: (data: Omit<Subject, "id">): Promise<ApiResponse<Subject>> =>
    axiosClient.post("/monhocs", data),

  update: (id: number, data: Partial<Subject>): Promise<ApiResponse<Subject>> =>
    axiosClient.put(`/monhocs/${id}`, data),

  delete: (id: number): Promise<ApiResponse<boolean>> =>
    axiosClient.delete(`/monhocs/${id}`),
};
