import { useState } from "react";
import { Overlay } from "../../molecules/Overlay/Overlay";
import Tabs from "../../molecules/Tabs/Tabs";
import SelectField from "../../atoms/Select/SelectField";
import { Button, Icon, Input } from "../../atoms";
import DynamicTable, {
  type TableColumn,
} from "../../organisms/DynamicTable/DynamicTable";
import Pagination from "../../molecules/Panigation/Panigation";
import type { Subject } from "@/types";
import { Checkbox } from "../../atoms/Checkbox/Checkbox";

interface AddAssignmentFormProps {
  isOpen: boolean;
  onClose: () => void;
}

// Định nghĩa cột cho bảng trong Modal (thêm cột checkbox "Chọn")
const modalColumns: TableColumn<Subject>[] = [
  {
    title: "",
    key: "monHocId", // Dùng tạm key ID
    className: "w-10",
    // Chèn checkbox vào HEADER
    headerRender: () => <Checkbox />,
    // Chèn checkbox vào từng DÒNG
    render: () => <Checkbox />,
  },
  { title: "Mã môn học", key: "monHocId", className: "text-center" },
  { title: "Tên môn học", key: "tenMonHoc" },
  { title: "Số tín chỉ", key: "soTinChi", className: "text-center" },
  {
    title: "Số tiết lý thuyết",
    key: "soTietLyThuyet",
    className: "text-center",
  },
  {
    title: "Số tiết thực hành",
    key: "soTietThucHanh",
    className: "text-center",
  },
];

const mockSubjects: Subject[] = [
  {
    monHocId: 841021,
    tenMonHoc: "Kiến trúc máy tính",
    soTinChi: 3,
    soTietLyThuyet: 30,
    soTietThucHanh: 30,
  },
  {
    monHocId: 841058,
    tenMonHoc: "Hệ điều hành mã nguồn mở",
    soTinChi: 3,
    soTietLyThuyet: 30,
    soTietThucHanh: 30,
  },
  {
    monHocId: 841059,
    tenMonHoc: "Lập trình hướng đối tượng",
    soTinChi: 4,
    soTietLyThuyet: 45,
    soTietThucHanh: 30,
  },
  {
    monHocId: 841107,
    tenMonHoc: "Lập trình Java",
    soTinChi: 4,
    soTietLyThuyet: 45,
    soTietThucHanh: 30,
  },
  {
    monHocId: 841464,
    tenMonHoc: "Lập trình web và ứng dụng nâng cao",
    soTinChi: 4,
    soTietLyThuyet: 45,
    soTietThucHanh: 30,
  },
  {
    monHocId: 841107,
    tenMonHoc: "Lập trình Java",
    soTinChi: 4,
    soTietLyThuyet: 45,
    soTietThucHanh: 30,
  },
];

export default function AddAssignmentForm({
  isOpen,
  onClose,
}: AddAssignmentFormProps) {
  const [selectedTab, setSelectedTab] = useState("handmade");

  if (!isOpen) return null;

  return (
    <Overlay onClose={onClose}>
      <div className="flex w-[1100px] flex-col gap-4 rounded-lg bg-background-paper pb-4 shadow-xl">
        {/* Header Tab */}
        <div className="border-b border-other-outlined-border">
          <Tabs
            value={selectedTab}
            onChange={setSelectedTab}
            tabs={[{ value: "handmade", label: "Thêm thủ công" }]}
          />
        </div>

        <div className="flex max-h-[85vh] flex-col gap-5 overflow-hidden px-6">
          {/* Section: Chọn giảng viên */}
          <div className="mt-2 flex items-center gap-6">
            <span className="text-body-1 whitespace-nowrap font-medium text-text-primary">
              Giảng viên
            </span>
            <SelectField
              classname="flex-1"
              placeholder="Chọn giảng viên cần phân công"
              options={[
                { label: "Nguyễn Hùng Mạnh", value: 1 },
                { label: "Nguyễn Ngọc Thiên Ân", value: 2 },
                { label: "Nguyễn Thanh Hiền", value: 3 },
                { label: "Danh Thị Ngọc Châu", value: 4 },
              ]}
              onSelect={() => {}}
            />
          </div>

          {/* Section: Tìm kiếm môn học */}
          <div className="relative">
            <Input
              hasBoder={true}
              placeholder="Tìm kiếm môn học..."
              className="!w-full"
              icon={<Icon name="search" className="text-text-disabled" />}
            />
          </div>

          {/* Section: Bảng môn học */}
          <DynamicTable
            columns={modalColumns}
            data={mockSubjects}
            rowKey="monHocId"
          />

          {/* Pagination */}
          <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 border-t border-other-outlined-border pt-4">
            <Button variant="outline" color="standard" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button variant="contained" color="primary">
              Lưu phân công
            </Button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}
