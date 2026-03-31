import type {
  ApiResponse,
  TaiKhoan,
  UserCreate,
  UserResetPass,
  UserResponse,
  UserUpdate,
} from "@/types";
import axiosClient from "./axios";

export const userService = {
  getAll: (): Promise<ApiResponse<TaiKhoan[]>> => axiosClient.get("/users"),

  getById: (id: number): Promise<ApiResponse<TaiKhoan>> =>
    axiosClient.get(`/users/${id}`),

  create: (data: UserCreate): Promise<ApiResponse<UserResponse>> =>
    axiosClient.post("/users", data),

  update: ({
    id,
    data,
  }: {
    id: number;
    data: UserUpdate;
  }): Promise<ApiResponse<UserResponse>> =>
    axiosClient.put(`/users/${id}`, data),

  delete: (id: number): Promise<ApiResponse<boolean>> =>
    axiosClient.delete(`/users/${id}`),

  resetPassword: ({
    id,
    data,
  }: {
    id: number;
    data: UserResetPass;
  }): Promise<ApiResponse<boolean>> =>
    axiosClient.post(`/users/resetpassword/${id}`, data),
};
