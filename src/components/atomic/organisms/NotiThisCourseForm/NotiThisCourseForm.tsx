import { Button } from "../../atoms";
import { Overlay } from "../../molecules/Overlay/Overlay";
import { TextArea } from "../../molecules/TextArea/TextArea";
import { TextField } from "../../molecules/TextField/TextField";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import type { ThongBaoCreate, ThongBaoResponse } from "@/types";
import {
  ThongBaoThisGroupValidate,
  type ThongBaoError,
} from "@/validate/thongbao.validate";
import { useTranslation } from "react-i18next";

interface NotiThisCourseFormProps {
  onClose: () => void;
  onSaveCreate: (data: ThongBaoCreate) => void;
  selectedItem?: ThongBaoResponse | null;
  mode?: "create" | "view" | "update" | "none";
}

export default function NotiThisCourseForm({
  onClose,
  onSaveCreate,
  selectedItem,
  mode,
}: NotiThisCourseFormProps) {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const defaultFormData: ThongBaoCreate = {
    tieuDe: "",
    noiDung: "",
    nguoiGuiId: user ? user.id : 0,
    nhomHocPhanIds: [],
  };

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

  const handleChange = <K extends keyof ThongBaoCreate>(
    field: K,
    value: ThongBaoCreate[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [errors, setErrors] = useState<ThongBaoError>({});
  const handleSend = () => {
    if (mode === "create") {
      const validationErrors = ThongBaoThisGroupValidate.create(formData);

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
