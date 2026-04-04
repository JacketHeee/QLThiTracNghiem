export interface UserInput {
  username: string;
  email: string;
  hoTen: string;
  ngaySinh: string | Date;
  password: string;
  isStudent: boolean;
  nhomQuyenId: number | null;
}

// dùng cho update (bỏ password)
export type UserUpdateInput = Omit<UserInput, "password">;
export type UserError = Partial<Record<keyof UserInput, string>>;

export class UserValidate {
  // 👉 CREATE (có password)
  static create(data: UserInput): UserError {
    const errors: UserError = {};

    if (!data.username || data.username.trim() === "") {
      errors.username = "Tên đăng nhập không được để trống";
    }

    if (!data.email || data.email.trim() === "") {
      errors.email = "Email không được để trống";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.email = "Email không hợp lệ";
      }
    }

    if (!data.hoTen || data.hoTen.trim() === "") {
      errors.hoTen = "Họ tên không được để trống";
    }

    if (!data.ngaySinh) {
      errors.ngaySinh = "Ngày sinh không được để trống";
    }

    // 🔥 chỉ có ở CREATE
    if (!data.password || data.password.trim() === "") {
      errors.password = "Mật khẩu không được để trống";
    }

    if (!data.isStudent && data.nhomQuyenId === null) {
      errors.nhomQuyenId = "Vui lòng chọn nhóm quyền";
    }

    return errors;
  }

  // 👉 UPDATE (KHÔNG có password)
  static update(data: UserUpdateInput): UserError {
    const errors: UserError = {};

    if (!data.username || data.username.trim() === "") {
      errors.username = "Tên đăng nhập không được để trống";
    }

    if (!data.email || data.email.trim() === "") {
      errors.email = "Email không được để trống";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.email = "Email không hợp lệ";
      }
    }

    if (!data.hoTen || data.hoTen.trim() === "") {
      errors.hoTen = "Họ tên không được để trống";
    }

    if (!data.ngaySinh) {
      errors.ngaySinh = "Ngày sinh không được để trống";
    }

    if (!data.isStudent && data.nhomQuyenId === null) {
      errors.nhomQuyenId = "Vui lòng chọn nhóm quyền";
    }

    return errors;
  }
}
