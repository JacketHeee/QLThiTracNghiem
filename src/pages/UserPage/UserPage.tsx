import { useState } from "react";
import { Button, Icon, Input } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import Pagination from "@/components/atomic/molecules/Panigation/Panigation";
import DynamicTable, {
  type TableColumn,
} from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import type { TaiKhoan, UserUpdate, UserCreate, UserResetPass } from "@/types";
import { cn } from "@/utils/cn";
import { UserForm } from "@/components/atomic/organisms/UserForm/UserForm";
import {
  useCreateUser,
  useDeleteUser,
  useResetPassUser,
  useUpdateUser,
  useUser,
} from "@/hooks/useUser";
import { formatDateTimeVN } from "@/utils";
import { useTranslation } from "react-i18next";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "@/types";

const columns: TableColumn<TaiKhoan>[] = [
  {
    title: "Tên đăng nhập",
    key: "username",
  },
  {
    title: "Họ và tên",
    key: "hoTen",
    render: (_, item) => (
      <div className="flex items-center gap-3">
        {/* Avatar tròn xám */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-action-hover text-text-secondary">
          {item.urlAvatar ? (
            <img
              src={item.urlAvatar}
              alt="avatar"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <Icon name="user" size={20} />
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-primary-main">{item.hoTen}</span>
          <span className="text-caption text-text-disabled">{item.email}</span>
        </div>
      </div>
    ),
  },
  {
    title: "Giới tính",
    key: "laGioiTinhNu",
    render: (val) => (val ? "Nữ" : "Nam"),
  },
  {
    title: "Ngày sinh",
    key: "ngaySinh",
    render: (val) => (val ? new Date(val).toISOString().split("T")[0] : "---"),
  },
  {
    title: "Nhóm quyền",
    key: "nhomQuyenId",
    render: (val) => (
      <span className="text-text-primary">
        {val === 1 ? "Quản trị viên" : val === 2 ? "Giảng viên" : "Sinh viên"}
      </span>
    ),
  },
  {
    title: "Ngày tham gia",
    key: "created_at",
    render: (val) => formatDateTimeVN(val),
  },
  {
    title: "Trạng thái",
    key: "isLocked",
    render: (val) => (
      <div
        className={cn(
          "inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-bold leading-none",
          !val
            ? "bg-success-background text-alert-success-content"
            : "bg-error-background text-alert-error-content"
        )}
      >
        {!val ? "Hoạt động" : "Bị khóa"}
      </div>
    ),
  },
];

export function UserPage() {
  const { taikhoans } = useUser();
  console.log("taikhoan", taikhoans);
  const [editingUser, setEditingUser] = useState<TaiKhoan | null>(null);
  const { t } = useTranslation();
  const { createUserAsync, isCreating } = useCreateUser();
  const { updateUserAsync, isUpdating } = useUpdateUser();

  const { deleteUserAsync, isDeleting } = useDeleteUser();
  const { resetPasswordUserAsync, isResetting } = useResetPassUser();

  const defaultModalState = {
    open: false,
    mode: "none",
  } as const;

  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: "create" | "view" | "update" | "none";
  }>(defaultModalState);

  const closeModal = () => {
    setModalState(defaultModalState);
  };

  const openInsertModal = () => {
    setModalState({
      open: true,
      mode: "create",
    });
  };

  const openUpdateModal = (item: TaiKhoan) => {
    setModalState({
      open: true,
      mode: "update",
    });
    setEditingUser(item);
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    openInsertModal();
  };

  const insertUser = async (data: UserCreate) => {
    console.log("create", data);
    if (!validateCreate(data)) return;
    try {
      await createUserAsync(data);
      alert(t("message.success.create"));
      closeModal();
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.status === 422) {
        //lỗi validate backend
        const errors = err.response?.data?.errors;

        const firstError = Object.values(errors)?.[0];

        if (Array.isArray(firstError)) {
          alert(firstError[0]);
        }
      } else {
        alert(t("message.error.create"));
      }
    }
  };

  const updateUser = async (id: number, data: UserUpdate) => {
    console.log("update", data);
    if (!validateUpdate(data)) {
      return;
    }
    try {
      await updateUserAsync({ id, data });
      alert(t("message.success.update"));
      closeModal();
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.status === 422) {
        //lỗi validate backend
        const errors = err.response.data.errors;

        const firstError = Object.values(errors)?.[0];

        if (Array.isArray(firstError)) {
          alert(firstError[0]);
        }
      } else {
        alert(t("message.error.update"));
      }
    }
  };

  const deleteUser = async (data: number) => {
    const isConfirm = window.confirm("Bạn có chắc muốn xóa không?");
    if (!isConfirm) return;
    try {
      await deleteUserAsync(data);
      alert(t("message.success.delete"));
      closeModal();
    } catch {
      alert(t("message.error.delete"));
    }
  };

  const resetPassword = async (id: number, password: string) => {
    const data: UserResetPass = {
      newPassword: password,
    };
    const isConfirm = window.confirm("Bạn có chắc muốn đổi mật khẩu không?");
    if (!isConfirm) return;
    if (!validateChangePass(password)) return;
    try {
      console.log("update", id, data);
      await resetPasswordUserAsync({ id, data });
      alert(t("message.success.update"));
      closeModal();
    } catch {
      alert(t("message.error.update"));
    }
  };

  // const updateUser = (id: number, user: UserUpdate) => {
  //   console.log("update", id, user);
  // }

  // const resetPassword = (id: number, password: string) => {
  //   console.log("change pass", password);
  // }

  // const deleteUser = (id: number) => {
  //   console.log("xoa ", id)
  // }

  const detail = (data: TaiKhoan) => {
    setModalState({
      open: true,
      mode: "view",
    });
    setEditingUser(data);
  };

  const handleAction = (
    action: "detail" | "edit" | "remove",
    item: TaiKhoan
  ) => {
    // console.log(`Đang thực hiện ${action} cho nhóm: ${item.tenNhomQuyen}`);

    switch (action) {
      case "detail":
        detail(item);
        break;

      case "edit":
        openUpdateModal(item);
        break;

      case "remove":
        deleteUser(item.id);
        break;

      default:
        break;
    }
  };

  const validateCreate = (request: UserCreate): boolean => {
    if (!request.username || request.username.trim() === "") {
      alert("Tên đăng nhập không được để trống");
      return false;
    }

    if (!request.email || request.email.trim() === "") {
      alert("Email không được để trống");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      alert("Email không đúng định dạng");
      return false;
    }

    if (!request.hoTen || request.hoTen.trim() === "") {
      alert("Họ tên không được để trống");
      return false;
    }

    if (request.hoTen.length > 255) {
      alert("Họ tên không được vượt quá 255 ký tự");
      return false;
    }

    if (!request.ngaySinh) {
      alert("Ngày sinh không được để trống");
      return false;
    }

    const today = new Date();
    const birthDate = new Date(request.ngaySinh);
    if (birthDate >= today) {
      alert("Ngày sinh phải trước ngày hôm nay");
      return false;
    }

    if (!request.password || request.password.trim() === "") {
      alert("Mật khẩu không được để trống");
      return false;
    }

    if (request.password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }

    if (!/[a-zA-Z]/.test(request.password)) {
      alert("Mật khẩu phải chứa chữ cái");
      return false;
    }

    if (!/[0-9]/.test(request.password)) {
      alert("Mật khẩu phải chứa số");
      return false;
    }

    if (!/[A-Z]/.test(request.password) || !/[a-z]/.test(request.password)) {
      alert("Mật khẩu phải có chữ hoa và chữ thường");
      return false;
    }

    if (!request.isStudent && request.nhomQuyenId === null) {
      alert("Vui lòng chọn nhóm quyền");
      return false;
    }

    return true;
  };

  const validateUpdate = (request: UserUpdate): boolean => {
    if (!request.username || request.username.trim() === "") {
      alert("Tên đăng nhập không được để trống");
      return false;
    }

    if (!request.email || request.email.trim() === "") {
      alert("Email không được để trống");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      alert("Email không đúng định dạng");
      return false;
    }

    if (!request.hoTen || request.hoTen.trim() === "") {
      alert("Họ tên không được để trống");
      return false;
    }

    if (request.hoTen.length > 255) {
      alert("Họ tên không được vượt quá 255 ký tự");
      return false;
    }

    if (!request.ngaySinh) {
      alert("Ngày sinh không được để trống");
      return false;
    }

    const today = new Date();
    const birthDate = new Date(request.ngaySinh);
    if (birthDate >= today) {
      alert("Ngày sinh phải trước ngày hôm nay");
      return false;
    }

    if (!request.isStudent && request.nhomQuyenId === null) {
      alert("Vui lòng chọn nhóm quyền");
      return false;
    }

    return true;
  };

  const validateChangePass = (password: string): boolean => {
    if (!password || password.trim() === "") {
      alert("Mật khẩu không được để trống");
      return false;
    }

    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }

    if (!/[a-zA-Z]/.test(password)) {
      alert("Mật khẩu phải chứa chữ cái");
      return false;
    }

    if (!/[0-9]/.test(password)) {
      alert("Mật khẩu phải chứa số");
      return false;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      alert("Mật khẩu phải có chữ hoa và chữ thường");
      return false;
    }
    return true;
  };

  return (
    <MainContentLayout classname="w-full">
      {/* Xử lý loading ở đây nhen */}
      {isCreating && isUpdating && isDeleting && isResetting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
          Loading...
        </div>
      )}
      <div className="flex justify-between rounded-md bg-background-body-background px-2 py-2">
        {/* Left */}
        <div className="flex gap-2">
          <SelectField
            placeholder="Lọc theo vai trò"
            options={[
              { label: "Tất cả", value: 0 },
              { label: "Sinh viên", value: 3 },
              { label: "Giảng viên", value: 2 },
              { label: "Quản trị", value: 1 },
            ]}
            onSelect={(val) => console.log("Filter role:", val)}
            // defaultIndex={0}
          />
          <Input
            hasBoder={true}
            placeholder="Tìm kiếm MSSV ..."
            icon={<Icon name="search" className="text-text-disabled" />}
          />
        </div>

        {/* Right */}
        <div className="flex gap-2">
          <Button variant={"outline"}>
            <Icon name="arrowUpDown" />
          </Button>

          <Button
            variant={"contained"}
            color={"primary"}
            onClick={handleOpenAdd}
          >
            <Icon name="plus" size={20} />
            Tạo tài khoản mới
          </Button>
          {/* User Form Modal */}
          {modalState.open && (
            <UserForm
              initialData={editingUser}
              onSaveCreate={insertUser}
              onSaveUpdate={updateUser}
              onResetPassword={resetPassword}
              onCancel={() => closeModal()}
              mode={modalState.mode}
            />
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-2 rounded-md bg-background-body-background px-2 py-2">
        <DynamicTable
          columns={columns}
          data={taikhoans}
          rowKey="ma"
          hasColumnActions
          onAction={handleAction}
        />
        <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
      </div>
    </MainContentLayout>
  );
}
