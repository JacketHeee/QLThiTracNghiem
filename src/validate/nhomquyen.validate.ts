import type { RoleDetailItem } from "@/types";

export interface RoleCreate {
  tenNhomQuyen: string;
  role_details: RoleDetailItem[];
}

export type RoleError = Partial<Record<keyof RoleCreate, string>>;

export class RoleValidate {
  static create(data: RoleCreate): RoleError {
    const errors: RoleError = {};

    // validate tên nhóm quyền
    if (!data.tenNhomQuyen || data.tenNhomQuyen.trim() === "") {
      errors.tenNhomQuyen = "Tên nhóm quyền không được để trống";
    }

    // validate danh sách quyền
    if (!data.role_details || data.role_details.length === 0) {
      errors.role_details = "Role phải có ít nhất 1 quyền";
    }

    return errors;
  }
}
