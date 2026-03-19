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
