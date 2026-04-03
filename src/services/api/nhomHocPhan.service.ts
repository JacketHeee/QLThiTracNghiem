import type {
  ApiResponse,
  NhomHocPhan,
  TaiKhoan,
  NhomHocPhanCreate,
  NhomHocPhanUpdate,
  EmptyResponse,
  DeThi,
  NhomHocPhanJoinGroup,
  NhomHocPhanSinhViensResponse,
  NhomHocPhanDetailSv,
} from "@/types";
import axiosClient from "./axios";

export const nhomHocPhanService = {
  getAll: (): Promise<ApiResponse<NhomHocPhan[]>> =>
    axiosClient.get("/nhomhocphans"),

  getById: (nhomhocphan: number): Promise<ApiResponse<NhomHocPhan>> =>
    axiosClient.get(`/nhomhocphans/${nhomhocphan}`),

  create: (data: NhomHocPhanCreate): Promise<ApiResponse<NhomHocPhan>> =>
    axiosClient.post("/nhomhocphans", data),

  update: (
    nhomhocphan: number,
    data: NhomHocPhanUpdate
  ): Promise<ApiResponse<NhomHocPhan>> =>
    axiosClient.put(`/nhomhocphans/${nhomhocphan}`, data),

  delete: (nhomhocphan: number): Promise<EmptyResponse> =>
    axiosClient.delete(`/nhomhocphans/${nhomhocphan}`),

  getByStudent: (user: number): Promise<ApiResponse<TaiKhoan>> =>
    axiosClient.get(`/nhomhocphans/o_svien/${user}`),

  getGiangVien: (nhomhocphan: number): Promise<ApiResponse<TaiKhoan>> =>
    axiosClient.get(`/nhomhocphans/w_gvien_mon/${nhomhocphan}`),

  getDeKiemTra: (nhomhocphan: number): Promise<ApiResponse<DeThi[]>> =>
    axiosClient.get(`/nhomhocphans/w_dekiemtra/${nhomhocphan}`),

  joinGroup: (data: NhomHocPhanJoinGroup): Promise<EmptyResponse> =>
    axiosClient.post(`/nhomhocphans/join_group`, data),

  resetInviteCode: (nhomhocphan: number): Promise<EmptyResponse> =>
    axiosClient.patch(`/nhomhocphans/reset_invite_code/${nhomhocphan}`),

  getDanhSachSinhVien: (
    nhomhocphan: number
  ): Promise<ApiResponse<NhomHocPhanSinhViensResponse>> =>
    axiosClient.get(`/nhomhocphans/get_danh_sach_sinh_vien/${nhomhocphan}`),

  addSinhVienToNhom: (
    nhomhocphan: number,
    data: { username: string }
  ): Promise<EmptyResponse> =>
    axiosClient.post(
      `/nhomhocphans/add_sinh_vien_to_nhom/${nhomhocphan}`,
      data
    ),

  removeSinhVienFromNhom: (
    nhomhocphan: number,
    sinhVienId: number
  ): Promise<EmptyResponse> =>
    axiosClient.delete(`/nhomhocphans/${nhomhocphan}/sinh-vien`, {
      data: { sinhVienId },
    }),

  exportSinhVienList: (nhomhocphan: number): Promise<Blob> =>
    axiosClient.get(`/nhomhocphans/sinh_vien_export/${nhomhocphan}`, {
      responseType: "blob",
    }),

  importSinhVienList: (
    nhomhocphan: number,
    file: File
  ): Promise<EmptyResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post(
      `/nhomhocphans/sinh_vien_import/${nhomhocphan}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
  //   delete: (id: number): Promise<ApiResponse<boolean>> =>
  //     axiosClient.delete(`/monhocs/${id}`),

  getWithThongBaoDeThi: (
    nhomHocPhanId: number
  ): Promise<ApiResponse<NhomHocPhanDetailSv>> =>
    axiosClient.get(`/nhomhocphans/detailsinhvien/${nhomHocPhanId}`),
};
