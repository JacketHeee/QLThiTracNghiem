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

  delete: (id: number): Promise<ApiResponse<boolean>> =>
    axiosClient.delete(`/cauhois/${id}`),
};
