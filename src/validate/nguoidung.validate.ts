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
      errors.username = "userPage.validation.usernameRequired";
    }

    if (!data.email || data.email.trim() === "") {
      errors.email = "userPage.validation.emailRequired";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.email = "userPage.validation.emailInvalid";
      }
    }

    if (!data.hoTen || data.hoTen.trim() === "") {
      errors.hoTen = "userPage.validation.fullNameRequired";
    }

    if (!data.ngaySinh) {
      errors.ngaySinh = "userPage.validation.dobRequired";
    }

    // 🔥 chỉ có ở CREATE
    if (!data.password || data.password.trim() === "") {
      errors.password = "userPage.validation.passwordRequired";
    }

    if (!data.isStudent && data.nhomQuyenId === null) {
      errors.nhomQuyenId = "userPage.validation.roleRequired";
    }

    return errors;
  }

  // 👉 UPDATE (KHÔNG có password)
  static update(data: UserUpdateInput): UserError {
    const errors: UserError = {};

    if (!data.username || data.username.trim() === "") {
      errors.username = "userPage.validation.usernameRequired";
    }

    if (!data.email || data.email.trim() === "") {
      errors.email = "userPage.validation.emailRequired";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.email = "userPage.validation.emailInvalid";
      }
    }

    if (!data.hoTen || data.hoTen.trim() === "") {
      errors.hoTen = "userPage.validation.fullNameRequired";
    }

    if (!data.ngaySinh) {
      errors.ngaySinh = "userPage.validation.dobRequired";
    }

    if (!data.isStudent && data.nhomQuyenId === null) {
      errors.nhomQuyenId = "userPage.validation.roleRequired";
    }

    return errors;
  }
}
