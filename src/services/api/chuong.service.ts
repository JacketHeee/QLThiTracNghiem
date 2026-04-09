import type {
  ApiResponse,
  Chuong,
  DsChuongRequest,
  MonHocWithChuong,
} from "@/types";
import axiosClient from "./axios";

export const chuongService = {
  getByMonHoc: (data: { monHocId?: number }): Promise<ApiResponse<Chuong[]>> =>
    axiosClient.get(`/chuongs/o_monhoc/${data.monHocId}`),

  update: ({
    monHocId,
    data,
  }: {
    monHocId?: number;
    data: DsChuongRequest;
  }): Promise<ApiResponse<MonHocWithChuong>> =>
    axiosClient.put(`/chuongs/${monHocId}`, data),
};
