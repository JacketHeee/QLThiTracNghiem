import { useState } from "react";
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

  let tabs = [];

  if (isUpdate) {
    tabs = [{ value: "manual", label: "Sửa" }];
  } else if (isView) {
    tabs = [{ value: "manual", label: "Chi Tiết" }];
  } else {
    tabs = [
      { value: "manual", label: "Thêm thủ công" },
      { value: "file", label: "Thêm từ file" },
    ];
  }

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
        ngaySinh: new Date(initialData.ngaySinh).toISOString().split("T")[0],
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

  const handleChangeIsStudent = <K extends keyof UserBase>(
    field: K,
    value: UserBase[K]
  ) => {
    handleChange(field, value);
    if (value) {
      setFormData((prev) => ({ ...prev, ["nhomQuyenId"]: null }));
    }
  };

  const onSave = (form: UserBase) => {
    if (isUpdate) {
      const data: UserUpdate = form;
      if (initialData) {
        onSaveUpdate(initialData.id, data);
      }
    } else {
      const data: UserCreate = { ...form, password: passwordField };
      onSaveCreate(data);
    }
  };

  return (
    <Overlay onClose={onCancel}>
      <div className="flex w-[600px] flex-col gap-3 rounded-lg bg-background-paper pb-2">
        <Tabs
          value={selectedTab}
          onChange={setSelectedTab}
          childClassName="flex-1"
          tabs={tabs}
        />

        {selectedTab === "manual" ? (
          <>
            {/* Form Body */}
            <div className="flex max-h-[70vh] flex-col gap-5 overflow-auto px-8 py-0">
              <TextField
                label="Tên đăng nhập"
                placeholder="Nhập tên đăng nhập"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                disabled={isView}
              />

              <TextField
                label="Email"
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

              {/* Giới tính - Custom Radio Style */}
              <div className="flex gap-4">
                <span className="text-input-text text-text-primary">
                  Giới tính
                </span>
                <RadioGroup
                  name="gender"
                  options={[
                    { label: "Nam", value: false },
                    { label: "Nữ", value: true },
                  ]}
                  value={formData.laGioiTinhNu ?? true}
                  onChange={(value) => handleChange("laGioiTinhNu", value)}
                  disabled={isView}
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
                onChange={(e) => handleChange("ngaySinh", e.target.value)}
                disabled={isView}
              />

              {!formData.isStudent && (
                <div className="flex flex-col gap-1">
                  <span className="text-input-text text-text-primary">
                    Nhóm quyền
                  </span>
                  <SelectField
                    classname="w-full"
                    placeholder="Chọn nhóm quyền"
                    options={roleSelection}
                    defaultIndex={Number(formData.nhomQuyenId) - 1}
                    onSelect={(val) => handleChange("nhomQuyenId", Number(val))}
                    disabled={isView}
                  />
                </div>
              )}

              {!isView && (
                <TextField
                  label="Mật khẩu"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  // Password thường không trả về từ API vì bảo mật
                  value={passwordField}
                  onChange={(e) => {
                    setPasswordField(e.target.value);
                  }}
                  disabled={isView}
                />
              )}

              {/* Trạng thái - Switch Style */}
              <div className="flex items-center justify-between py-2">
                <Toggle
                  label="Khóa tài khoản"
                  checked={formData.isLocked}
                  onChange={(e) => handleChange("isLocked", e.target.checked)}
                  disabled={isView}
                />
                <Toggle
                  label="Là sinh viên?"
                  checked={formData.isStudent}
                  onChange={(e) =>
                    handleChangeIsStudent("isStudent", e.target.checked)
                  }
                  disabled={isView}
                />
              </div>

              <div className="flex items-center justify-end py-2">
                {isUpdate && initialData && (
                  <Button
                    variant={"outline"}
                    color="primary"
                    disabled={isView}
                    onClick={() =>
                      onResetPassword(initialData.id, passwordField)
                    }
                  >
                    Tạo lại mật khẩu
                  </Button>
                )}
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

                {!isView && (
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => onSave(formData)}
                  >
                    {initialData ? "Cập nhật" : "Lưu"}
                  </Button>
                )}
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
