//export all
export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any;
}

export type EmptyResponse = ApiResponse<null>;

export interface NhomQuyen {
  nhomQuyenId: number;
  tenNhomQuyen: string;
  soLuongNguoiDung?: number;
}

export interface PermissionItem {
  key: string;
  name: string;
  actions: {
    read: boolean; // Xem
    create: boolean; // Thêm mới
    update: boolean; // Cập nhật
    delete: boolean; // Xoá
  };
}

export interface PermissionFormData {
  groupName: string;
  permissions: PermissionItem[];
  canTakeExam: boolean; // Tham gia thi
  canJoinCourse: boolean; // Tham gia học phần
}

export interface TaiKhoan {
  id: number;
  ma: string;
  username: string;
  hoTen: string;
  email: string;
  nhomQuyenId: number;
  sdt: string;
  ngaySinh: string; // ISO date string
  laGioiTinhNu: boolean;
  ggid: string | null;
  urlAvatar: string | null;
  isStudent: boolean;
  isLocked: boolean;
  isDeleted: boolean;
  lastLogin: string; // ISO date string
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface Subject {
  id: number;
  maMonHoc: string;
  tenMonHoc: string;
  soTinChi: number;
  soTietLyThuyet: number;
  soTietThucHanh: number;
  isDeleted: number;
}

export interface DoKho {
  id: number;
  tenDoKho: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface Question {
  id: number;
  noiDungCauHoi: string;
  imageUrl: string | null;
  giaiThichDapAn: string;
  diemMacDinh: string; // "1.50" -> string từ API
  soLuotSuDung: number;
  status: "public" | "private" | "archive";
  isDeleted: boolean;
  created_at: string;
  updated_at: string;

  doKhoId: number;
  monHocId: number;
  chuongId: number | null;
  nguoiTaoId: number;

  de_this_count: number;

  // relations
  mon_hoc: Subject;
  chuong: unknown | null;
  do_kho: DoKho;
  nguoi_tao: TaiKhoan;
}
