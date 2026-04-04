export interface DoKhoInput {
  tenDoKho: string;
}

export type DoKhoError = Partial<Record<keyof DoKhoInput, string>>;

export class DoKhoValidate {
  static create(data: DoKhoInput): DoKhoError {
    const errors: DoKhoError = {};

    if (!data.tenDoKho || data.tenDoKho.trim() === "") {
      errors.tenDoKho = "Tên độ khó không được để trống";
    }

    return errors;
  }
}
