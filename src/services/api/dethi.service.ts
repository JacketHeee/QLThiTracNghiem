import type { ApiResponse, CreateDeThiPayload, DeThi } from "@/types";
import axiosClient from "./axios"; // Import service môn học

export const dethiService = {
  getAll: (): Promise<ApiResponse<DeThi[]>> => axiosClient.get("/dethis"),

  getById: (studentId: number): Promise<ApiResponse<DeThi>> =>
    axiosClient.get(`/dethis/get_ad/${studentId}`),

  /**
   * Lấy danh sách đề thi theo ID sinh viên kèm thông tin môn học
   * @param studentId ID của sinh viên
   */
  getByStudentId: (studentId: number): Promise<ApiResponse<DeThi[]>> =>
    axiosClient.get(`/dethis/get_osvien/${studentId}`),

  /**
   * Tạo mới đề thi
   * @param payload Dữ liệu tạo đề thi theo cấu trúc CreateDeThiPayload
   */
  create: (payload: CreateDeThiPayload): Promise<ApiResponse<DeThi>> =>
    axiosClient.post("/dethis", payload),

  /**
   * Cập nhật đề thi (Nếu endpoint của bạn là PUT /dethis/:id)
   */
  update: (
    id: number,
    payload: CreateDeThiPayload
  ): Promise<ApiResponse<DeThi>> => axiosClient.put(`/dethis/${id}`, payload),
  /**
   * Cập nhật đề thi (Nếu endpoint của bạn là PUT /dethis/:id)
   */
  delete: (id: number): Promise<ApiResponse<boolean>> =>
    axiosClient.delete(`/dethis/${id}`),
};
