import { useState } from "react";
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
  const [formData, setFormData] = useState<Subject>(
    initialData ?? {
      monHocId: 0,
      tenMonHoc: "",
      soTinChi: 0,
      soTietLyThuyet: 0,
      soTietThucHanh: 0,
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof Subject, string>>>(
    {}
  );

  const handleChange = (field: keyof Subject, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleValidateAndSave = () => {
    if (!formData.tenMonHoc) {
      setErrors({ tenMonHoc: "Tên môn học không được để trống" });
      return;
    }
    onSave(formData);
  };

  return (
    <Overlay onClose={onCancel}>
      <div className="animate-in fade-in zoom-in-95 flex w-[500px] flex-col overflow-hidden rounded-xl bg-background-paper shadow-2xl duration-200">
        {/* Header */}
        <div className="flex-bet-center border-b border-other-divider px-6 py-2">
          <h6 className="text-body-1 font-bold text-text-primary">
            {initialData ? "Cập nhật môn học" : "Thêm môn học mới"}
          </h6>
          <Button
            variant="text"
            size="small"
            onClick={onCancel}
            className="min-w-0 p-1.5 text-text-secondary"
          >
            <Icon name="close" size={24} />
          </Button>
        </div>

        {/* Body - Sử dụng TextField */}
        <div className="space-y-4 px-6 py-6">
          <TextField
            label="Tên môn học"
            placeholder="Ví dụ: Cấu trúc dữ liệu"
            value={formData.tenMonHoc}
            onChange={(e) => handleChange("tenMonHoc", e.target.value)}
            error={errors.tenMonHoc}
            required
          />

          <div className="grid grid-cols-2 gap-2">
            <TextField
              label="Mã môn học (ID)"
              type="number"
              placeholder="101"
              value={formData.monHocId || ""}
              onChange={(e) => handleChange("monHocId", Number(e.target.value))}
              disabled={!!initialData}
            />
            <TextField
              label="Số tín chỉ"
              type="number"
              placeholder="3"
              value={formData.soTinChi || ""}
              onChange={(e) => handleChange("soTinChi", Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <TextField
              label="Số tiết lý thuyết"
              type="number"
              placeholder="45"
              value={formData.soTietLyThuyet || ""}
              onChange={(e) =>
                handleChange("soTietLyThuyet", Number(e.target.value))
              }
            />
            <TextField
              label="Số tiết thực hành"
              type="number"
              placeholder="30"
              value={formData.soTietThucHanh || ""}
              onChange={(e) =>
                handleChange("soTietThucHanh", Number(e.target.value))
              }
            />
          </div>
        </div>

        {/* Action */}
        <div className="flex justify-end px-5 py-2">
          <div className="flex gap-2">
            <Button variant={"outline"} color={"standard"} onClick={onCancel}>
              Quay lại
            </Button>

            <Button
              variant={"contained"}
              color={"primary"}
              onClick={handleValidateAndSave}
            >
              {initialData ? "Cập nhật" : "Lưu môn học"}
            </Button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}
