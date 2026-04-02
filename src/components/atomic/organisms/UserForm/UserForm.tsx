import { useState, type FormEvent } from "react";
import { Button, Icon } from "@/components/atomic/atoms";
import { TextField } from "@/components/atomic/molecules/TextField/TextField";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import type { TaiKhoan, UserBase, UserCreate, UserUpdate } from "@/types";
import { Overlay } from "../../molecules/Overlay/Overlay";
import Tabs from "../../molecules/Tabs/Tabs";
import { RadioGroup } from "../../molecules/RadioGroup/RadioGroup";
import { Toggle } from "../../atoms/Toggle/Toggle";
import { useRole } from "@/hooks/useRole";

interface UserFormProps {
  initialData?: TaiKhoan | null;
  onSaveCreate: (data: UserCreate) => void;
  onSaveUpdate: (id: number, data: UserUpdate) => void;
  onResetPassword: (id: number, password: string) => void;
  onCancel: () => void;
  mode: string;
}

interface selectionCbxRole {
  label: string;
  value: number;
}

export function UserForm({
  initialData,
  onSaveCreate,
  onSaveUpdate,
  onResetPassword,
  onCancel,
  mode,
}: UserFormProps) {
  const [selectedTab, setSelectedTab] = useState("manual");

  const isView = mode === "view";
  const isUpdate = mode === "update";

  const tabs = isUpdate
    ? [{ value: "manual", label: "Sửa" }]
    : isView
      ? [{ value: "manual", label: "Chi Tiết" }]
      : [
          { value: "manual", label: "Thêm thủ công" },
          { value: "file", label: "Thêm từ file" },
        ];

  const { roles } = useRole();
  const roleSelection: selectionCbxRole[] = roles.map((role) => ({
    label: role.tenNhomQuyen,
    value: role.id,
  }));

  const defaultFormData: UserBase = initialData
    ? {
        username: initialData.username,
        email: initialData.email,
        hoTen: initialData.hoTen,
        laGioiTinhNu: initialData.laGioiTinhNu,
        ngaySinh: initialData.ngaySinh
          ? new Date(initialData.ngaySinh).toISOString().split("T")[0]
          : "",
        nhomQuyenId: initialData.nhomQuyenId,
        isLocked: initialData.isLocked,
        isStudent: initialData.isStudent,
      }
    : {
        username: "",
        email: "",
        hoTen: "",
        laGioiTinhNu: false,
        ngaySinh: "",
        nhomQuyenId: null,
        isLocked: false,
        isStudent: true,
      };

  const [formData, setFormData] = useState<UserBase>(defaultFormData);
  const [passwordField, setPasswordField] = useState("");

  const handleChange = <K extends keyof UserBase>(
    field: K,
    value: UserBase[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeIsStudent = (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isStudent: value,
      nhomQuyenId: value ? null : prev.nhomQuyenId,
    }));
  };

  // Xử lý submit form
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isView) return;

    if (isUpdate) {
      if (initialData) {
        onSaveUpdate(initialData.id, formData as UserUpdate);
      }
    } else {
      const data: UserCreate = { ...formData, password: passwordField };
      onSaveCreate(data);
    }
  };

  return (
    <Overlay onClose={onCancel}>
      <div className="flex w-[600px] flex-col gap-3 rounded-lg bg-background-paper pb-2 shadow-2xl">
        <Tabs
          value={selectedTab}
          onChange={setSelectedTab}
          childClassName="flex-1"
          tabs={tabs}
        />

        {selectedTab === "manual" ? (
          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Form Body */}
            <div className="flex max-h-[70vh] flex-col gap-5 overflow-auto px-8 py-4">
              <TextField
                label="Tên đăng nhập"
                placeholder="Nhập tên đăng nhập"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                disabled={isView || isUpdate}
              />

              <TextField
                label="Email"
                type="email"
                placeholder="Nhập địa chỉ email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={isView}
              />

              <TextField
                label="Họ và tên"
                placeholder="Nhập họ và tên"
                value={formData.hoTen}
                onChange={(e) => handleChange("hoTen", e.target.value)}
                disabled={isView}
              />

              <div className="flex items-center gap-4">
                <span className="text-body-2 font-medium text-text-primary">
                  Giới tính
                </span>
                <RadioGroup
                  name="gender"
                  options={[
                    { label: "Nam", value: false },
                    { label: "Nữ", value: true },
                  ]}
                  value={formData.laGioiTinhNu}
                  onChange={(value) => handleChange("laGioiTinhNu", value)}
                  disabled={isView}
                />
              </div>

              <TextField
                label="Ngày sinh"
                type="date"
                value={formData.ngaySinh}
                onChange={(e) => handleChange("ngaySinh", e.target.value)}
                disabled={isView}
              />

              {!formData.isStudent && (
                <div className="flex flex-col gap-1">
                  <span className="text-body-2 font-medium text-text-primary">
                    Nhóm quyền
                  </span>
                  <SelectField
                    classname="w-full"
                    placeholder="Chọn nhóm quyền"
                    options={roleSelection}
                    defaultIndex={roleSelection.findIndex(
                      (r) => r.value === formData.nhomQuyenId
                    )}
                    onSelect={(val) => handleChange("nhomQuyenId", Number(val))}
                    disabled={isView}
                  />
                </div>
              )}

              {!isView && (
                <TextField
                  label={
                    isUpdate
                      ? "Mật khẩu mới (Để trống nếu không đổi)"
                      : "Mật khẩu"
                  }
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={passwordField}
                  onChange={(e) => setPasswordField(e.target.value)}
                />
              )}

              <div className="mt-2 flex items-center justify-between border-t border-other-outlined-border py-2 pt-4">
                <Toggle
                  label="Khóa tài khoản"
                  checked={formData.isLocked}
                  onChange={(e) => handleChange("isLocked", e.target.checked)}
                  disabled={isView}
                />
                <Toggle
                  label="Là sinh viên?"
                  checked={formData.isStudent}
                  onChange={(e) => handleChangeIsStudent(e.target.checked)}
                  disabled={isView}
                />
              </div>

              {isUpdate && initialData && !isView && (
                <div className="flex items-center justify-end">
                  <Button
                    type="button"
                    variant={"outline"}
                    color="primary"
                    onClick={() =>
                      onResetPassword(initialData.id, passwordField)
                    }
                  >
                    Tạo lại mật khẩu nhanh
                  </Button>
                </div>
              )}
            </div>

            {/* Action Footer */}
            <div className="flex justify-end gap-2 border-t border-other-outlined-border px-8 py-4">
              <Button
                type="button"
                variant={"outline"}
                color={"standard"}
                onClick={onCancel}
              >
                Quay lại
              </Button>

              {!isView && (
                <Button type="submit" variant={"contained"} color={"primary"}>
                  {isUpdate ? "Cập nhật" : "Lưu tài khoản"}
                </Button>
              )}
            </div>
          </form>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center gap-4 px-6">
            <Icon name="upload" size={48} className="text-text-disabled" />
            <p className="text-text-secondary">
              Kéo thả file vào đây hoặc nhấn để chọn file
            </p>
            <Button type="button" variant="outline" color="primary">
              Chọn file Excel
            </Button>
          </div>
        )}
      </div>
    </Overlay>
  );
}
