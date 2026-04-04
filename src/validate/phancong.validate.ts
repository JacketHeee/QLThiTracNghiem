export interface AssignmentInput {
  monHocIds: number[];
}

export type AssignmentError = Partial<Record<keyof AssignmentInput, string>>;

export class AssignmentValidate {
  static create(data: AssignmentInput): AssignmentError {
    const errors: AssignmentError = {};

    // kiểm tra danh sách môn học
    if (!data.monHocIds || data.monHocIds.length === 0) {
      errors.monHocIds = "Vui lòng chọn ít nhất 1 môn học";
    }

    return errors;
  }
}
