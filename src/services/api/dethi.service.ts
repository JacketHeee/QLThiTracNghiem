import type { ApiResponse, DeThi } from "@/types";
import axiosClient from "./axios"; // Import service môn học

export const dethiService = {
  getAll: (): Promise<ApiResponse<DeThi[]>> => axiosClient.get("/dethis"),

  /**
   * Lấy danh sách đề thi theo ID sinh viên kèm thông tin môn học
   * @param studentId ID của sinh viên
   */
  getByStudentId: (studentId: number): Promise<ApiResponse<DeThi[]>> =>
    axiosClient.get(`/dethis/get_osvien/${studentId}`),
};
