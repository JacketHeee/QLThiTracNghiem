import { useState } from "react";
import { Button, Icon, Input } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import Pagination from "@/components/atomic/molecules/Panigation/Panigation";
import DynamicTable, {
  type TableColumn,
} from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import type { TaiKhoan } from "@/types";
import { cn } from "@/utils/cn";
import { UserForm } from "@/components/atomic/organisms/UserForm/UserForm";
import { useUser } from "@/hooks/useUser";
import { formatDateTimeVN } from "@/utils";

const columns: TableColumn<TaiKhoan>[] = [
  {
    title: "MSSV",
    key: "ma",
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

// const initialUsers: TaiKhoan[] = [
//   {
//     taiKhoanId: 1,
//     username: "3118410050",
//     hoTen: "Nguyễn Thanh Sang",
//     email: "thanhsang@sgu.edu.vn",
//     laGioiTinhNu: false,
//     ngaySinh: new Date("2023-04-23"),
//     nhomQuyenId: 2,
//     createdAt: new Date("2023-04-24"),
//     isLocked: false,
//     isStudent: false,
//     isDeleted: false,
//   },
//   {
//     taiKhoanId: 2,
//     username: "3118410081",
//     hoTen: "Lê Hoàng An Đình",
//     email: "jackethee@gmail.com",
//     laGioiTinhNu: false,
//     ngaySinh: new Date("2000-05-12"),
//     nhomQuyenId: 2,
//     createdAt: new Date("2023-04-03"),
//     isLocked: false,
//     isStudent: false,
//     isDeleted: false,
//   },
//   {
//     taiKhoanId: 3,
//     username: "3118410132",
//     hoTen: "Nguyễn Viết Hoàng",
//     email: "hoang@gmail.com",
//     laGioiTinhNu: true,
//     ngaySinh: new Date("1990-01-01"),
//     nhomQuyenId: 3,
//     createdAt: new Date("2026-03-03"),
//     isLocked: true,
//     isStudent: true,
//     isDeleted: false,
//   },
// ];

export function UserPage() {
  const { taikhoans } = useUser();
  const [users, setUsers] = useState<TaiKhoan[]>(taikhoans);
  console.log(users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<TaiKhoan | null>(null);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleAction = (action: string, item: TaiKhoan) => {
    if (action === "edit") {
      setEditingUser(item);
      setIsModalOpen(true);
    } else if (action === "remove") {
      if (
        confirm(
          `Bạn có chắc muốn xóa tài khoản: ${item.hoTen} (${item.username})?`
        )
      ) {
        setUsers((prev) => prev.filter((u) => u.id !== item.id));
      }
    }
  };

  const handleSave = (data: TaiKhoan) => {
    if (editingUser) {
      // Logic Cập nhật
      setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
    } else {
      // Logic Thêm mới (Giả lập ID tự tăng)
      const newUser = {
        ...data,
        taiKhoanId: Date.now(),
        createdAt: new Date(),
      };
      setUsers((prev) => [...prev, newUser]);
    }
    setIsModalOpen(false);
  };

  return (
    <MainContentLayout classname="w-full">
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
          {isModalOpen && (
            <UserForm
              initialData={editingUser}
              onSave={handleSave}
              onCancel={() => setIsModalOpen(false)}
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
