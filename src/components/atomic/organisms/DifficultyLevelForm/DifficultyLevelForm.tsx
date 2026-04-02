import { useState, type FormEvent } from "react";
import { Button, Icon } from "@/components/atomic/atoms";
import { TextField } from "@/components/atomic/molecules/TextField/TextField";
import type { DoKho } from "@/types";
import { Overlay } from "../../molecules/Overlay/Overlay";

interface DifficultyLevelFormProps {
  initialData?: DoKho | null;
  onSave: (data: DoKho) => void;
  onCancel: () => void;
}

export function DifficultyLevelForm({
  initialData,
  onSave,
  onCancel,
}: DifficultyLevelFormProps) {
  // Khởi tạo state dựa trên initialData
  const [formData, setFormData] = useState<DoKho>(
    initialData ?? {
      id: 0,
      tenDoKho: "",
    }
  );

  const [error, setError] = useState<string>("");

  const handleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      tenDoKho: value,
    }));

    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (error) setError("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validate dữ liệu
    if (!formData.tenDoKho?.trim()) {
      const errorMsg = "Tên mức độ khó không được để trống";
      setError(errorMsg);
      // Giữ nguyên logic dùng alert từ SubjectForm của bạn
      alert(errorMsg);
      return;
    }

    onSave(formData);
  };

  return (
    <Overlay onClose={onCancel}>
      <form
        onSubmit={handleSubmit}
        className="flex w-[400px] flex-col overflow-hidden rounded-xl bg-background-paper shadow-2xl duration-200 animate-in fade-in zoom-in-95"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-other-divider px-6 py-2">
          <h6 className="text-body-1 font-bold text-text-primary">
            {initialData ? "Cập nhật mức độ khó" : "Thêm mức độ khó mới"}
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
        <div className="px-6 py-8">
          <TextField
            label="Tên mức độ khó"
            placeholder="Ví dụ: Thông hiểu, Vận dụng..."
            value={formData.tenDoKho}
            onChange={(e) => handleChange(e.target.value)}
            error={error}
            autoFocus
          />
          <p className="mt-2 text-xs italic text-text-secondary">
            * Cấp độ khó sẽ được hiển thị khi tạo câu hỏi đề thi.
          </p>
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
              Quay lại
            </Button>

            <Button type="submit" variant={"contained"} color={"primary"}>
              {initialData ? "Cập nhật" : "Lưu mức độ"}
            </Button>
          </div>
        </div>
      </form>
    </Overlay>
  );
}
