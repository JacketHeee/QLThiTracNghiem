import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Button, Icon } from "@/components/atomic/atoms";
import { TextField } from "@/components/atomic/molecules/TextField/TextField";
import type { Subject } from "@/types";
import { Overlay } from "../../molecules/Overlay/Overlay";

interface SubjectFormProps {
  initialData?: Subject | null;
  onSave: (data: Subject) => void;
  onCancel: () => void;
}

export function SubjectForm({
  initialData,
  onSave,
  onCancel,
}: SubjectFormProps) {
  const { t } = useTranslation("common");
  // KHẮC PHỤC: Khởi tạo state trực tiếp từ initialData.
  // Để state này cập nhật khi initialData thay đổi, hãy truyền key={initialData.id} khi gọi component này.
  const [formData, setFormData] = useState<Subject>(
    initialData ??
      ({
        id: 0,
        maMonHoc: "",
        tenMonHoc: "",
        soTinChi: 0,
        soTietLyThuyet: 0,
        soTietThucHanh: 0,
        isDeleted: 0,
      } as Subject)
  );

  const [errors, setErrors] = useState<Partial<Record<keyof Subject, string>>>(
    {}
  );

  const handleChange = (field: keyof Subject, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof Subject, string>> = {};

    if (!formData.tenMonHoc?.trim()) {
      newErrors.tenMonHoc = t("subjectPage.form.validation.nameRequired");
    }

    if (!formData.maMonHoc?.trim()) {
      newErrors.maMonHoc = t("subjectPage.form.validation.codeRequired");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      alert(firstError);
      return;
    }

    onSave(formData);
  };

  return (
    <Overlay onClose={onCancel}>
      <form
        onSubmit={handleSubmit}
        className="flex w-[500px] flex-col overflow-hidden rounded-xl bg-background-paper shadow-2xl duration-200 animate-in fade-in zoom-in-95"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-other-divider px-6 py-2">
          <h6 className="text-body-1 font-bold text-text-primary">
            {initialData
              ? t("subjectPage.form.updateTitle")
              : t("subjectPage.form.addTitle")}
          </h6>
          <Button
            type="button"
            variant="text"
            size="small"
            onClick={onCancel}
            className="min-w-0 p-1.5 text-text-secondary"
          >
            <Icon name="close" size={24} />
          </Button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-6">
          <TextField
            label={t("subjectPage.form.nameLabel")}
            placeholder={t("subjectPage.form.namePlaceholder")}
            value={formData.tenMonHoc}
            onChange={(e) => handleChange("tenMonHoc", e.target.value)}
            error={errors.tenMonHoc}
          />

          <div className="grid grid-cols-2 gap-2">
            <TextField
              label={t("subjectPage.form.codeLabel")}
              placeholder={t("subjectPage.form.codePlaceholder")}
              value={formData.maMonHoc}
              onChange={(e) => handleChange("maMonHoc", e.target.value)}
              disabled={!!initialData}
              error={errors.maMonHoc}
            />

            <TextField
              label={t("subjectPage.form.creditsLabel")}
              type="number"
              placeholder={t("subjectPage.form.creditsPlaceholder")}
              value={formData.soTinChi || ""}
              onChange={(e) =>
                handleChange("soTinChi", Number(e.target.value) || 0)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <TextField
              label={t("subjectPage.form.theoryPeriodsLabel")}
              type="number"
              placeholder={t("subjectPage.form.theoryPeriodsPlaceholder")}
              value={formData.soTietLyThuyet || ""}
              onChange={(e) =>
                handleChange("soTietLyThuyet", Number(e.target.value) || 0)
              }
            />

            <TextField
              label={t("subjectPage.form.practicePeriodsLabel")}
              type="number"
              placeholder={t("subjectPage.form.practicePeriodsPlaceholder")}
              value={formData.soTietThucHanh || ""}
              onChange={(e) =>
                handleChange("soTietThucHanh", Number(e.target.value) || 0)
              }
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end border-t border-other-divider px-5 py-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={"outline"}
              color={"standard"}
              onClick={onCancel}
            >
              {t("subjectPage.form.backButton")}
            </Button>

            <Button type="submit" variant={"contained"} color={"primary"}>
              {initialData
                ? t("subjectPage.form.updateButton")
                : t("subjectPage.form.saveButton")}
            </Button>
          </div>
        </div>
      </form>
    </Overlay>
  );
}
