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

export interface ChangePassForm {
  currentPassword: string;
  newPassword: string;
  newPassword_confirmation: string;
}

export interface DoKho extends DoKhoRequest {
  id: number;
}
export interface DoKhoRequest {
  tenDoKho: string;
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

export interface CauTraLoi {
  noiDungLuaChon: string;
  isCorrectAnswer: boolean;
}

export interface CauHoiBase {
  monHocId: number;
  chuongId?: number | null;
  doKhoId?: number | null;
  nguoiTaoId: number;
  noiDungCauHoi: string;
  giaiThichDapAn?: string;
  diemMacDinh?: number;
  status?: "public" | "private" | "archive";
  cauTraLois: CauTraLoi[];
}

export type CauHoiCreate = CauHoiBase;
export type CauHoiUpdate = Partial<CauHoiBase>;

export interface Subject {
  id: number;
  maMonHoc: string;
  tenMonHoc: string;
  soTinChi: number;
  soTietLyThuyet: number;
  soTietThucHanh: number;
  isDeleted: number;

  nhom_hoc_phans: NhomHocPhan[];
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
  diemMacDinh: string;
  soLuotSuDung: number;
  status: QuestionStatus;
  isDeleted: boolean;
  created_at: string | null;
  updated_at: string | null;

  doKhoId: number;
  monHocId: number;
  chuongId: number | null;
  nguoiTaoId: number;

  de_this_count: number;

  // relations
  mon_hoc: Subject | null;
  chuong: Chuong | null;
  do_kho: DoKho | null;
  nguoi_tao: TaiKhoan | null;
  cau_tra_lois: Answer[];

  dapAnDaChon?: number | null;
}

export interface Answer {
  id: number;
  noiDungLuaChon: string;
  isCorrectAnswer: boolean;
  cauHoiId: number | null;
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

export interface SubjectWithGroup {
  id: number;
  maMonHoc: string;
  tenMonHoc: string;
  soTinChi: number;
  soTietLyThuyet: number;
  soTietThucHanh: number;
  isDeleted: number;
  nhom_hoc_phans: NhomHocPhan[];
}

export interface Chuong {
  id: number;
  tenChuong: string;
  monHocId: number;
  isDeleted: number; // hoặc boolean nếu backend trả về true/false
}

export interface MonHocWithChuong {
  id: number;
  maMonHoc: string;
  tenMonHoc: string;
  soTinChi: number;
  soTietLyThuyet: number;
  soTietThucHanh: number;
  isDeleted: number; // hoặc boolean
  chuongs: Chuong[];
}

export interface DeThiSvienResponse {
  de_this: DeThiSvien[];
}

export interface DeThiSvienResponse {
  de_this: DeThiSvien[];
}

export interface DeThiSvien {
  id: number;
  monThiId: number;
  tenDe: string;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  thoiGianLamBai: number;
  isDeleted: boolean;
  created_at: string;
  updated_at: string;
  nguoiTaoId: number;

  bai_lam: BaiLam | null;
}

export interface AssignmentRequest {
  giangVienId: number | null;
  monHocIds: number[];
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

  cau_hois: Question[];

