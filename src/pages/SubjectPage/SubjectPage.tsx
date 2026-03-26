import { useState } from "react";
import { Button, Icon, Input } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import Pagination from "@/components/atomic/molecules/Panigation/Panigation";
import DynamicTable, {
  type TableColumn,
} from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
// import { SubjectForm } from "./SubjectForm";
import { SubjectForm } from "@/components/atomic/organisms/SubjectForm/SubjectForm";
import type { Subject } from "@/types";
import { useSubjects } from "@/hooks/useSubject";

const columns: TableColumn<Subject>[] = [
  { title: "Mã môn", key: "maMonHoc" },
  {
    title: "Tên môn học",
    key: "tenMonHoc",
  },
  { title: "Tín chỉ", key: "soTinChi", className: "text-center" },
  { title: "Lý thuyết", key: "soTietLyThuyet", className: "text-center" },
  { title: "Thực hành", key: "soTietThucHanh", className: "text-center" },
];

export const SubjectPage = () => {
  const { subjects, isLoading, createSubject, updateSubject, deleteSubject } =
    useSubjects();
  // const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const handleOpenAdd = () => {
    setEditingSubject(null); // Reset về null để form hiểu là thêm mới
    setIsModalOpen(true);
  };

  const handleAction = (action: string, item: Subject) => {
    if (action === "edit" || action === "detail") {
      setEditingSubject(item); // Dữ liệu dòng này sẽ được truyền vào initialData của Form
      setIsModalOpen(true);
    } else if (action === "remove") {
      if (window.confirm(`Bạn có chắc muốn xóa môn: ${item.tenMonHoc}?`)) {
        deleteSubject(item.id); // Gọi API Delete thực tế
      }
    }
  };

  const handleSave = (data: Subject) => {
    if (editingSubject) {
      // Trường hợp Sửa
      updateSubject(data);
    } else {
      // Trường hợp Thêm mới (loại bỏ id: 0 để backend tự sinh nếu cần)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...payload } = data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createSubject(payload as any);
    }
    setIsModalOpen(false);
    setEditingSubject(null);
  };
  return (
    <MainContentLayout>
      {/* Toolbar */}
      <div className="flex flex-col gap-10 rounded-md bg-background-body-background px-2 py-2">
        <div className="flex justify-between">
          {/* Left: Filter & Search */}
          <div className="flex gap-2">
            <Button
              onClick={() =>
                createSubject({
                  maMonHoc: "841013",
                  tenMonHoc: "Lập Trình Web hehe",
                  soTinChi: 3,
                  soTietLyThuyet: 30,
                  soTietThucHanh: 30,
                  isDeleted: 0,
                })
              }
            >
              con bof
            </Button>
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
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-2 rounded-md bg-background-body-background px-2 py-2">
        <DynamicTable
          columns={columns}
          data={subjects}
          rowKey="id"
          hasColumnActions
          onAction={handleAction}
          isLoading={isLoading}
        />
        <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
        {isModalOpen && (
          <SubjectForm
            initialData={editingSubject}
            onSave={handleSave}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingSubject(null);
            }}
          />
        )}
      </div>
    </MainContentLayout>
  );
};
