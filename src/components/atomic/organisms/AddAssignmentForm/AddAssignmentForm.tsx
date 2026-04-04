import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Overlay } from "../../molecules/Overlay/Overlay";
import Tabs from "../../molecules/Tabs/Tabs";
import SelectField from "../../atoms/Select/SelectField";
import { Button, Icon, Input } from "../../atoms";
import DynamicTable, {
  type TableColumn,
} from "../../organisms/DynamicTable/DynamicTable";
import type { Assign, AssignmentRequest, Subject } from "@/types";
import { Checkbox } from "../../atoms/Checkbox/Checkbox";
import { useSubject } from "@/hooks/useSubject";
import { useGetGvien } from "@/hooks/useUser";
import {
  AssignmentValidate,
  type AssignmentError,
} from "@/validate/phancong.validate";

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
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState("handmade");
  const { subjects } = useSubject();
  const { taikhoans } = useGetGvien();

  const [formData, setFormData] = useState<AssignmentRequest>({
    giangVienId: null,
    monHocIds: [],
  });

  if (!isOpen) return null;

  const selections = taikhoans.map((item) => ({
    label: item.hoTen,
    value: item.id,
  }));

  // Định nghĩa cột cho bảng
  const modalColumns: TableColumn<Subject>[] = [
    {
      title: "",
      key: "id",
      className: "w-10",
      headerRender: () => <Checkbox />,
      render: (value) => (
        <Checkbox
          checked={formData.monHocIds.includes(Number(value))}
          onChange={(e) => handleCheck(Number(value), e.target.checked)}
        />
      ),
    },
    {
      title: t("addAssignmentForm.subjectCode"),
      key: "id",
      className: "text-center",
    },
    { title: t("addAssignmentForm.subjectName"), key: "tenMonHoc" },
    {
      title: t("addAssignmentForm.credits"),
      key: "soTinChi",
      className: "text-center",
    },
    {
      title: t("addAssignmentForm.theoryPeriods"),
      key: "soTietLyThuyet",
      className: "text-center",
    },
    {
      title: t("addAssignmentForm.practicePeriods"),
      key: "soTietThucHanh",
      className: "text-center",
    },
  ];

  const handleCheck = (idSelected: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      monHocIds: checked
        ? [...prev.monHocIds, idSelected]
        : prev.monHocIds.filter((id) => id !== idSelected),
    }));
  };

  const handleSelectGiangVien = (value: string | number) => {
    const giangVienId = typeof value === "number" ? value : Number(value);

    // Lọc các môn học đã được phân công cho giảng viên này từ danh sách phanCongs truyền vào
    const activeMonHocIds = phanCongs
      .filter((item) => item.giangVienId === giangVienId)
      .map((item) => item.monHocId);

    setFormData({
      giangVienId,
      monHocIds: activeMonHocIds,
    });
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [errors, setErrors] = useState<AssignmentError>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.giangVienId) {
      alert(t("addAssignmentForm.selectTeacherPrompt"));
      return;
    }
    const validationErrors = AssignmentValidate.create(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave(formData);
  };

  return (
    <Overlay onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="flex w-[1100px] flex-col gap-4 rounded-lg bg-background-paper pb-4 shadow-xl"
      >
        {/* Header Tab */}
        <div className="border-b border-other-outlined-border">
          <Tabs
            value={selectedTab}
            onChange={setSelectedTab}
            tabs={[
              { value: "handmade", label: t("addAssignmentForm.addManually") },
            ]}
          />
        </div>

        <div className="flex max-h-[85vh] flex-col gap-5 overflow-hidden px-6">
          {/* Section: Chọn giảng viên */}
          <div className="mt-2 flex items-center gap-6">
            <span className="text-body-1 whitespace-nowrap font-medium text-text-primary">
              {t("addAssignmentForm.teacher")}
            </span>
            <SelectField
              classname="flex-1"
              placeholder={t("addAssignmentForm.selectTeacherPlaceholder")}
              options={selections}
              onSelect={(value) => handleSelectGiangVien(value)}
            />
          </div>

          {/* Section: Tìm kiếm môn học */}
          <div className="relative">
            <Input
              hasBoder={true}
              placeholder={t("addAssignmentForm.searchSubjectPlaceholder")}
              className="!w-full"
              icon={<Icon name="search" className="text-text-disabled" />}
            />
          </div>

          {/* Section: Bảng môn học */}
          <div className="flex-1 overflow-auto">
            <DynamicTable columns={modalColumns} data={subjects} rowKey="id" />
          </div>

          {errors.monHocIds && (
            <div className="text-sm text-red-500">{errors.monHocIds}</div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 border-t border-other-outlined-border pt-4">
            <Button
              type="button"
              variant="outline"
              color="standard"
              onClick={onClose}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!formData.giangVienId}
            >
              {t("common.saveAssignment")}
            </Button>
          </div>
        </div>
      </form>
    </Overlay>
  );
}
