import type { ApiResponse, Question } from "@/types";
import axiosClient from "./axios";

export const questionService = {
  getAll: (): Promise<ApiResponse<Question[]>> => {
    return axiosClient.get("/cauhois");
  },

  getById: (id: number): Promise<ApiResponse<Question>> =>
    axiosClient.get(`/cauhois/${id}`),

  //   create: (data: Omit<Subject, "id">): Promise<ApiResponse<Subject>> =>
  //     axiosClient.post("/monhocs", data),

  //   update: (id: number, data: Partial<Subject>): Promise<ApiResponse<Subject>> =>
  //     axiosClient.put(`/monhocs/${id}`, data),

  //   delete: (id: number): Promise<ApiResponse<boolean>> =>
  //     axiosClient.delete(`/monhocs/${id}`),
};
