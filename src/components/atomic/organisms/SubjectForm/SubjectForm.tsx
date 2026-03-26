import { useState, useEffect } from "react";
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
  const [formData, setFormData] = useState<Subject>({
    id: 0,
    maMonHoc: "",
    tenMonHoc: "",
    soTinChi: 0,
    soTietLyThuyet: 0,
    soTietThucHanh: 0,
    isDeleted: 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Subject, string>>>(
    {}
  );

  // Reset formData mỗi khi initialData thay đổi (rất quan trọng)
  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(initialData);
    } else {
      setFormData({
        id: 0,
        maMonHoc: "",
        tenMonHoc: "",
        soTinChi: 0,
        soTietLyThuyet: 0,
        soTietThucHanh: 0,
        isDeleted: 0,
      });
    }
    setErrors({}); // Reset lỗi khi mở form mới
  }, [initialData]);

  const handleChange = (field: keyof Subject, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Xóa lỗi nếu có khi người dùng đang sửa
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleValidateAndSave = () => {
    console.log("Manh - Form Data trước khi lưu:", formData);

    // Validate cơ bản
    if (!formData.tenMonHoc?.trim()) {
      setErrors((prev) => ({
        ...prev,
        tenMonHoc: "Tên môn học không được để trống",
      }));
      alert("Vui lòng nhập Tên môn học");
      return;
    }

    if (!formData.maMonHoc?.trim()) {
      setErrors((prev) => ({
        ...prev,
        maMonHoc: "Mã môn học không được để trống",
      }));
      alert("Vui lòng nhập Mã môn học");
      return;
    }

    // Gọi onSave để lưu dữ liệu
    onSave(formData);
  };

  return (
    <Overlay onClose={onCancel}>
      <div className="flex w-[500px] flex-col overflow-hidden rounded-xl bg-background-paper shadow-2xl duration-200 animate-in fade-in zoom-in-95">
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

        {/* Body */}
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
              label="Mã môn học"
              placeholder="Ví dụ: 841010"
              value={formData.maMonHoc}
              onChange={(e) => handleChange("maMonHoc", e.target.value)}
              disabled={!!initialData} // Không cho sửa mã khi đang edit
              error={errors.maMonHoc}
              required
            />

            <TextField
              label="Số tín chỉ"
              type="number"
              placeholder="3"
              value={formData.soTinChi || ""}
              onChange={(e) =>
                handleChange("soTinChi", Number(e.target.value) || 0)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <TextField
              label="Số tiết lý thuyết"
              type="number"
              placeholder="45"
              value={formData.soTietLyThuyet || ""}
              onChange={(e) =>
                handleChange("soTietLyThuyet", Number(e.target.value) || 0)
              }
            />

            <TextField
              label="Số tiết thực hành"
              type="number"
              placeholder="30"
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
