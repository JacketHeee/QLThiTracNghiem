import { useState } from "react";
import { Button, Icon, Input } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import Pagination from "@/components/atomic/molecules/Panigation/Panigation";
import DynamicTable, {
  type TableColumn,
} from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
// import { SubjectForm } from "./SubjectForm";
import type { Subject } from "@/types";
import { SubjectForm } from "@/components/atomic/organisms/SubjectForm/SubjectForm";

const columns: TableColumn<Subject>[] = [
  { title: "Mã môn", key: "monHocId" },
  {
    title: "Tên môn học",
    key: "tenMonHoc",
  },
  { title: "Tín chỉ", key: "soTinChi", className: "text-center" },
  { title: "Lý thuyết", key: "soTietLyThuyet", className: "text-center" },
  { title: "Thực hành", key: "soTietThucHanh", className: "text-center" },
];

const initialSubjects: Subject[] = [
  {
    monHocId: 101,
    tenMonHoc: "Toán rời rạc",
    soTinChi: 3,
    soTietLyThuyet: 30,
    soTietThucHanh: 0,
  },
  {
    monHocId: 102,
    tenMonHoc: "Mạng máy tính",
    soTinChi: 3,
    soTietLyThuyet: 30,
    soTietThucHanh: 15,
  },
  {
    monHocId: 103,
    tenMonHoc: "Cấu trúc dữ liệu và giải thuật",
    soTinChi: 4,
    soTietLyThuyet: 45,
    soTietThucHanh: 30,
  },
  {
    monHocId: 104,
    tenMonHoc: "Lập trình hướng đối tượng",
    soTinChi: 3,
    soTietLyThuyet: 30,
    soTietThucHanh: 30,
  },
  {
    monHocId: 105,
    tenMonHoc: "Cơ sở dữ liệu",
    soTinChi: 3,
    soTietLyThuyet: 30,
    soTietThucHanh: 30,
  },
  {
    monHocId: 106,
    tenMonHoc: "Hệ điều hành",
    soTinChi: 3,
    soTietLyThuyet: 45,
    soTietThucHanh: 0,
  },
];

export const SubjectPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const handleOpenAdd = () => {
    setEditingSubject(null); // Reset về null để form hiểu là thêm mới
    setIsModalOpen(true);
  };

  const handleAction = (action: string, item: Subject) => {
    if (action === "edit") {
      setEditingSubject(item); // Gán dữ liệu dòng này vào state
      setIsModalOpen(true); // Mở modal
    } else if (action === "remove") {
      if (confirm(`Bạn có chắc muốn xóa môn: ${item.tenMonHoc}?`)) {
        setSubjects((prev) => prev.filter((s) => s.monHocId !== item.monHocId));
      }
    }
  };

  const handleSave = (data: Subject) => {
    if (editingSubject) {
      setSubjects((prev) =>
        prev.map((s) => (s.monHocId === data.monHocId ? data : s))
      );
    } else {
      setSubjects((prev) => [...prev, data]);
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
              onClick={handleOpenAdd}
            >
              <Icon name="plus" size={20} />
              Tạo môn học mới
            </Button>
            {isModalOpen && (
              <SubjectForm
                initialData={editingSubject} // Truyền dữ liệu (null hoặc object)
                onSave={handleSave}
                onCancel={() => setIsModalOpen(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-2 rounded-md bg-background-body-background px-2 py-2">
        <DynamicTable
          columns={columns}
          data={subjects}
          rowKey="monHocId"
          hasColumnActions
          onAction={handleAction}
        />
        <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
      </div>
    </MainContentLayout>
  );
};