  cau_hinh_thi: CauHinhThi;
}

// Nếu bạn muốn định nghĩa trạng thái đề thi (kết hợp với utils trước đó)
export type DeThiStatus = "UPCOMING" | "OPENING" | "CLOSED";

export interface StatusResult {
  label: string;
  status: DeThiStatus;
}

export interface ThongBaoBase {
  tieuDe: string;
  noiDung: string;
  nguoiGuiId: number;
}

export interface ThongBaoCreate extends ThongBaoBase {
  nhomHocPhanIds: number[];
}

export type ThongBaoUpdate = Partial<ThongBaoCreate>;

export interface ThongBaoResponse extends ThongBaoBase {
  id: number;
  nhom_hoc_phans: NhomHocPhan[];
  thoiGianGui: string;
  uuTien: PriorityLevel;
  status: boolean;
  nguoi_gui: TaiKhoan;
}

export interface ThongBao {
  id: number;
  tieuDe: string;
  noiDung: string;
  thoiGianGui: string;
  uuTien: PriorityLevel;
  status: boolean;
  nguoiGuiId: number;
  nguoi_gui: TaiKhoan;
}

// Gợi ý thêm Type cho các mức độ ưu tiên để dễ dùng trong Code
export type PriorityLevel = 1 | 2 | 3;

export interface NhomHocPhanJoinGroup {
  sinhVienId: number;
  nhomHocPhanId: number;
  maMoi: string;
}

export interface NhomHocPhanDetailSv {
  id: number;
  tenNhom: string;
  thong_baos: ThongBao[];
  de_this: DeThi[];
  sinh_viens: TaiKhoan[];
  giang_vien: TaiKhoan;
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
export interface StudentRecord {
  id: number;
  stt: number;
  fullName: string;
  email: string;
  studentCode: string;
  gender: string;
  dateOfBirth: string;
  avatarUrl: string;
}

export interface NhomHocPhan {
  id: number;
  tenNhom: string;
  maMoi: string;
  siSo: number | null;
  notes: string | null;
  hocKy: number;
  namHoc: number;
  giangVienId: number | null;
  isHide: boolean;
  isDeleted: boolean;
  monHocId: number;
  created_at?: string;
  updated_at?: string;
  // Dữ liệu quan hệ Many-to-Many (có thể không luôn có)
  pivot?: {
    sinhVienId: number;
    nhomHocPhanId: number;
  };
  // Dữ liệu lồng (Eager Loading từ Backend)
  // giang_vien: TaiKhoan;
  // mon_hoc: Subject;
  // backgroundUrl: "https://picsum.photos/1920/1080?blur=8";
  giang_vien?: TaiKhoan;
  mon_hoc?: Subject;
  backgroundUrl?: string;
}

export interface NhomHocPhanBase {
  monHocId: number;
  tenNhom: string;
  maMoi: string;
  siSo: number | null;
  notes: string | null;
  hocKy: number;
  namHoc: number;
  giangVienId: number | null;
  isHide: boolean;
  isDeleted: boolean;
}

export type NhomHocPhanCreate = NhomHocPhanBase;

export type NhomHocPhanUpdate = Partial<
  Pick<NhomHocPhanBase, "tenNhom" | "notes" | "giangVienId" | "isHide">
>;

export interface NhomHocPhanSinhViensResponse {
  sinhViens: TaiKhoan[];
}
export interface CauHinhThi {
  cauHinhId: number;
  deThiId: number;
  hasMonitoring: boolean;
  allowCopy: boolean;
  allowPrint: boolean;
  isEnableResume: boolean;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  showScore: boolean;
  showDetailResults: boolean;
  isLimitSwitchTab: boolean;
  tabSwitchLimit: number;
  messageOnWarning: string; // Có thể null theo JSON của bạn
  created_at?: string; // ISO Date string
  updated_at?: string; // ISO Date string
}

export interface Option {
  label: string;
  value: number | string;
}

export type ExamStatus = "DANG_LAM" | "TAM_LUU" | "DA_NOP" | "BI_HUY"; // Bạn có thể thêm các status khác nếu có

export interface BaiLam {
  id: number;
  thoiGianBatDau?: string; // ISO String
  thoiGianNopBai?: string | null; // ISO String hoặc null nếu chưa nộp
  tongDiem: number | null; // null nếu chưa chấm
  soCauDung: number | null; // null nếu chưa có kết quả
  status: ExamStatus;
  created_at?: string;
  updated_at?: string;
  thiSinhId: number;
  thiSinh?: TaiKhoan;
  deThiId: number;
  deThi?: DeThi;
  chitiet_bailams?: ChiTietBaiLam[];
  logBaiLam?: LogBaiLam;
}

export interface ChiTietBaiLam {
  baiLamId: number;
  cauHoiId: number;
  dapAnId: number | null; // ID của đáp án sinh viên chọn
  isCorrectChooser: boolean; // Server sẽ update cái này khi nộp bài
  diem: number;
  updateAt: string;
}

export interface LogBaiLam {
  logId: number;
  baiLamId: number;
  soLanChuyenTab: number;
  createdAt: string; //iso string
}

export interface CreateDeThiPayload {
  monThiId: number;
  nguoiTaoId: number;
  tenDe: string;
  thoiGianBatDau: string; // Định dạng "YYYY-MM-DD HH:mm:ss"
  thoiGianKetThuc: string;
  thoiGianLamBai: number;
  nhomHocPhanIds: number[]; // Khác với NhomHocPhan[]
  cauHois: {
    id: number;
    thuTu: number;
    diem: number;
  }[];
  // Lưu ý: Tên trường phải khớp với JSON là "cauHinh"
  cauHinh: Omit<
    CauHinhThi,
    "cauHinhId" | "deThiId" | "created_at" | "updated_at"
  >;
}

export interface ExamResponseData {
  baiLam: BaiLam;
  deThi: DeThi;
  cauHois: Question[];
}
