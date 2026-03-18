import { Button, Icon, Input } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import Pagination from "@/components/atomic/molecules/Panigation/Panigation";
import type { TableColumn } from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import DynamicTable from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import { PermissionForm } from "@/components/atomic/organisms/PermissionForm/PermissionForm";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import type { NhomQuyen, PermissionFormData, PermissionItem } from "@/types";
import { useState } from "react";

const getInitialPermissions = (): PermissionItem[] => [
  {
    key: "nguoi-dung",
    name: "Người dùng",
    actions: { read: false, create: false, update: false, delete: false },
  },
  {
    key: "hoc-phan",
    name: "Học phần",
    actions: { read: false, create: false, update: false, delete: false },
  },
  {
    key: "cau-hoi",
    name: "Câu hỏi",
    actions: { read: false, create: false, update: false, delete: false },
  },
  {
    key: "mon-hoc",
    name: "Môn học",
    actions: { read: false, create: false, update: false, delete: false },
  },
  {
    key: "chuong",
    name: "Chương",
    actions: { read: false, create: false, update: false, delete: false },
  },
  {
    key: "phan-cong",
    name: "Phân công",
    actions: { read: false, create: false, update: false, delete: false },
  },
  {
    key: "de-thi",
    name: "Đề thi",
    actions: { read: false, create: false, update: false, delete: false },
  },
  {
    key: "nhom-quyen",
    name: "Nhóm quyền",
    actions: { read: false, create: false, update: false, delete: false },
  },
  {
    key: "thong-bao",
    name: "Thông báo",
    actions: { read: false, create: false, update: false, delete: false },
  },
];

const totalPages = 5;
const rawData: NhomQuyen[] = [
  { nhomQuyenId: 1, tenNhomQuyen: "Admin", soLuongNguoiDung: 5 },
  { nhomQuyenId: 2, tenNhomQuyen: "Giảng viên", soLuongNguoiDung: 45 },
  { nhomQuyenId: 3, tenNhomQuyen: "Sinh viên", soLuongNguoiDung: 1200 },
];

const columns: TableColumn<NhomQuyen>[] = [
  {
    title: "Mã nhóm",
    key: "nhomQuyenId",
  },
  {
    title: "Tên nhóm quyền",
    key: "tenNhomQuyen",
    render: (value) => (
      <span className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${
            value === "Admin"
              ? "bg-alert-error-content"
              : value === "Giảng viên"
                ? "bg-alert-success-content"
                : "bg-alert-info-content"
          }`}
        />
        {value}
      </span>
    ),
  },
  {
    title: "Số lượng người dùng",
    key: "soLuongNguoiDung",
    className: "text-center",
    render: (value) => (
      <span className="text- text-helper-text rounded-md bg-action-focus px-2.5 py-1">
        {value?.toLocaleString() || 0} thành viên
      </span>
    ),
  },
];
export const PermissionGroupPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAction = (
    action: "detail" | "edit" | "remove",
    item: NhomQuyen
  ) => {
    console.log(`Đang thực hiện ${action} cho nhóm: ${item.tenNhomQuyen}`);

    if (action === "remove") {
      alert(`Xác nhận xóa nhóm: ${item.tenNhomQuyen}`);
    }
  };

  const defaultFormData: PermissionFormData = {
    groupName: "",
    permissions: getInitialPermissions(),
    canTakeExam: false,
    canJoinCourse: true, // Mặc định bật
  };

  const handleSaveGroup = (data: PermissionFormData) => {
    console.log("Dữ liệu cần gửi lên API:", data);
    // Gọi API lưu nhóm quyền ở đây...
    setIsModalOpen(false);
  };

  return (
    <MainContentLayout>
      <div className="flex flex-col gap-10 rounded-md bg-background-body-background px-2 py-2">
        <div className="flex justify-between">
          {/* Left: Filter & Search */}
          <div className="flex gap-2">
            <SelectField
              placeholder="Chọn tiêu chí"
              defaultIndex={0}
              options={[
                { label: "Theo tên", value: 1 },
                { label: "Theo ID", value: 2 },
              ]}
              onSelect={() => {}}
            />
            <Input
              hasBoder={true}
              placeholder="Tìm kiếm"
              icon={<Icon name="search" className="text-text-disabled" />}
            />
          </div>

          {/* Right: Actions */}
          <div className="flex gap-2">
            <Button
              variant={"contained"}
              color={"primary"}
              onClick={() => setIsModalOpen(!isModalOpen)}
            >
              <Icon name="plus" size={20} />
              Tạo nhóm quyền mới
            </Button>
            {isModalOpen && (
              <PermissionForm
                initialData={defaultFormData}
                onSave={handleSaveGroup}
                onCancel={() => setIsModalOpen(false)}
                //className="w-[900px] h-[80vh] rounded-xl" // Tuỳ chỉnh kích thước modal ở đây
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-md bg-background-body-background px-2 py-2">
        <DynamicTable
          columns={columns}
          data={rawData}
          rowKey="nhomQuyenId" // <--- Chỉ định key định danh ở đây
          hasColumnActions={true}
          onAction={handleAction}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* <div className="flex flex-col gap-2"></div> */}
    </MainContentLayout>
  );
};
