import type {
  ApiResponse,
  CauHoiCreate,
  CauHoiUpdate,
  Question,
} from "@/types";
import axiosClient from "./axios";

export const questionService = {
  getAll: (): Promise<ApiResponse<Question[]>> => {
    return axiosClient.get("/cauhois");
  },

  getWithPrivate: (userId: number): Promise<ApiResponse<Question[]>> => {
    return axiosClient.get(`/cauhois/get_w_private/${userId}`);
  },

  getPublic: (): Promise<ApiResponse<Question[]>> => {
    return axiosClient.get("/cauhois/all_public");
  },

  getOUser: (userId: number): Promise<ApiResponse<Question[]>> => {
    return axiosClient.get(`/cauhois/o_gvien/${userId}`);
  },

  getById: (id: number): Promise<ApiResponse<Question>> =>
    axiosClient.get(`/cauhois/${id}`),

  create: (data: CauHoiCreate): Promise<ApiResponse<Question>> =>
    axiosClient.post("/cauhois", data),

  update: ({
    id,
    data,
  }: {
    id: number;
    data: Partial<CauHoiUpdate>;
  }): Promise<ApiResponse<Question>> => axiosClient.put(`/cauhois/${id}`, data),

  updateStatus: ({
    id,
    data,
  }: {
    id: number;
    data: { status: "public" | "private" | "archive" };
  }): Promise<ApiResponse<Question>> =>
    axiosClient.patch(`/cauhois/${id}/status`, data),

  delete: (id: number): Promise<ApiResponse<boolean>> =>
    axiosClient.delete(`/cauhois/${id}`),

  copyToPrivate: ({
    id,
    data,
  }: {
    id: number;
    data: { nguoiTaoId: number };
  }): Promise<ApiResponse<Question>> =>
    axiosClient.post(`/cauhois/${id}/copy`, data),
};
