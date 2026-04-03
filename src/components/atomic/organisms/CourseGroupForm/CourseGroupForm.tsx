import { useState } from "react";
import { Button, Icon, Input, SelectField } from "@/components/atomic/atoms";
import { Overlay } from "@/components/atomic/molecules/Overlay/Overlay";
import { useUser } from "@/hooks/useUser";
import { useSubject } from "@/hooks/useSubject";
import { useTranslation } from "react-i18next";

export interface CourseGroupFormData {
  groupName: string;
  note: string;
  subject: string;
  academicYear: number;
  semester: number;
  giangVienId: number | null;
  maMoi: string;
  siSo: number | null;
}

interface CourseGroupFormProps {
  initialData?: Partial<CourseGroupFormData> | null;
  onSave: (data: CourseGroupFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const findOptionIndex = (
  options: { label: string; value: string | number }[],
  value?: string | number
) => {
  if (value === undefined || value === null) return undefined;
  const index = options.findIndex((option) => option.value === value);
  return index >= 0 ? index : undefined;
};

export function CourseGroupForm({
  initialData,
  onSave,
  onCancel,
  isSubmitting = false,
}: CourseGroupFormProps) {
  const { taikhoans } = useUser();
  const { subjects } = useSubject();
  const isEdit = Boolean(initialData);
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CourseGroupFormData>({
    groupName: initialData?.groupName ?? "",
    note: initialData?.note ?? "",
    subject: initialData?.subject ?? "",
    academicYear: initialData?.academicYear ?? 2024,
    semester: initialData?.semester ?? 1,
    giangVienId: initialData?.giangVienId ?? null,
    maMoi: initialData?.maMoi ?? "",
    siSo: initialData?.siSo ?? null,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof CourseGroupFormData, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CourseGroupFormData, string>> = {};

    if (!formData.groupName.trim()) {
      newErrors.groupName = "Tên nhóm không được để trống";
    } else if (formData.groupName.length > 255) {
      newErrors.groupName = "Tên nhóm không được vượt quá 255 ký tự";
    }

    if (formData.maMoi && formData.maMoi.length > 50) {
      newErrors.maMoi = "Mã mời không được vượt quá 50 ký tự";
    }

    if (formData.siSo !== null && formData.siSo <= 0) {
      newErrors.siSo = "Sĩ số phải là số dương";
    }

    if (!formData.subject) {
      newErrors.subject = "Vui lòng chọn môn học";
    }

    if (!formData.academicYear || formData.academicYear <= 0) {
      newErrors.academicYear = "Năm học phải là số dương";
    }

    if (!formData.semester || formData.semester < 1 || formData.semester > 2) {
      newErrors.semester = "Học kỳ phải là 1 hoặc 2";
    }

    if (!formData.giangVienId) {
      newErrors.giangVienId = "Vui lòng chọn giảng viên";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const subjectOptions = subjects.map((subject) => ({
    label: subject.tenMonHoc,
    value: subject.id.toString(),
  }));

  const giangVienOptions = taikhoans
    .filter((user) => user.nhomQuyenId === 2)
    .map((user) => ({
      label: user.hoTen,
      value: user.id,
    }));

  return (
    <Overlay onClose={onCancel}>
      <div className="flex w-[720px] max-w-[95vw] flex-col overflow-hidden rounded-lg bg-background-paper">
        <div className="flex items-center justify-between bg-primary-main px-6 py-3 text-primary-contrast">
          <h2 className="text-body-1 font-semibold text-primary-contrast">
            {isEdit
              ? t("courseGroup.form.updateTitle")
              : t("courseGroup.form.addTitle")}
          </h2>
          <button
            type="button"
            className="hover:bg-primary-contrast/10 rounded-md border border-primary-contrast p-1 text-primary-contrast transition-colors"
            onClick={onCancel}
            aria-label={t("courseGroup.form.close")}
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="flex max-h-[100vh] flex-col gap-5 px-6 py-5">
          <div className="flex flex-col gap-1 text-text-primary">
            <div className="text-input-text font-semibold text-text-secondary">
              {t("courseGroup.form.groupName")}
            </div>
            <Input
              hasBoder={true}
              placeholder={t("courseGroup.form.groupNamePlaceholder")}
              value={formData.groupName}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  groupName: event.target.value,
                }))
              }
              className="h-10 w-full"
            />
            {errors.groupName && (
              <div className="text-sm text-error-main">{errors.groupName}</div>
            )}
          </div>

          <div className="flex flex-col gap-1 text-text-primary">
            <div className="text-input-text font-semibold text-text-secondary">
              {t("courseGroup.form.note")}
            </div>
            <Input
              hasBoder={true}
              placeholder={t("courseGroup.form.notePlaceholder")}
              value={formData.note}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  note: event.target.value,
                }))
              }
              className="h-10 w-full"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1 text-text-primary">
              <div className="text-input-text font-semibold text-text-secondary">
                {t("courseGroup.form.inviteCode")}
              </div>
              <Input
                hasBoder={true}
                placeholder={t("courseGroup.form.inviteCodePlaceholder")}
                value={formData.maMoi}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    maMoi: event.target.value,
                  }))
                }
                className="h-10 w-full"
              />
              {errors.maMoi && (
                <div className="text-sm text-error-main">{errors.maMoi}</div>
              )}
            </div>
            <div className="flex flex-col gap-1 text-text-primary">
              <div className="text-input-text font-semibold text-text-secondary">
                {t("courseGroup.form.classSize")}
              </div>
              <Input
                hasBoder={true}
                placeholder={t("courseGroup.form.classSizePlaceholder")}
                type="number"
                value={formData.siSo ?? ""}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    siSo: event.target.value
                      ? Number(event.target.value)
                      : null,
                  }))
                }
                className="h-10 w-full"
              />
              {errors.siSo && (
                <div className="text-sm text-error-main">{errors.siSo}</div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <SelectField
              label={t("courseGroup.form.subject")}
              placeholder={t("courseGroup.form.subjectPlaceholder")}
              options={subjectOptions}
              defaultIndex={findOptionIndex(subjectOptions, formData.subject)}
              onSelect={(value) =>
                setFormData((prev) => ({ ...prev, subject: String(value) }))
              }
            />
            {errors.subject && (
              <div className="text-sm text-error-main">{errors.subject}</div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <SelectField
              label={t("courseGroup.form.lecturer")}
              placeholder={t("courseGroup.form.lecturerPlaceholder")}
              options={giangVienOptions}
              defaultIndex={findOptionIndex(
                giangVienOptions.map((opt) => ({
                  label: opt.label,
                  value: String(opt.value),
                })),
                formData.giangVienId ? String(formData.giangVienId) : undefined
              )}
              onSelect={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  giangVienId: value ? Number(value) : null,
                }))
              }
            />
            {errors.giangVienId && (
              <div className="text-sm text-error-main">
                {errors.giangVienId}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <div className="text-input-text font-semibold text-text-secondary">
                {t("courseGroup.form.academicYear")}
              </div>
              <Input
                hasBoder={true}
                placeholder={t("courseGroup.form.academicYearPlaceholder")}
                type="number"
                value={formData.academicYear}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    academicYear: Number(event.target.value) || 0,
                  }))
                }
                className="h-10 w-full"
              />
              {errors.academicYear && (
                <div className="text-sm text-error-main">
                  {errors.academicYear}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-input-text font-semibold text-text-secondary">
                Học kỳ
              </div>
              <Input
                hasBoder={true}
                placeholder={t("courseGroup.form.semesterPlaceholder")}
                type="number"
                value={formData.semester}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    semester: Number(event.target.value) || 0,
                  }))
                }
                className="h-10 w-full"
              />
              {errors.semester && (
                <div className="text-sm text-error-main">{errors.semester}</div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 bg-background-paper px-6 py-4">
          <Button variant="outline" color="standard" onClick={onCancel}>
            Đóng
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isEdit ? "Cập nhật" : "Lưu"}
          </Button>
        </div>
      </div>
    </Overlay>
  );
}
