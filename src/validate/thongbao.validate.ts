export interface ThongBaoInput {
  tieuDe: string;
  noiDung: string;
  nhomHocPhanIds: number[];
}

export type ThongBaoError = Partial<Record<keyof ThongBaoInput, string>>;

export class ThongBaoValidate {
  static create(data: ThongBaoInput): ThongBaoError {
    const errors: ThongBaoError = {};

    // tiêu đề
    if (!data.tieuDe || data.tieuDe.trim() === "") {
      errors.tieuDe = "Tiêu đề không được để trống";
    }

    // nội dung
    if (!data.noiDung || data.noiDung.trim() === "") {
      errors.noiDung = "Nội dung không được để trống";
    }

    // nhóm học phần
    if (!data.nhomHocPhanIds || data.nhomHocPhanIds.length === 0) {
      errors.nhomHocPhanIds = "Phải chọn ít nhất 1 nhóm học phần";
    }

    return errors;
  }
}
