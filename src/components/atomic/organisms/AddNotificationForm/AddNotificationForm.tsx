import { useSubject } from "@/hooks/useSubject";
import { Button } from "../../atoms";
import { Checkbox } from "../../atoms/Checkbox/Checkbox";
import SelectField from "../../atoms/Select/SelectField";
import { Overlay } from "../../molecules/Overlay/Overlay";
import { TextArea } from "../../molecules/TextArea/TextArea";
import { TextField } from "../../molecules/TextField/TextField";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import type { ThongBaoCreate, ThongBaoResponse, ThongBaoUpdate } from "@/types";
import {
  ThongBaoValidate,
  type ThongBaoError,
} from "@/validate/thongbao.validate";
import { useTranslation } from "react-i18next";

interface AddNotificationFormProps {
  onClose: () => void;
  onSaveCreate: (data: ThongBaoCreate) => void;
  onSaveUpdate: (id: number, data: ThongBaoUpdate) => void;
  selectedItem: ThongBaoResponse | null;
  mode: "create" | "view" | "update" | "none";
}

type Group = {
  id: number;
  label: string;
  checked: boolean;
};

export default function AddNotificationForm({
  onClose,
  onSaveCreate,
  onSaveUpdate,
  selectedItem,
  mode,
}: AddNotificationFormProps) {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const defaultFormData: ThongBaoCreate = {
    tieuDe: "",
    noiDung: "",
    nguoiGuiId: user ? user.id : 0,
    nhomHocPhanIds: [],
  };
  const [groups, setGroups] = useState<Group[]>([]);
  const { subjectsWithGroup } = useSubject();

  const selectedNotifi: ThongBaoCreate = selectedItem
    ? {
        tieuDe: selectedItem.tieuDe,
        noiDung: selectedItem.noiDung,
        nguoiGuiId: selectedItem.nguoiGuiId,
        nhomHocPhanIds: selectedItem.nhom_hoc_phans.map((nhp) => nhp.id),
      }
    : defaultFormData;

  const [formData, setFormData] = useState<ThongBaoCreate>(selectedNotifi);

  const isCreate = mode === "create";
  const isView = mode === "view";
  const isEdit = mode === "update";

  // const selectedMaMonHoc =
  //   selectedItem?.nhom_hoc_phans?.[0]?.mon_hoc.maMonHoc ?? 0;

  useEffect(() => {
    const selectedMonHocId = selectedItem?.nhom_hoc_phans?.[0]?.monHocId ?? 0;
    // Lấy danh sách nhóm đã chọn
    const selectedNhomIds =
      selectedItem?.nhom_hoc_phans?.map((nhom) => nhom.id) ?? [];

    const loadDataCheckBox = () => {
      const groupOfSubject: Group[] = subjectsWithGroup
        .filter((item) => Number(item.id) === selectedMonHocId)
        .flatMap((item) =>
          item.nhom_hoc_phans.map((nhom) => ({
            id: nhom.id,
            label: nhom.tenNhom,
            checked: selectedNhomIds.includes(nhom.id),
          }))
        );
      setGroups(groupOfSubject);
    };
    if (isEdit || isView) {
      loadDataCheckBox();
    }
  }, [isEdit, isView, selectedItem, subjectsWithGroup]);

  const handleChange = <K extends keyof ThongBaoCreate>(
    field: K,
    value: ThongBaoCreate[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const subjects = subjectsWithGroup.map((item) => ({
    label: item.tenMonHoc,
    value: item.id,
  }));

  const handleSelectSubject = (value: string | number) => {
    if (!value) return;
    const subjectId = typeof value === "number" ? value : Number(value);

    const groupOfSubject: Group[] = subjectsWithGroup
      .filter((item) => item.id === subjectId) //tạm không sửa prop Nhom hoc phan
      .flatMap((item) =>
        item.nhom_hoc_phans.map((nhom) => ({
          id: nhom.id,
          label: nhom.tenNhom,
          checked: false,
        }))
      );

    setGroups(groupOfSubject);
    setFormData((prev) => ({
      ...prev,
      nhomHocPhanIds: [], // reset khi đổi môn học
    }));
  };

  const handleCheck = (id: number, checked: boolean) => {
    setGroups((prev) =>
      prev.map((group) => (group.id === id ? { ...group, checked } : group))
    );

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        nhomHocPhanIds: [...prev.nhomHocPhanIds, id],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        nhomHocPhanIds: prev.nhomHocPhanIds.filter((itemId) => itemId !== id),
      }));
    }
  };

  const handleCheckAll = (checked: boolean) => {
    setGroups((prev) => prev.map((group) => ({ ...group, checked })));

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        nhomHocPhanIds: groups.map((group) => group.id),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        nhomHocPhanIds: [],
      }));
    }
  };

  const [errors, setErrors] = useState<ThongBaoError>({});
  const handleSend = () => {
    // console.log("nhomHocPhanIds", formData.nhomHocPhanIds);
    if (mode === "update") {
      const data: ThongBaoUpdate = {
        nhomHocPhanIds: formData.nhomHocPhanIds,
        tieuDe: formData.tieuDe,
        noiDung: formData.noiDung,
        nguoiGuiId: formData.nguoiGuiId,
      };
      if (!selectedItem) {
        console.log("lỗi thiếu id");
        return;
      }

      const validationErrors = ThongBaoValidate.create(formData);

      // nếu có lỗi
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      onSaveUpdate(selectedItem.id, data);
    } else if (mode === "create") {
      const validationErrors = ThongBaoValidate.create(formData);

      // nếu có lỗi
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      onSaveCreate(formData);
    }
  };

  let title = "";
  switch (mode) {
    case "create":
      title = t("notificationForm.title.create");
      break;
    case "update":
      title = t("notificationForm.title.update");
      break;
    case "view":
      title = t("notificationForm.title.view");
      break;

    default:
      break;
  }

  return (
    <Overlay onClose={onClose}>
      <div className="flex w-[600px] flex-col rounded-lg bg-background-paper pb-2">
        <div className="text-h6 rounded-md bg-background-body-background px-5 pt-4 text-text-primary">
          {title}
        </div>
        <div className="flex flex-col gap-5 rounded-md bg-background-body-background p-5 text-text-secondary">
          <TextField
            label={t("notificationForm.fields.title.label")}
            placeholder={t("notificationForm.fields.title.placeholder")}
            value={formData.tieuDe}
            onChange={(e) => handleChange("tieuDe", e.target.value)}
            disabled={isView}
            error={errors.tieuDe}
          />
          {/*  */}
          <TextArea
            label={t("notificationForm.fields.content.label")}
            placeholder={t("notificationForm.fields.content.placeholder")}
            value={formData.noiDung}
            onChange={(e) => handleChange("noiDung", e.target.value)}
            disabled={isView}
            error={errors.noiDung}
          />

          {/*  */}
          <div className="flex flex-col rounded-md border border-other-outlined-border">
            <div className="flex-bet-center gap-3 rounded-t-md bg-action-hover px-8 py-5 text-text-secondary">
              <span className="text-body-1-semibold">
                {t("notificationForm.assign.label")}
              </span>
              <SelectField
                classname="!flex-[unset] bg-background-body-background"
                placeholder={t("notificationForm.assign.placeholder")}
                options={subjects}
                value={subjects ? subjects[0]?.value : 0}
                onSelect={(value) => {
                  handleSelectSubject(value);
                }}
                disabled={isView}
              />
            </div>

            <div className="flex flex-col px-5 pb-2 text-text-secondary">
              <div className="p-4">
                <Checkbox
                  label={t("notificationForm.selectAll")}
                  onChange={(e) => handleCheckAll(e.target.checked)}
                  disabled={isView}
                />
              </div>

              <div className="flex flex-wrap gap-0">
                {groups.map((group) => (
                  <div key={group.id} className="p-4">
                    <Checkbox
                      label={group.label}
                      checked={group.checked}
                      onChange={(e) => handleCheck(group.id, e.target.checked)}
                      disabled={isView}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {errors.nhomHocPhanIds && (
            <div className="text-sm text-red-500">{errors.nhomHocPhanIds}</div>
          )}

          {/*  */}
          <div className="flex justify-end gap-2">
            <Button variant={"outline"} onClick={onClose}>
              {t("notificationForm.actions.back")}
            </Button>
            {!isView && (
              <Button
                variant={"contained"}
                color={"primary"}
                onClick={handleSend}
              >
                {isCreate
                  ? t("notificationForm.actions.send")
                  : t("notificationForm.actions.save")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Overlay>
  );
}
