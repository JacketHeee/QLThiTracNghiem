import { useState } from "react";
import { Button, Icon } from "@/components/atomic/atoms";
import { TextField } from "@/components/atomic/molecules/TextField/TextField";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import type { TaiKhoan } from "@/types";
import { Overlay } from "../../molecules/Overlay/Overlay";
import Tabs from "../../molecules/Tabs/Tabs";
import { RadioGroup } from "../../molecules/RadioGroup/RadioGroup";
import { Toggle } from "../../atoms/Toggle/Toggle";

interface UserFormProps {
  initialData?: TaiKhoan | null;
  onSave: (data: TaiKhoan) => void;
  onCancel: () => void;
}

export function UserForm({ initialData, onSave, onCancel }: UserFormProps) {
  const [selectedTab, setSelectedTab] = useState("manual");

  const [formData, setFormData] = useState<Partial<TaiKhoan>>(
    initialData ?? {
      username: "",
      email: "",
      hoTen: "",
      laGioiTinhNu: false,
      ngaySinh: undefined,
      nhomQuyenId: 3,
      isLocked: false,
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: keyof TaiKhoan, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Overlay onClose={onCancel}>
      <div className="flex w-[600px] flex-col gap-3 rounded-lg bg-background-paper pb-2">
        {/* Tabs Header */}
        {/* Tab */}
        <Tabs
          value={selectedTab}
          onChange={setSelectedTab}
          childClassName="flex-1"
          tabs={[
            { value: "manual", label: "Thêm thủ công" },
            { value: "file", label: "Thêm từ file" },
          ]}
        />

        {selectedTab === "manual" ? (
          <>
            {/* Form Body */}
            <div className="flex max-h-[70vh] flex-col gap-5 overflow-auto px-8 py-0">
              <TextField
                label="Mã sinh viên"
                placeholder="Nhập mã sinh viên"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
              />

              <TextField
                label="Email"
                placeholder="Nhập địa chỉ email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />

              <TextField
                label="Họ và tên"
                placeholder="Nhập họ và tên"
                value={formData.hoTen}
                onChange={(e) => handleChange("hoTen", e.target.value)}
              />

              {/* Giới tính - Custom Radio Style */}
              <div className="flex gap-4">
                <span className="text-input-text text-text-primary">
                  Giới tính
                </span>
                <RadioGroup
                  name="gender"
                  options={[
                    { label: "Nam", value: "1" },
                    { label: "Nữ", value: "1" },
                  ]}
                  onChange={() => {}}
                />
              </div>

              <TextField
                label="Ngày sinh"
                type="date"
                placeholder="Ngày sinh"
                value={
                  formData.ngaySinh
                    ? new Date(formData.ngaySinh).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleChange("ngaySinh", new Date(e.target.value))
                }
              />

              <div className="flex flex-col gap-1">
                <span className="text-input-text text-text-primary">
                  Nhóm quyền
                </span>
                <SelectField
                  classname="w-full"
                  placeholder="Chọn nhóm quyền"
                  options={[
                    { label: "Admin", value: 1 },
                    { label: "Giảng viên", value: 2 },
                    { label: "Sinh viên", value: 3 },
                  ]}
                  defaultIndex={Number(formData.nhomQuyenId) - 1}
                  onSelect={(val) => handleChange("nhomQuyenId", val)}
                />
              </div>

              <TextField
                label="Mật khẩu"
                type="password"
                placeholder="Nhập mật khẩu"
                // Password thường không trả về từ API vì bảo mật
                onChange={() => {}}
              />

              {/* Trạng thái - Switch Style */}
              <div className="flex items-center justify-between py-2">
                <span className="text-text-primary">Trạng thái</span>
                <Toggle
                  checked={!formData.isLocked}
                  onChange={(e) => handleChange("isLocked", !e.target.checked)}
                />
              </div>
            </div>

            {/* Action */}
            <div className="flex justify-end px-5 py-2">
              <div className="flex gap-2">
                <Button
                  variant={"outline"}
                  color={"standard"}
                  onClick={onCancel}
                >
                  Quay lại
                </Button>

                <Button
                  variant={"contained"}
                  color={"primary"}
                  onClick={() => onSave(formData as TaiKhoan)}
                >
                  {initialData ? "Cập nhật" : "Lưu môn học"}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center gap-4 px-6">
            <Icon name="upload" size={48} className="text-text-disabled" />
            <p className="text-text-secondary">
              Kéo thả file vào đây hoặc nhấn để chọn file
            </p>
            <Button variant="outline" color="primary">
              Chọn file Excel
            </Button>
          </div>
        )}
      </div>
    </Overlay>
  );
}
