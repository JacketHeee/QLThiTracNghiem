import { useState } from "react";
import { Overlay } from "../../molecules/Overlay/Overlay";
import Tabs from "../../molecules/Tabs/Tabs";
import SelectField from "../../atoms/Select/SelectField";
import { Button, Icon, Input } from "../../atoms";
import DynamicTable, {
  type TableColumn,
} from "../../organisms/DynamicTable/DynamicTable";
import Pagination from "../../molecules/Panigation/Panigation";
import type { Assign, AssignmentRequest, Subject } from "@/types";
import { Checkbox } from "../../atoms/Checkbox/Checkbox";
import { useSubject } from "@/hooks/useSubject";
import { useGetGvien } from "@/hooks/useUser";

interface AddAssignmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (x: AssignmentRequest) => void;
  phanCongs: Assign[];
}

export default function AddAssignmentForm({
  isOpen,
  onClose,
  onSave,
  phanCongs,
}: AddAssignmentFormProps) {
  const [selectedTab, setSelectedTab] = useState("handmade");
  const { subjects } = useSubject();

  console.log("phan cong ", phanCongs);

  // Định nghĩa cột cho bảng trong Modal (thêm cột checkbox "Chọn")
  const modalColumns: TableColumn<Subject>[] = [
    {
      title: "",
      key: "id", // Dùng tạm key ID
      className: "w-10",
      // Chèn checkbox vào HEADER
      headerRender: () => <Checkbox />,
      // Chèn checkbox vào từng DÒNG
      render: (value) => (
        <Checkbox
          checked={formData.monHocIds.includes(value)}
          onChange={(e) => handleCheck(value, e.target.checked)}
        />
      ),
    },
    { title: "Mã môn học", key: "id", className: "text-center" },
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

  const handleCheck = (idSelected: number, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        monHocIds: [...prev.monHocIds, idSelected],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        monHocIds: prev.monHocIds.filter((id) => id !== idSelected),
      }));
    }
  };

  const defaultFormData: AssignmentRequest = {
    giangVienId: null,
    monHocIds: [],
  };
  const { taikhoans } = useGetGvien();

  const selections = taikhoans.map((item) => ({
    label: item.hoTen,
    value: item.id,
  }));

  const [formData, setFormData] = useState<AssignmentRequest>(defaultFormData);

  const handleSave = () => {
    onSave(formData);
  };

  const handleSelectGiangVien = (value: string | number) => {
    const giangVienId = typeof value === "number" ? value : Number(value);

    setFormData((prev) => ({
      ...prev,
      giangVienId,
    }));

    // Lọc các môn học đã được phân công cho giảng viên này
    const monHocIds = phanCongs
      .filter((item) => item.giangVienId === giangVienId)
      .map((item) => item.monHocId);

    setFormData((prev) => ({
      ...prev,
      monHocIds,
    }));
  };

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
              options={selections}
              onSelect={(value) => handleSelectGiangVien(value)}
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
          <DynamicTable columns={modalColumns} data={subjects} rowKey="id" />

          {/* Pagination */}
          <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 border-t border-other-outlined-border pt-4">
            <Button variant="outline" color="standard" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Lưu phân công
            </Button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}
