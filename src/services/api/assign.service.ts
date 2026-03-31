import type { ApiResponse, Assign, AssignmentRequest, Subject } from "@/types";
import axiosClient from "./axios"; // Import service môn học

export const assignService = {
  getAll: (): Promise<ApiResponse<Assign[]>> => axiosClient.get("/phancongs"),
  getOGvien: (id: number): Promise<ApiResponse<Subject[]>> =>
    axiosClient.get(`/phancongs/o_gvien/${id}`),
  createPhanCong: (data: AssignmentRequest) =>
    axiosClient.post(`/phancongs/addgvienphancong`, data),
  deletePhanCong: ({
    giangVienId,
    monHocId,
  }: {
    giangVienId: number;
    monHocId: number;
  }): Promise<ApiResponse<boolean>> =>
    axiosClient.delete(`/phancongs/${giangVienId}/${monHocId}`),
};
