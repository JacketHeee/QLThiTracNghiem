import type {
  ApiResponse,
  NhomHocPhan,
  NhomHocPhanThongBao,
  TaiKhoan,
} from "@/types";
import axiosClient from "./axios";

export const nhomHocPhanService = {
  getAll: (): Promise<ApiResponse<NhomHocPhan[]>> =>
    axiosClient.get("/nhomhocphans"),

  getByStudent: (studentId: number): Promise<ApiResponse<TaiKhoan>> =>
    axiosClient.get(`/nhomhocphans/o_svien/${studentId}`),

  //   getById: (id: number): Promise<ApiResponse<Subject>> =>
  //     axiosClient.get(`/monhocs/${id}`),

  //   create: (data: Omit<Subject, "id">): Promise<ApiResponse<Subject>> =>
  //     axiosClient.post("/monhocs", data),

  //   update: (id: number, data: Partial<Subject>): Promise<ApiResponse<Subject>> =>
  //     axiosClient.put(`/monhocs/${id}`, data),

  //   delete: (id: number): Promise<ApiResponse<boolean>> =>
  //     axiosClient.delete(`/monhocs/${id}`),

  getWithThongBao: (
    nhomHocPhanId: number
  ): Promise<ApiResponse<NhomHocPhanThongBao>> =>
    axiosClient.get(`/nhomhocphans/w_tbao/${nhomHocPhanId}`),
};
