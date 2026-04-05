import type {
  ApiResponse,
  MonHocWithChuong,
  Subject,
  SubjectWithGroup,
} from "@/types";
import axiosClient from "./axios";

export const subjectService = {
  getAll: (): Promise<ApiResponse<Subject[]>> =>
    axiosClient.get("/monhocs/get_w_nhp"),

  getById: (id: number): Promise<ApiResponse<Subject>> =>
    axiosClient.get(`/monhocs/${id}`),

  getOGvien: (id: number): Promise<ApiResponse<Subject[]>> =>
    axiosClient.get(`/monhocs/get_o_gvien/${id}`),

  create: (data: Omit<Subject, "id">): Promise<ApiResponse<Subject>> =>
    axiosClient.post("/monhocs", data),

  update: (id: number, data: Partial<Subject>): Promise<ApiResponse<Subject>> =>
    axiosClient.put(`/monhocs/${id}`, data),

  delete: (id: number): Promise<ApiResponse<boolean>> =>
    axiosClient.delete(`/monhocs/${id}`),

  getAllWithGroup: (): Promise<ApiResponse<SubjectWithGroup[]>> =>
    axiosClient.get("/monhocs/get_w_nhp"),

  getAllWithChuong: (): Promise<ApiResponse<MonHocWithChuong[]>> =>
    axiosClient.get("/monhocs/get_w_chuong"),
};
