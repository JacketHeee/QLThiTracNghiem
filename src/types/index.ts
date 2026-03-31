//export all
export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

export type EmptyResponse = ApiResponse<null>;

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

  nhom_hoc_phans: NhomHocPhan[];
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
  created_at?: string;
  updated_at?: string;
}

export type QuestionStatus = "public" | "private" | "archive";
export interface Question {
  id: number;
  noiDungCauHoi: string;
  imageUrl: string | null;
  giaiThichDapAn: string;
  diemMacDinh: string; // "1.50" -> string từ API
  soLuotSuDung: number;
  status: QuestionStatus;
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
  cau_tra_lois: Answer[];
}

export interface Answer {
  id: number;
  noiDungLuaChon: string;
  isCorrectAnswer: boolean;
  created_at: string; // Hoặc Date | null tùy vào cách bạn xử lý data
  updated_at: string;
  cauHoiId: number;
}

export interface Role {
  id: number;
  tenNhomQuyen: string;
  /** Trạng thái xóa: 0 là chưa xóa, 1 là đã xóa */
  isDeleted: number;
  /** Định dạng ISO 8601 */
  created_at: string;
  /** Định dạng ISO 8601 */
  updated_at: string;
  /** Tổng số người dùng thuộc nhóm quyền này */
  total_users: number;
}

export interface RoleBase {
  tenNhomQuyen: string;
  role_details: RoleDetailItem[];
}

export type RoleCreate = RoleBase;

export interface RoleResponse extends RoleBase {
  id: number;
}

export interface RoleDetail extends RoleBase {
  id: number;
}

export type RoleUpdate = Partial<RoleBase>;

export interface RoleDetailItem {
  tenChucNang: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface UserBase {
  hoTen: string;
  email: string;
  nhomQuyenId: number | null;
  sdt?: string | null;
  username: string;
  ngaySinh: string; // ISO date string
  laGioiTinhNu: boolean;
  ggid?: boolean | null;
  urlAvatar?: string | null;
  isLocked: boolean;
  isStudent: boolean;
}

export interface UserCreate extends UserBase {
  password: string;
}

export type UserUpdate = Partial<UserBase>;

export interface UserResponse extends UserBase {
  id: number;
}

export interface UserResetPass {
  newPassword: string;
}

export interface Assign {
  giangVienId: number;
  monHocId: number;
  mon_hoc: Subject;
  giang_vien: TaiKhoan;
}

export interface DeThi {
  id: number;
  monThiId: number;
  tenDe: string;
  /** Chuỗi định dạng ISO 8601 (e.g., "2026-03-23T19:22:00.000000Z") */
  thoiGianBatDau: string;
  /** Chuỗi định dạng ISO 8601 */
  thoiGianKetThuc: string;
  /** Thời gian làm bài tính bằng phút */
  thoiGianLamBai: number;
  isDeleted: boolean;
  created_at: string;
  updated_at: string;
  nguoiTaoId: number;

  // Bạn có thể thêm các trường quan hệ (relations) nếu sau này fetch kèm
  mon_thi: Subject;
  nguoiTao?: TaiKhoan;
  pivot?: {
    nhomHocPhanId: number;
    deThiId: number;
  };

  nhom_hoc_phans: NhomHocPhan[];
}

// Nếu bạn muốn định nghĩa trạng thái đề thi (kết hợp với utils trước đó)
export type DeThiStatus = "UPCOMING" | "OPENING" | "CLOSED";

export interface StatusResult {
  label: string;
  status: DeThiStatus;
}

export interface ThongBao {
  id: number;
  tieuDe: string;
  noiDung: string;
  /** Chuỗi định dạng ISO 8601 (Ví dụ: "2026-03-25T06:15:49.000000Z") */
  thoiGianGui: string;
  /** * Mức độ ưu tiên:
   * 1: Thấp, 2: Trung bình, 3: Cao (Tùy theo quy định của bạn)
   */
  uuTien: PriorityLevel;
  /** Trạng thái hiển thị hoặc đã đọc */
  status: boolean;
  nguoiGuiId: number;

  // Relations (Nếu bạn fetch kèm thông tin người gửi)
  nguoiGui?: TaiKhoan;
}

// Gợi ý thêm Type cho các mức độ ưu tiên để dễ dùng trong Code
export type PriorityLevel = 1 | 2 | 3;

export interface NhomHocPhan {
  id: number;
  tenNhom: string;
  maMoi: string;
  siSo: number;
  notes: string;
  hocKy: number;
  namHoc: number;
  giangVienId: number;
  isHide: number;
  isDeleted: number;
  monHocId: number;
  // Dữ liệu quan hệ Many-to-Many
  pivot: {
    sinhVienId: number;
    nhomHocPhanId: number;
  };
  // Dữ liệu lồng (Eager Loading từ Backend)
  giang_vien: TaiKhoan;
  mon_hoc: Subject;
  backgroundUrl: "https://picsum.photos/1920/1080?blur=8";
}

export type BackendErrors = {
  [key: string]: string[];
};

export type ErrorResponse = {
  message?: string;
  errors: BackendErrors;
};

export interface LoginFormSubmit {
  login: string;
  password: string;
}

export interface LoginResponse {
  original: {
    access_token: string;
    me: TaiKhoan;
    role: RoleResponse;
  };
}

export type SidebarItem = {
  icon: string;
  labelKey: string;
  to: string;
  permission: string;
};

export type SidebarSection = {
  title: string | null;
  items: SidebarItem[];
};
