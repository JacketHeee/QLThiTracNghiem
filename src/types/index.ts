//export all

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

export interface Subject {
  monHocId: number;
  tenMonHoc: string;
  soTinChi: number;
  soTietLyThuyet: number;
  soTietThucHanh: number;
}

export const UserRole = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface TaiKhoan {
  taiKhoanId: number;
  username: string; //mssv
  // password?: string;
  hoTen: string;
  ngaySinh?: Date;
  laGioiTinhNu: boolean;
  email: string;
  sdt?: string;
  nhomQuyenId: number; // Liên kết tới NHOMQUYEN
  ggid?: string;
  urlAvartar?: string;
  createdAt: Date;
  isStudent: boolean; // Flag lọc nhanh
  isLocked: boolean;
  lastLogin?: Date;
  isDeleted: boolean;

  role?: UserRole;
}
