import { useState } from "react";
import { Button, Icon, Input } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import Pagination from "@/components/atomic/molecules/Panigation/Panigation";
import DynamicTable, {
  type TableColumn,
} from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import AddAssignmentForm from "@/components/atomic/organisms/AddAssignmentForm/AddAssignmentForm";

// Định nghĩa lại Interface cho khớp với ảnh
interface Assignment {
  id: number;
  tenGiangVien: string;
  maMon: string;
  monHoc: string;
}

const columns: TableColumn<Assignment>[] = [
  { title: "ID", key: "id" },
  { title: "Tên giảng viên", key: "tenGiangVien" },
  { title: "Mã môn", key: "maMon" },
  {
    title: "Môn học",
    key: "monHoc",
  },
];

const initialAssignments: Assignment[] = [
  {
    id: 1,
    tenGiangVien: "Lê Hoàng An Đình",
    maMon: "841021",
    monHoc: "Kiến trúc máy tính",
  },
  {
    id: 2,
    tenGiangVien: "Lê Hoàng An Đình",
    maMon: "841058",
    monHoc: "Hệ điều hành mã nguồn mở",
  },
  {
    id: 3,
    tenGiangVien: "Lê Hoàng An Đình",
    maMon: "841059",
    monHoc: "Lập trình hướng đối tượng",
  },
  {
    id: 4,
    tenGiangVien: "Trần Nhật Sinh",
    maMon: "841059",
    monHoc: "Lập trình hướng đối tượng",
  },
  {
    id: 5,
    tenGiangVien: "Lê Hoàng An Đình",
    maMon: "841107",
    monHoc: "Lập trình Java",
  },
  {
    id: 6,
    tenGiangVien: "Trần Nhật Sinh",
    maMon: "841107",
    monHoc: "Lập trình Java",
  },
  {
    id: 7,
    tenGiangVien: "Nguyễn Thanh Sang",
    maMon: "841464",
    monHoc: "Lập trình web và ứng dụng nâng cao",
  },
  {
    id: 8,
    tenGiangVien: "Lê Hoàng An Đình",
    maMon: "841464",
    monHoc: "Lập trình web và ứng dụng nâng cao",
  },
  {
    id: 9,
    tenGiangVien: "Hoàng Gia Bảo",
    maMon: "841464",
    monHoc: "Lập trình web và ứng dụng nâng cao",
  },
  {
    id: 10,
    tenGiangVien: "Trần Nhật Sinh",
    maMon: "841464",
    monHoc: "Lập trình web và ứng dụng nâng cao",
  },
];
export const AssignmentPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [assignments, setAssignments] =
    useState<Assignment[]>(initialAssignments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null
  );

  const handleOpenAdd = () => {
    setEditingAssignment(null);
    setIsModalOpen(true);
  };

  const handleAction = (action: string, item: Assignment) => {
    if (action === "edit") {
      setEditingAssignment(item);
      setIsModalOpen(true);
    } else if (action === "remove") {
      if (
        confirm(
          `Bạn có chắc muốn xóa phân công của giảng viên: ${item.tenGiangVien}?`
        )
      ) {
        setAssignments((prev) => prev.filter((s) => s.id !== item.id));
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSave = (data: Assignment) => {
    if (editingAssignment) {
      setAssignments((prev) => prev.map((s) => (s.id === data.id ? data : s)));
    } else {
      setAssignments((prev) => [...prev, { ...data, id: prev.length + 1 }]);
    }
    setIsModalOpen(false);
  };

  return (
    <MainContentLayout>
      {/* Toolbar */}
      <div className="flex flex-col gap-10 rounded-md bg-background-body-background px-2 py-2">
        <div className="flex justify-between">
          {/* Left: Filter & Search */}
          <div className="flex gap-2">
            <SelectField
              placeholder="Chọn tiêu chí"
              defaultIndex={0}
              options={[
                { label: "Theo môn học", value: 1 },
                { label: "Theo giảng viên", value: 2 },
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
              onClick={handleOpenAdd}
            >
              <Icon name="plus" size={20} />
              Tạo phân công mới
            </Button>
            {isModalOpen && (
              <AddAssignmentForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-2 rounded-md bg-background-body-background px-2 py-2">
        <DynamicTable
          columns={columns}
          data={initialAssignments}
          rowKey="id"
          hasColumnActions
          onAction={handleAction}
        />
        <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
      </div>
    </MainContentLayout>
  );
};
