import { useState } from "react";
import { Button, Icon, Input } from "@/components/atomic/atoms";
import SelectField from "@/components/atomic/atoms/Select/SelectField";
import Pagination from "@/components/atomic/molecules/Panigation/Panigation";
import DynamicTable, {
  type TableColumn,
} from "@/components/atomic/organisms/DynamicTable/DynamicTable";
import MainContentLayout from "@/components/atomic/templates/MainContentLayout/MainContentLayout";
import AddAssignmentForm from "@/components/atomic/organisms/AddAssignmentForm/AddAssignmentForm";
import { useAssign } from "@/hooks/useAssign";
import type { Assign } from "@/types";

export const AssignmentPage = () => {
  const { assigns } = useAssign();
  console.log(assigns);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [assignments, setAssignments] = useState<Assign[]>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editingAssignment, setEditingAssignment] = useState<Assign | null>(
    null
  );

  const columns: TableColumn<Assign>[] = [
    {
      title: "Mã môn",
      key: "monHocId",
      render: (_, item) => {
        console.log("Manh: ", item);
        return item.mon_hoc.maMonHoc || "---";
      },
    },
    {
      title: "Môn học",
      key: "mon_hoc",
      render: (_, item) => item.mon_hoc.tenMonHoc || "---",
    },
    {
      title: "Mã giảng viên",
      key: "giangVienId",
      render: (_, item) => item.giang_vien.ma || "---",
    },
    {
      title: "Tên giảng viên",
      key: "giang_vien",
      render: (_, item) => item.giang_vien.hoTen || "---",
    },
  ];

  console.log("Manh: ", columns);
  const handleOpenAdd = () => {
    setEditingAssignment(null);
    setIsModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAction = (action: string, item: Assign) => {
    // if (action === "edit") {
    //   setEditingAssignment(item);
    //   setIsModalOpen(true);
    // } else if (action === "remove") {
    //   if (
    //     confirm(
    //       `Bạn có chắc muốn xóa phân công của giảng viên: ${item.giangVien?.hoTen}?`
    //     )
    //   ) {
    //     setAssignments((prev) => prev.filter((s) => s.giangVienId !== item.giangVienId));
    //   }
    // }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSave = (data: Assign) => {
    // if (editingAssignment) {
    //   setAssignments((prev) => prev.map((s) => (s.giangVienId === data.giangVienId ? data : s)));
    // } else {
    //   setAssignments((prev) => [...prev, { ...data, id: prev.length + 1 }]);
    // }
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
          data={assigns}
          rowKey="monHocId"
          hasColumnActions
          onAction={handleAction}
        />
        <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
      </div>
    </MainContentLayout>
  );
};
