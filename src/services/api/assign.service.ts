import type { ApiResponse, Assign } from "@/types";
import axiosClient from "./axios"; // Import service môn học

export const assignService = {
  getAll: (): Promise<ApiResponse<Assign[]>> => axiosClient.get("/phancongs"),
};
